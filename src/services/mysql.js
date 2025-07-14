import bcrypt from "bcryptjs";
import db from "../models/index";
import { where } from "sequelize";

const salt = bcrypt.genSaltSync(10);

let CreateNewUser = async (data) => {
  let hash = bcrypt.hashSync(data.password, salt);
  await db.User.create({
    email: data.email,
    password: hash,
    firstName: data.firstName,
    lastName: data.lastName,
    address: data.address,
    phoneNumber: data.phoneNumber,
    gender: data.gender === "1" ? true : false,
    roleId: data.roleId,
  });
};

let getAllUsers = async () => {
  let users = await db.User.findAll({ raw: true });
  return users;
};

let getUserById = async (id) => {
  let user = await db.User.findOne({
    where: { id: id },
    raw: true,
  });

  return user;
};

let updateUser = async (data) => {
  let user = await db.User.findOne({ where: { id: data.id }, raw: false });
  await user.update({
    firstName: data.firstName,
    lastName: data.lastName,
    address: data.address,
  });

  user.save();
  return;
};

let deleteUser = async (id) => {
  let user = await db.User.findOne({ where: { id: id }, raw: false });
  await user.destroy();
  return;
};

module.exports = {
  CreateNewUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
