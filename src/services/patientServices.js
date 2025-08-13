import db from "../models/index";
require("dotenv").config();
import emailServices from "./emailServices";
import { v4 as uuidv4 } from "uuid";

let patientBookAppointmentService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        data &&
        data.email &&
        data.doctorId &&
        data.timeType &&
        data.date &&
        data.fullName
      ) {
        let token = uuidv4();
        let user = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            roleId: "R3",
          },
        });
        if (user && user[0]) {
          db.Booking.findOrCreate({
            where: { patientId: user[0].id },
            defaults: {
              statusId: "S1",
              doctorId: data.doctorId,
              patientId: user[0].id,
              date: data.date,
              timeType: data.timeType,
              token: token,
            },
          });
          await emailServices.sendSimpleEmail({
            receiverEmail: data.email,
            patientName: data.fullName,
            time: data.timeString,
            doctorName: data.doctorName,
            link: buildUrlEmail(data.doctorId, token),
            language: data.language,
          });
        }
        resolve({
          errCode: 0,
          message: "Booking Succeed",
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

let buildUrlEmail = (doctorId, token) => {
  return `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
};

let verifyBookingAppointmentService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (data && data.doctorId && data.token) {
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            token: data.token,
            statusId: "S1",
          },
          raw: false,
        });
        if (appointment) {
          await appointment.update({
            statusId: "S2",
          });
          await appointment.save();
          resolve({ errCode: 0, message: "Update succeeded" });
        } else {
          resolve({
            errCode: 1,
            message: "Appointment does not exist or has been activated",
          });
        }
      } else {
        resolve({ errCode: 1, message: "Missing parameters" });
      }
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  patientBookAppointmentService,
  verifyBookingAppointmentService,
};
