import db from "../models/index";
import {
  CreateNewUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../services/mysql";

let homeController = async (req, res) => {
  try {
    let data = await db.User.findAll();
    return res.render("homepage.ejs", {
      data: JSON.stringify(data),
    });
  } catch (e) {
    console.log(e);
  }
};
let aboutPage = (req, res) => {
  return res.render("aboutpage.ejs");
};

let signIn = (req, res) => {
  return res.render("signin.ejs");
};
let postForm = async (req, res) => {
  await CreateNewUser(req.body);
  return res.redirect("/");
};

let displayUser = async (req, res) => {
  let data = await getAllUsers();
  return res.render("displayUser.ejs", { data });
};

let editUser = async (req, res) => {
  if (req.query && req.query.id) {
    let data = await getUserById(req.query.id);
    return res.render("editUser.ejs", { data });
  }
  return res.send("none data");
};

let updated = async (req, res) => {
  let user = await req.body;
  if (user) {
    await updateUser(user);
    return res.redirect("/display");
  }

  return res.send("error");
};

let deleting = async (req, res) => {
  await deleteUser(req.query.id);
  return res.redirect("/display");
};

module.exports = {
  homeController,
  aboutPage,
  signIn,
  postForm,
  displayUser,
  editUser,
  updated,
  deleting,
};
