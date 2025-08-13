require("dotenv").config();
import nodemailer from "nodemailer";

let sendSimpleEmail = async (dataSend) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  // Wrap in an async IIFE so we can use await.

  const info = await transporter.sendMail({
    from: `Duong phuong nam <${process.env.EMAIL_APP}>`,
    to: dataSend.receiverEmail,
    subject:
      dataSend.language === "vi"
        ? "Thông tin đăng ký khám bệnh"
        : "Booking medical checkup infomation",
    html: getHtml(dataSend),
  });
};

let getHtml = (dataSend) => {
  if (dataSend && dataSend.language === "vi") {
    return `<h2>Xin chào ${dataSend.patientName}</h2>
        <p>Đây là email để xác nhận thông tin đặt lịch khám bệnh</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
        <p>Ấn vào đường link phía dưới để xác nhận</p>
        <div><a href=${dataSend.link} target="_blank">Xác nhận</a></div>
        <div>Chân thành cảm ơn</div>
    `;
  } else {
    return `<h2>Dear ${dataSend.patientName}</h2>
        <p>This is an comfirm online booking medical checkup email</p>
        <div><b>Time: ${dataSend.time}</b></div>
        <div><b>Doctor: ${dataSend.doctorName}</b></div>
        <p>Click to the link below to confirm your booking</p>
        <div><a href=${dataSend.link} target="_blank">Clink here</a></div>
        <div>Thank you for your booking</div>
    `;
  }
};
module.exports = {
  sendSimpleEmail,
};
