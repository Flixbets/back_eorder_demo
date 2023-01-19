module.exports = (sequelize, Sequelize) => {
  const People = sequelize.define("peoples", {
    firstname: {
      type: Sequelize.STRING,
      defaultValue: "-",
    },
    lastname: {
      type: Sequelize.STRING,
      defaultValue: "-",
    },

    username: {
      type: Sequelize.STRING,

    },

    idline: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
    password: {
      type: Sequelize.STRING,
    },
    credit: {
      type: Sequelize.FLOAT(11, 2),
      defaultValue: 0.0,
    },
    creditwithdraw: {
      type: Sequelize.FLOAT(11, 2),
      defaultValue: 0.0,
    },

    phone: {
      type: Sequelize.STRING(10),
      defaultValue: "",
      unique: true
    },
    pincode: {
      type: Sequelize.STRING(6),
      defaultValue: "",
    },

    imageprofile: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
    idbank: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    codebank: {
      type: Sequelize.STRING(20),
      defaultValue: "",
    },
    // firstnamebank: {
    //   type: Sequelize.STRING,
    //   defaultValue: "",
    // },
    addressnow: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
    statusproduct:{
      type: Sequelize.TINYINT,
      defaultValue: 0,
    },

    refcode: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
  });
  return People;
};
