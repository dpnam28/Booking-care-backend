import db from "../models/index";
require("dotenv").config();

let patientBookAppointmentService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (data && data.email && data.doctorId && data.timeType && data.date) {
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
            },
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

module.exports = {
  patientBookAppointmentService,
};
