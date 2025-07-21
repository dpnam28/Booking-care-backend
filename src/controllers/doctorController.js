import {
  getDoctorLimitS,
  getAllDoctorS,
  createInfoDoctorS,
} from "../services/doctorServices";

let getDoctorLimit = async (req, res) => {
  try {
    let data = await getDoctorLimitS(+req.query.limit);
    return res.status(200).json({ errCode: 0, data });
  } catch (error) {
    return res.status(200).json({ errCode: 1, message: "uncatch value" });
  }
};

let getAllDoctor = async (req, res) => {
  try {
    let data = await getAllDoctorS();
    return res.status(200).json({ errCode: 0, data });
  } catch (error) {
    return res.status(200).json({ errCode: 1, message: "uncatch value" });
  }
};
let createInfoDoctor = async (req, res) => {
  try {
    let data = await createInfoDoctorS(req.body);
    return res.status(200).json({ errCode: 0, message: "Create successfully" });
  } catch (error) {
    return res.status(200).json({ errCode: 1, message: "error" });
  }
};

module.exports = {
  getDoctorLimit,
  getAllDoctor,
  createInfoDoctor,
};
