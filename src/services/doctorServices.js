import { where } from "sequelize";
import db from "../models/index";

let getDoctorLimitS = (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.User.findAll({
        where: { roleId: "R2" },
        limit: limit,
        order: [["createdAt", "ASC"]],
        attributes: { exclude: ["password"] },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        raw: true,
        nest: true,
      });

      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

let getAllDoctorS = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.User.findAll({
        where: { roleId: "R2" },
        attributes: { exclude: ["password", "image"] },
      });
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

let createInfoDoctorS = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (data && data.html && data.markdown) {
        await db.Markdown.create({
          doctorId: data.doctorId,
          contentHTML: data.html,
          contentMarkdown: data.markdown,
          description: data.description,
          specialityId: data.specialityId,
          clinicId: data.clinicId,
        });
      }
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getDoctorLimitS,
  getAllDoctorS,
  createInfoDoctorS,
};
