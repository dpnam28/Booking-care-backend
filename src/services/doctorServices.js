import { raw } from "body-parser";
import db from "../models/index";

let getDoctor = (limit) => {
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

module.exports = {
  getDoctor,
};
