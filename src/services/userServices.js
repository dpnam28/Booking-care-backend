import { where } from "sequelize";
import db from "../models/index";
import bcrypt from "bcryptjs";
import { raw } from "body-parser";

const salt = bcrypt.genSaltSync(10);

let checkEmail = async (e) => {
  let user = await db.User.findOne({
    attributes: ["email", "roleId", "password", "firstName", "lastName"],
    where: { email: e },
    raw: true,
  });

  if (user) return user;
};

let confirmLogin = async (e, pass) => {
  let userData = {};
  let user = await checkEmail(e);

  if (user) {
    let checkPass = bcrypt.compareSync(pass, user.password);
    if (checkPass) {
      userData.errCode = 0;
      userData.message = "Login successfully";
      userData.user = user;
      delete userData.user.password;
      return userData;
    } else {
      userData.errCode = 1;
      userData.message = "Wrong password";
      return userData;
    }
  } else {
    userData.errCode = 1;
    userData.message = "Your email is not exist";
    return userData;
  }
};

let getAllUser = async (userId) => {
  let users = "";
  if (userId && userId === "ALL") {
    users = await db.User.findAll({
      attributes: { exclude: ["password"] },
    });
  } else {
    users = await db.User.findOne({
      where: { id: userId },
      attributes: { exclude: ["password"] },
    });
  }
  return users;
};

let createUser = async (data) => {
  let checkExist = await db.User.findOne({
    where: { email: data.email },
  });

  if (!checkExist) {
    let hash = bcrypt.hashSync(data.password, salt);
    await db.User.create({
      email: data.email,
      password: hash,
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address,
      phoneNumber: data.phoneNumber,
      gender: data.gender,
      roleId: data.role,
      positionId: data.position,
      image: data.image,
    });
    return true;
  } else {
    return false;
  }
};

let deleteUser = async (userId) => {
  let user = await db.User.findOne({
    where: { id: userId },
    raw: false,
  });

  if (!user) {
    return false;
  }

  await user.destroy();
  return true;
};

let editUser = async (data) => {
  let user = await db.User.findOne({
    where: { id: data.id },
    raw: false,
  });

  await user.update({
    firstName: data.firstName,
    lastName: data.lastName,
    address: data.address,
    phoneNumber: data.phoneNumber,
    gender: data.gender,
    gender: data.gender,
    roleId: data.role,
    positionId: data.position,
    image: data.image,
  });

  await user.save();
};

let getAllCodeFromServer = (typeInput) => {
  return new Promise(async (resolve, rej) => {
    try {
      if (!typeInput) {
        resolve({
          errCode: 1,
          message: "Missing parameters",
        });
      }
      let res = {};
      let allcode = await db.Allcode.findAll({ where: { type: typeInput } });
      res.errCode = 0;
      res.data = allcode;
      resolve(res);
    } catch (error) {
      rej(error);
    }
  });
};
module.exports = {
  confirmLogin,
  getAllUser,
  createUser,
  deleteUser,
  editUser,
  getAllCodeFromServer,
};
