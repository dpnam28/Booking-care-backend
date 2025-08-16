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
  updateDoctorsDetail,
  bulkCreateDoctorSchedule,
  getDoctorSchedule,
  getDoctorsExtraInfo,
  getProfileDoctor,
} from "../controllers/doctorController";

import {
  patientBookAppointment,
  verifyBookingAppointment,
} from "../controllers/patientController";

import {
  createSpecialty,
  getAllSpecialty,
  getDetailSpecialty,
} from "../controllers/specialtyController";

import { createClinic, getAllClinic } from "../controllers/clinicController";
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
  router.put("/api/update-doctors-detail", updateDoctorsDetail);
  router.post("/api/bulk-create-doctor-schedule", bulkCreateDoctorSchedule);
  router.get("/api/get-doctor-schedule", getDoctorSchedule);
  router.get("/api/get-doctors-extra-info", getDoctorsExtraInfo);
  router.get("/api/get-profile-doctor-by-id", getProfileDoctor);

  router.post("/api/patient-book-appointment", patientBookAppointment);
  router.post("/api/verify-booking-appointment", verifyBookingAppointment);

  router.post("/api/create-specialty", createSpecialty);
  router.get("/api/get-all-specialty", getAllSpecialty);
  router.get("/api/get-detail-specialty", getDetailSpecialty);

  router.post("/api/create-clinic", createClinic);
  router.get("/api/get-all-clinic", getAllClinic);

  return app.use("/", router);
};

module.exports = initWebRounters;
