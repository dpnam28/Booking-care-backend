import { patientBookAppointmentService } from "../services/patientServices";

let patientBookAppointment = async (req, res) => {
  try {
    let response = await patientBookAppointmentService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(200).json({ errCode: 1, message: "error" });
  }
};

module.exports = {
  patientBookAppointment,
};
