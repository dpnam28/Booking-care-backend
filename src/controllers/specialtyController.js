import {
  createSpecialtyService,
  getAllSpecialtyService,
  getDetailSpecialtyService,
} from "../services/specialtyServices";

let createSpecialty = async (req, res) => {
  try {
    let response = await createSpecialtyService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(200).json({ errCode: 1, message: "error" });
  }
};

let getAllSpecialty = async (req, res) => {
  try {
    let response = await getAllSpecialtyService();
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(200).json({ errCode: 1, message: "error" });
  }
};

let getDetailSpecialty = async (req, res) => {
  try {
    let response = await getDetailSpecialtyService(
      req.query.id,
      req.query.location
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(200).json({ errCode: 1, message: "error" });
  }
};

module.exports = {
  createSpecialty,
  getAllSpecialty,
  getDetailSpecialty,
};
