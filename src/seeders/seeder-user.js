"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Users", [
      {
        email: "dnam28@gmail.com",
        password: "111",
        firstName: "Nam",
        lastName: "Duong",
        address: "Thainguyen",
        gender: 1,
        typeRole: "ROLE",
        keyRole: "R1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "dipper@gmail.com",
        password: "111",
        firstName: "lil",
        lastName: "diz",
        address: "Thainguyen",
        gender: 1,
        typeRole: "ROLE",
        keyRole: "R1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
