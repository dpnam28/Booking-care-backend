import {
  createClinicService,
  getAllClinicService,
} from "../services/clinicServices";
let createClinic = async (req, res) => {
  try {
    let response = await createClinicService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(200).json({ errCode: 1, message: "error" });
  }
};

let getAllClinic = async (req, res) => {
  try {
    let response = await getAllClinicService();
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(200).json({ errCode: 1, message: "error" });
  }
};
module.exports = {
  createClinic,
  getAllClinic,
};
