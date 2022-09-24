import User from "../models/User";
import bcrypt from "bcrypt";

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
    console.log("exists");
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

export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");

export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Sign In" });
};

export const postLogin = async (req, res) => {
  const {
    body: { username, password },
  } = req;
  const pageTitle = "Login";
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username does not exists",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "password does not match",
    });
  }
  return res.redirect("/");
};

export const logout = (req, res) => res.send("Log out");
export const see = (req, res) => res.send("See User");
