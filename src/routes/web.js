import express from "express";
import {
  homeController,
  aboutPage,
  signIn,
  postForm,
  displayUser,
  editUser,
  updated,
  deleting,
} from "../controllers/homeController";

import {
  handleLogin,
  handleGetAllUser,
  handleCreateUser,
  handleEditUser,
  handleDeleteUser,
  getAllCode,
} from "../controllers/userController";
let router = express.Router();

let initWebRounters = (app) => {
  router.get("/", homeController);
  router.get("/about", aboutPage);
  router.get("/sign-in", signIn);
  router.post("/post", postForm);
  router.get("/display", displayUser);
  router.get("/edit", editUser);
  router.post("/edit-done", updated);
  router.get("/delete", deleting);

  router.post("/api/login", handleLogin);
  router.get("/api/read", handleGetAllUser);
  router.post("/api/create", handleCreateUser);
  router.put("/api/update", handleEditUser);
  router.delete("/api/delete", handleDeleteUser);
  router.get("/allcode", getAllCode);

  return app.use("/", router);
};

module.exports = initWebRounters;
