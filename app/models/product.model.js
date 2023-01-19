module.exports = (sequelize, Sequelize) => {
  const product = sequelize.define("product", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idproduct: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
    name:{
      type: Sequelize.STRING,
    },
    imageproduct:{
        type: Sequelize.STRING,
        defaultValue: "",
    },
    price: {
      type: Sequelize.FLOAT(11, 2),
      defaultValue: 0.0,
    },
    percent:{
        type: Sequelize.FLOAT(11, 2),
        defaultValue: 0.0,
    },
    income:{
        type: Sequelize.FLOAT(11, 2),
        defaultValue: 0.0,
    },
    shopname:{
        type: Sequelize.STRING,
        defaultValue: "",
    }

  });
  return product;
};
