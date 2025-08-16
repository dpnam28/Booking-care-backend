import db from "../models/index";

let createSpecialtyService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        data &&
        data.name &&
        data.image &&
        data.descriptionHTML &&
        data.descriptionMarkdown
      ) {
        await db.Speciality.create({
          name: data.name,
          descriptionHTML: data.descriptionHTML,
          descriptionMarkdown: data.descriptionMarkdown,
          image: data.image,
        });
        resolve({
          errCode: 0,
          message: "Create succeeded",
        });
      } else {
        resolve({
          errCode: 1,
          message: "Missing parameters",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getAllSpecialtyService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Speciality.findAll({
        limit: 10,
      });
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

let getDetailSpecialtyService = (id, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Speciality.findOne({
        where: { id },
        attributes: ["descriptionMarkdown", "descriptionHTML"],
      });

      if (!data || !location) {
        data = { errCode: 1, message: "Not found!" };
      } else {
        if (location === "ALL") {
          let doctorSpecialty = await db.DoctorInfo.findAll({
            where: { specialtyId: id },
            attributes: ["doctorId", "provinceId"],
          });
          data.doctorSpecialty = doctorSpecialty;
        } else {
          let doctorSpecialty = await db.DoctorInfo.findAll({
            where: { specialtyId: id, provinceId: location },
            attributes: ["doctorId", "provinceId"],
          });
          data.doctorSpecialty = doctorSpecialty;
        }
      }
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  createSpecialtyService,
  getAllSpecialtyService,
  getDetailSpecialtyService,
};
