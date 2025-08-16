import { reject } from "lodash";
import db from "../models/index";

let createClinicService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        data &&
        data.name &&
        data.image &&
        data.descriptionHTML &&
        data.descriptionMarkdown &&
        data.address
      ) {
        await db.Clinics.create({
          name: data.name,
          descriptionHTML: data.descriptionHTML,
          descriptionMarkdown: data.descriptionMarkdown,
          image: data.image,
          address: data.address,
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

let getAllClinicService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.Clinics.findAll({
        limit: 10,
        // attributes: { exclude: ["image"] },
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

let getDetailClinicService = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.Clinics.findOne({
        where: { id },
        attributes: { exclude: ["image"] },
      });
      let doctorClinic = await db.DoctorInfo.findAll({
        where: { clinicId: id },
        attributes: ["doctorId"],
      });
      res.doctorClinic = doctorClinic;
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  createClinicService,
  getAllClinicService,
  getDetailClinicService,
};
