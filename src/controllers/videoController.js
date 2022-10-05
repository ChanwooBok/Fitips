import User from "../models/User";
import Video from "../models/Video";

// js의 단점은 기다리는 기능이 없어서 아무리 위에서 아래로 읽어도 database에서 불러오는 시간이 있어서 순서가 꼬인다.
//그래서 callback function을 썼었다.
/*
Video.find({}, (error,videos)=>{
  if(error){
    return res.render("server-error");
  }
  return res.render("home", { pageTitle: "Home", videos });
})
*/

// 반면,await는 database에게 결과값을 받을때까지 js가 기다리게 해줄 수 있다 -> 코드의 가독성이 높아진다.
export const home = async (req, res) => {
  try {
    const videos = await Video.find({})
      .sort({ createdAt: "desc" })
      .populate("owner");
    //하지만 callback function과 달리 promise방식은 error 가 어디서 오는지 명확하지가 않다.그래서 try catch 방법을 쓴다
    return res.render("home", { pageTitle: "Home", videos });
    //1. return의 역할 : 본질적인 return의 역할보다는 function을 마무리짓는 역할로 사용되고 있음.
    //- 이러한 경우 return이 없어도 정상적으로 동작하지만 실수를 방지하기 위해 return을 사용
    //2. render한 것은 다시 render할 수 없음
  } catch (error) {
    return res.render("server-error", { error });
  }
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner");
  if (!video) {
    return res.render("404", { pagetitle: "video not found" });
  }
  console.log(video.owner.name);
  return res.render("watch", { pageTitle: `Watching: ${video.title}`, video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pagetitle: "video not found" });
  }
  return res.render("edit", {
    pageTitle: `Editing ${video.title}`,
    video,
  });
};
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.status(404).render("404", { pagetitle: "video not found" });
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};

export const search = async (req, res) => {
  const { keyword } = req.query; // form ( method = GET )
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
        // MongoDB offers evaluation operators "$regex" :Selects documents where values match a specified regular expression.
        // https://www.mongodb.com/docs/manual/reference/operator/query/

        // "i" : flag i -> 대소문자 구분x
        // `${keyword}$` : ends with keyword
        // `^${keyword}` : starts with keyword
        // keyword : contains keyword
        // $gt : 3  -> 3보다 큰 비디오만 보이게..
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "search video", videos });
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
  } = req;
  const { path: fileUrl } = req.file;
  const { title, description, hashtags } = req.body;
  // 1. 직접 Video.create()하여 한번에 생성 후 db저장까지 하는 방법.
  try {
    const newVideo = await Video.create({
      title,
      description,
      owner: _id,
      fileUrl,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    console.log(newVideo._id);
    user.videos.push(newVideo._id);
    user.save(); // save() 발생 시, 실행되는 middleware bug fix
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }

  /* 2. Javascript object만들고 직접 save() 하는 방법
  const video = await(new Video({
    title,
    description,
    createdAt: Date.now(),
    hashtags: hashtags.split(",").map((word) => `#${word}`),
    meta: {
      views: 0,
      rating: 0,
    },
  })).save();
  */
  // video.save(); -> return promise -> db에 저장되고 기록되는데 시간이 걸림 -> async await로 기다려주기.
  return res.redirect("/");
};
export const deleteVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  await Video.findByIdAndDelete(id);

  return res.redirect("/");
};

export const registerView = async (req, res) => {
  const {
    params: { id },
  } = req;

  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200); // .status(200) : render( ) 하기 전에 상태 코드를 정할 수 있음 VS sendStatus(200): 상태를 보내고 연결을 끊음
};
