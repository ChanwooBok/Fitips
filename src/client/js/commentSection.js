const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const btn = form.querySelector("button");

const addCommnet = (text) => {
  //  constructing HTML elements with JS -> realtime comments
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  newComment.appendChild(icon);
  newComment.appendChild(span);
  videoComments.prepend(newComment); // prepend는 맨 위에 추가함. / appendChild는 맨 밑에 추가함.
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  if (text === "" || text.trim() === "") {
    return;
  }
  const videoId = videoContainer.dataset.id;
  const { status } = await fetch(`/api/videos/${videoId}/comment`, {
    // fetch는 promise<Response> 기다리면 response라는 것을 준다.
    method: "POST",
    headers: {
      "Content-Type": "application/json", // request에 대한 정보를 담고있는 headers / 백엔드야 json을 string처럼 만들어서 보내고 있다.라고 알려주는것.
    },
    body: JSON.stringify({ text }), // json object를 string으로 바꿔서 보내지만 백엔드에서는 express.json()을 써주었기 때문에 다시 json으로 바꿔서 받아들일것.
  });
  textarea.value = "";
  if (status == 201) {
    addCommnet(text);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
