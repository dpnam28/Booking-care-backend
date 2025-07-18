import { getDoctor } from "../services/doctorServices";

let doctorController = async (req, res) => {
  try {
    let data = await getDoctor(+req.query.limit);
    return res.status(200).json({ errCode: 0, data });
  } catch (error) {
    return res.status(200).json({ errCode: 1, message: "uncatch value" });
  }
};

module.exports = {
  doctorController,
};
