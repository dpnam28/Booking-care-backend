import { where } from "sequelize";
import db from "../models/index";
import _, { reject } from "lodash";
import { raw } from "body-parser";
require("dotenv").config();
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

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
      if (
        data &&
        data.html &&
        data.markdown &&
        data.priceId &&
        data.provinceId &&
        data.paymentId &&
        data.addressClinic &&
        data.nameClinic
      ) {
        await db.Markdown.create({
          doctorId: data.doctorId,
          contentHTML: data.html,
          contentMarkdown: data.markdown,
          description: data.description,
          specialityId: data.specialityId,
          clinicId: data.clinicId,
        });
        await db.DoctorInfo.create({
          doctorId: data.doctorId,
          priceId: data.priceId,
          provinceId: data.provinceId,
          paymentId: data.paymentId,
          addressClinic: data.addressClinic,
          nameClinic: data.nameClinic,
        });
      }
      resolve({ errCode: 0, message: "Create successfully" });
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
              model: db.DoctorInfo,
              attributes: [
                "priceId",
                "paymentId",
                "provinceId",
                "addressClinic",
                "nameClinic",
                "note",
              ],
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

let bulkCreateDoctorScheduleService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (data.schedule && data.schedule.length > 0) {
        let schedule = data.schedule.map((item) => {
          item.maxNumber = MAX_NUMBER_SCHEDULE;
          return item;
        });

        //get exist
        let existing = await db.Schedule.findAll({
          where: { doctorId: data.doctorId, date: data.date },
          attributes: ["timeType", "date", "doctorId", "maxNumber"],
        });

        //compare diff
        let compare = _.differenceWith(schedule, existing, (a, b) => {
          return a.timeType === b.timeType && +a.date === +b.date;
        });
        if (compare && compare.length > 0) {
          await db.Schedule.bulkCreate(compare);
          resolve({ errCode: 0, message: "Success" });
        } else {
          resolve({ errCode: 1, message: "These are duplicate times" });
        }
      } else {
        resolve({ errCode: 1, message: "Missing required parameter" });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getDoctorScheduleService = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (doctorId && date) {
        let data = await db.Schedule.findAll({
          where: {
            doctorId: doctorId,
            date: date,
          },
          include: [
            {
              model: db.Allcode,
              as: "timeTypeData",
              attributes: ["valueEn", "valueVi"],
            },
          ],
          raw: false,
          nest: true,
        });

        resolve({
          errCode: 0,
          data,
        });
      } else {
        resolve({
          errCode: 1,
          message: "Missing parameter",
        });
      }
    } catch (error) {
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
  bulkCreateDoctorScheduleService,
  getDoctorScheduleService,
};
