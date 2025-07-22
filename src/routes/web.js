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

import {
  getDoctorLimit,
  getAllDoctor,
  createInfoDoctor,
  getDoctorsDetail,
} from "../controllers/doctorController";

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

  router.get("/api/get-doctor-limit", getDoctorLimit);
  router.get("/api/get-doctor-all", getAllDoctor);
  router.post("/api/create-info-doctor", createInfoDoctor);
  router.get("/api/get-doctors-detail", getDoctorsDetail);

  return app.use("/", router);
};

module.exports = initWebRounters;
