module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "Flixbets@123456",
    // PASSWORD: "",
    DB: "product_demo_db",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };