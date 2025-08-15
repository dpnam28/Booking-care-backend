import { where } from "sequelize";
import db from "../models/index";
import _, { reject } from "lodash";
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
let checkCreateInfoDoctorService = (data) => {
  let arrCheck = [
    "addressClinic",
    "description",
    "doctorId",
    "html",
    "markdown",
    "nameClinic",
    "paymentId",
    "priceId",
    "provinceId",
    "specialtyId",
  ];
  let isValid = true;
  let errElement = "";
  for (let i = 0; i < arrCheck.length; i++) {
    if (!data[arrCheck[i]]) {
      isValid = false;
      errElement = arrCheck[i];
      break;
    }
  }

  return {
    isValid,
    errElement,
  };
};
let createInfoDoctorService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checker = checkCreateInfoDoctorService(data);
      if (checker.isValid) {
        await db.Markdown.create({
          doctorId: data.doctorId,
          contentHTML: data.html,
          contentMarkdown: data.markdown,
          description: data.description,
          specialtyId: data.specialtyId,
          clinicId: data.clinicId ? data.clinicId : null,
        });
        await db.DoctorInfo.create({
          doctorId: data.doctorId,
          priceId: data.priceId,
          provinceId: data.provinceId,
          paymentId: data.paymentId,
          addressClinic: data.addressClinic,
          nameClinic: data.nameClinic,
          note: data.note,
          clinicId: data.clinicId ? data.clinicId : null,
          specialtyId: data.specialtyId,
        });
        resolve({ errCode: 0, message: "Create successfully" });
      } else {
        resolve({
          errCode: 1,
          message: `Missing parameters: ${checker.errElement}`,
        });
      }
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
            //Markdown
            {
              model: db.Markdown,
              attributes: ["description", "contentHTML", "contentMarkdown"],
            },

            //DoctorInfo
            {
              model: db.DoctorInfo,
              attributes: {
                exclude: ["doctorId", "id", "updatedAt", "createdAt"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "priceIdData",
                  attributes: ["valueEn", "valueVi", "keyMap"],
                },
                {
                  model: db.Allcode,
                  as: "provinceIdData",
                  attributes: ["valueEn", "valueVi", "keyMap"],
                },
                {
                  model: db.Allcode,
                  as: "paymentIdData",
                  attributes: ["valueEn", "valueVi", "keyMap"],
                },
              ],
            },

            //Allcode
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

        if (!data) data = {};
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
        where: { doctorId: data.doctorId },
        raw: false,
      });

      let detail = await db.DoctorInfo.findOne({
        where: { doctorId: data.doctorId },
        raw: false,
      });

      if (doctor && detail) {
        await doctor.update({
          contentMarkdown: data.markdown,
          contentHTML: data.html,
          description: data.description,
        });
        await doctor.save();
        await detail.update({
          priceId: data.priceId,
          provinceId: data.provinceId,
          paymentId: data.paymentId,
          clinicId: data.clinicId,
          specialityId: data.specialityId,
          addressClinic: data.addressClinic,
          nameClinic: data.nameClinic,
          note: data.note,
        });
        await detail.save();
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
            {
              model: db.User,
              as: "doctorData",
              attributes: ["firstName", "lastName"],
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

let getDoctorsExtraInfoService = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (id) {
        let data = await db.DoctorInfo.findOne({
          where: { doctorId: id },
          include: [
            {
              model: db.Allcode,
              as: "priceIdData",
              attributes: ["valueEn", "valueVi", "keyMap"],
            },
            {
              model: db.Allcode,
              as: "provinceIdData",
              attributes: ["valueEn", "valueVi", "keyMap"],
            },
            {
              model: db.Allcode,
              as: "paymentIdData",
              attributes: ["valueEn", "valueVi", "keyMap"],
            },
          ],
          raw: false,
          nest: true,
        });
        if (!data) data = {};
        resolve(JSON.stringify(data));
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getProfileDoctorService = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (id) {
        let data = await db.User.findOne({
          where: {
            id: id,
            roleId: "R2",
          },
          attributes: { exclude: ["password"] },
          include: [
            //Markdown
            {
              model: db.Markdown,
              attributes: ["description"],
            },

            //DoctorInfo
            {
              model: db.DoctorInfo,
              attributes: {
                exclude: ["doctorId", "id", "updatedAt", "createdAt"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "priceIdData",
                  attributes: ["valueEn", "valueVi", "keyMap"],
                },
                {
                  model: db.Allcode,
                  as: "provinceIdData",
                  attributes: ["valueEn", "valueVi", "keyMap"],
                },
                {
                  model: db.Allcode,
                  as: "paymentIdData",
                  attributes: ["valueEn", "valueVi", "keyMap"],
                },
              ],
            },

            //Allcode
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
          ],
          raw: true,
          nest: true,
        });

        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        }

        if (!data) {
          resolve({ errCode: 1, message: "Id doctor is not exist" });
        }
        resolve({ errCode: 0, data });
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
  getDoctorsExtraInfoService,
  getProfileDoctorService,
};
