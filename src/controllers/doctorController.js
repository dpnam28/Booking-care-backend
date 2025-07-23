import {
  getDoctorLimitService,
  getAllDoctorService,
  createInfoDoctorService,
  getDoctorsDetailService,
  updateDoctorsDetailService,
} from "../services/doctorServices";

let getDoctorLimit = async (req, res) => {
  try {
    let data = await getDoctorLimitService(+req.query.limit);
    return res.status(200).json({ errCode: 0, data });
  } catch (error) {
    return res.status(200).json({ errCode: 1, message: "uncatch value" });
  }
};

let getAllDoctor = async (req, res) => {
  try {
    let data = await getAllDoctorService();
    return res.status(200).json({ errCode: 0, data });
  } catch (error) {
    return res.status(200).json({ errCode: 1, message: "uncatch value" });
  }
};
let createInfoDoctor = async (req, res) => {
  try {
    let data = await createInfoDoctorService(req.body);
    return res.status(200).json({ errCode: 0, message: "Create successfully" });
  } catch (error) {
    return res.status(200).json({ errCode: 1, message: "error" });
  }
};

let getDoctorsDetail = async (req, res) => {
  try {
    if (!req.query.id)
      return res.status(200).json({ errCode: 1, message: "Missing query" });
    let data = await getDoctorsDetailService(req.query.id);
    return res.status(200).json({
      errCode: 0,
      ...data,
    });
  } catch (error) {
    return res.status(200).json({ errCode: 1, message: "error" });
  }
};

let updateDoctorsDetail = async (req, res) => {
  try {
    if (req && req.body) {
      let response = await updateDoctorsDetailService(req.body);
      return res.status(200).json(response);
    }
  } catch (error) {
    return res.status(200).json({ errCode: 1, message: "error" });
  }
};
module.exports = {
  getDoctorLimit,
  getAllDoctor,
  createInfoDoctor,
  getDoctorsDetail,
  updateDoctorsDetail,
};
