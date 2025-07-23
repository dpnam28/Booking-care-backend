import { where } from "sequelize";
import db from "../models/index";

let getDoctorLimitService = (limit) => {
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

let getAllDoctorService = () => {
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

let createInfoDoctorService = (data) => {
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

let getDoctorsDetailService = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (id) {
        let data = await db.User.findOne({
          where: {
            id: id,
          },
          attributes: { exclude: ["password"] },
          include: [
            {
              model: db.Markdown,
              attributes: ["description", "contentHTML", "contentMarkdown"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
          ],
          raw: true,
          nest: true,
        });

        if (data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        }
        resolve(data);
      }
    } catch (error) {
      reject(error);
    }
  });
};

let updateDoctorsDetailService = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctor = await db.Markdown.findOne({
        where: { doctorId: data.id },
        raw: false,
      });
      if (doctor) {
        await doctor.update({
          contentMarkdown: data.contentMarkdown,
          contentHTML: data.contentHTML,
          description: data.description,
        });
        await doctor.save();
        resolve({
          errCode: 0,
          message: "Update successfully",
        });
      } else {
        reject({
          errCode: 1,
          message: "error",
        });
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

module.exports = {
  getDoctorLimitService,
  getAllDoctorService,
  createInfoDoctorService,
  getDoctorsDetailService,
  updateDoctorsDetailService,
};
