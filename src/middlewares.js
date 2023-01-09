import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Fitips";
  res.locals.loggedInUser = req.session.user || {};
  next();
  // putting stuff in local so that pug template can approach those data.
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    return res.redirect("/login");
  } // only allowing loggedInUser to move on to next page.
};

export const publicOnlyMiddelware = (req, res, next) => {
  if (!req.session.loggedIn) {
    next();
  } else {
    return res.redirect("/");
  } // only allowing not loggedInUser to move on to next page ( public page ).
};

export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000000,
  },
}); // 프로필이미지 등록시, 파일사이즈크기를 제한함.

export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 10000000,
  },
}); // 영상등록시, 파일사이즈크기를 제한함.
