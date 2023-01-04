import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "JOIN" });
};

export const postJoin = async (req, res) => {
  const {
    body: { name, email, username, password, password2, location },
  } = req;
  const pageTitle = "Join";
  if (password != password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "password doesn't match",
    });
  }
  const exists = await User.exists({ $or: [{ username }, { email }] });

  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "this username or email is already taken",
    });
  }
  try {
    await User.create({
      name,
      email,
      username,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "error",
    });
  }
};

export const getEdit = (req, res) => {
  const user = res.locals.loggedInUser;
  return res.render("edit-profile", {
    pageTitle: `Edit ${user.name}'s Profile`,
  });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { avatarUrl, _id, name: sessionName },
    },
    body: { name, email, username, location },
    file,
  } = req;
  const findUsername = await User.findOne({ username });
  const findEmail = await User.findOne({ email });
  if (
    (findUsername != null && findUsername._id != _id) ||
    (findEmail != null && findEmail._id != _id)
  ) {
    return res.render("edit-profile", {
      pageTitle: `Edit ${sessionName}'s Profile`,
      errorMessage: "username or email already exists",
    });
  }
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.path : avatarUrl,
      name,
      email,
      username,
      location,
    },
    { new: true }
  );
  req.session.user = updatedUser; // session의 user도 업데이트
  return res.redirect("/users/edit");
};

export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Sign In" });
};

export const postLogin = async (req, res) => {
  const {
    body: { username, password },
  } = req;
  const pageTitle = "Login";
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username does not exists",
    });
  }
  const ok = await bcrypt.compare(password, user.password); // 비밀번호 체크
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "password does not match",
    });
  }

  req.session.loggedIn = true;
  req.session.user = user;

  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: "06d21b73037a5f32127c",
    allow_signup: true,
    scope: "read:user user:email", // A space-delimited list of scopes. -doc
    // we can set up the scope that we want to get from github
  };
  const params = new URLSearchParams(config); // params을 연결해주는 javascript기능.
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLINET,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.verified == true && email.primary == true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/");
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
export const see = async (req, res) => {
  const {
    params: { id },
  } = req;
  const user = await User.findById(id).populate({
    path: "videos",
    populate: {
      path: "owner",
      model: "User",
    },
  });
  if (!user) {
    return res.status(400).render("404", { pageTitle: "User not found" });
  }
  return res.render("users/profile", {
    pageTitle: user.name,
    user,
  });
};

export const getChangePassword = (req, res) => {
  const {
    session: { user },
  } = req;
  return res.render("users/change-password", {
    pageTitle: "Change password",
  });
};

export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldPwd, newPwd, newPwdConfirm },
  } = req;
  if (newPwd != newPwdConfirm) {
    return res.status(400).render("change-password", {
      pageTitle: "Change Password",
      errorMessage: "password confirmation does not match",
    });
  }
  const user = await User.findById(_id);
  // 비밀번호 일치여부
  const match = await bcrypt.compare(oldPwd, user.password);
  if (!match) {
    return res.status(400).render("change-password", {
      pageTitle: "Change Password",
      errorMessage: "wrong password",
    });
  }
  if (oldPassword === newPassword) {
    return res.status(400).render("change-password", {
      pageTitle,
      errorMessage: "The old password equals new password",
    });
  }
  user.password = newPwd;
  await user.save();
  req.session.destroy();
  return res.redirect("/login");
};
