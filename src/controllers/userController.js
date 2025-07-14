import {
  confirmLogin,
  getAllUser,
  createUser,
  deleteUser,
  editUser,
  getAllCodeFromServer,
} from "../services/userServices";

let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing parameter",
    });
  }

  let userData = await confirmLogin(email, password);

  return res.status(200).json({
    ...userData,
  });
};

let handleGetAllUser = async (req, res) => {
  let id = req.query.id;
  if (!id) {
    return res.status(200).json({ errCode: 1, message: "missing parameters" });
  }
  let users = await getAllUser(id);
  return res.status(200).json({ errCode: 0, users });
};

let handleCreateUser = async (req, res) => {
  let data = req.body;
  if (data) {
    if (await createUser(data)) {
      return res.status(200).json({
        errCode: 0,
        message: "Succeeded",
      });
    }
    return res.status(200).json({
      errCode: 1,
      message: "This email has been used",
    });
  }
  return res.status(500).json({
    errCode: 1,
    message: "Fail to sign up",
  });
};

let handleDeleteUser = async (req, res) => {
  let id = req.body.id;
  if (id && (await deleteUser(id))) {
    return res.status(200).json({
      errCode: 0,
      message: "Deleted successfully",
    });
  }
  return res.status(200).json({
    errCode: 1,
    message: "User doesn't exist",
  });
};

let handleEditUser = async (req, res) => {
  let data = req.body;
  if (data) {
    await editUser(data);
    return res.status(200).json({
      errCode: 0,
      message: "Updated successfully",
    });
  }
  return res.status(200).json({
    errCode: 1,
    message: "Missing parameters",
  });
};

let getAllCode = async (req, res) => {
  try {
    let data = await getAllCodeFromServer(req.query.type);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: 1,
      message: "Error form server",
    });
  }
};

module.exports = {
  handleLogin,
  handleGetAllUser,
  handleCreateUser,
  handleEditUser,
  handleDeleteUser,
  getAllCode,
};
