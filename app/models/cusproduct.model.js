module.exports = (sequelize, Sequelize) => {
    const cusproduct = sequelize.define("cusproduct", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      endtime: {
        type: Sequelize.DATE,

      },
      status: {
        type: Sequelize.TINYINT,
        defaultValue: 0,
      },

    });
    return cusproduct;
  };