const db = require("../models");
const people = db.people;
const product = db.product;
const cusproduct = db.cusproduct;
const user = db.user;

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

function makeid(length) {
  var result = "A";
  var characters = "0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const shuffleArray = (arr) => arr.sort(() => 0.5 - Math.random());

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // setting destination of uploading files
    // if uploading resume
    cb(null, "./app/images/product");
  },
  filename: (req, file, cb) => {
    // naming file
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // if uploading resume
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    // check file type to be pdf, doc, or docx
    cb(null, true);
  } else {
    cb(null, false); // else fails
  }
};

var upload_test = multer({
  storage: fileStorage,
  limits: {
    fileSize: "1048576",
  },
  fileFilter: fileFilter,
}).fields([
  {
    name: "imageproduct",
    maxCount: 1,
  },
]);
exports.uploadimage = upload_test;

exports.deleteImageProduct = async (req, res) => {
  const filePath = req.body.imageproductBackup;

  const id = req.body.id;

  fs.unlink(filePath, async (err) => {
    if (err) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }
    await product
      .update(
        { imageproduct: null },
        {
          where: { id: id },
        }
      )
      .then((num) => {
        return res.send({
          message: "User was updated successfully.",
        });
      })
      .catch((err) => {
        return res.status(500).send({
          message: "Error updating User ",
        });
      });
  });

  return;
};

exports.createProduct = async (req, res) => {
  // product.findOne({ where: { name: req.body.name } }).then(async (products) => {
  //   if (products) {
  //     res.status(400).send({
  //       status: 400,
  //       message: "Failed! Product is already in use!",
  //     });
  //     return;
  //   }
  var data_product = {};

  try {
    await sharp(req.files.imageproduct[0].path)
      // .resize(400, 400)
      .jpeg({ quality: 50 })
      .toFile(
        path.resolve(
          req.files.imageproduct[0].destination,
          "resized",
          req.files.imageproduct[0].filename
        )
      );
    fs.unlinkSync(req.files.imageproduct[0].path);
  } catch (err) { }
  //************************************************************ */

  var imageproducttxt = null;

  try {
    imageproducttxt =
      "app\\images\\product\\resized\\" + req.files.imageproduct[0].filename;
  } catch (err) {
    imageproducttxt = null;
  }


  try {
    data_product = {
      imageproduct: imageproducttxt,
      idproduct: makeid(11),
      name: req.body.name,
      price: req.body.price,
      percent: req.body.percent,
      income: req.body.income,
      shopname: req.body.shopname,
    };
  } catch (err) { }

  return await product
    .create(data_product)
    .then((data) => {
      res.status(200).send({ status: true, id: data.id });
    })
    .catch((err) => {
      res.status(500).send({
        status: 500,
        message:
          err.message || "Some error occurred while creating the Product.",
      });
    });
  // });
};


exports.updateProduct = async (req, res) => {
  product.findAll({ where: { name: req.body.name } }).then(async (dname) => {
    if (user.dname > 1) {
      res.status(400).send({
        status: 400,
        message: "Failed! Product is already in use!",
      });
      return;
    }

    var data_product = {};

    try {
      await sharp(req.files.imageproduct[0].path)
        .resize(400, 400)
        .jpeg({ quality: 50 })
        .toFile(
          path.resolve(
            req.files.imageproduct[0].destination,
            "resized",
            req.files.imageproduct[0].filename
          )
        );
      fs.unlinkSync(req.files.imageproduct[0].path);
    } catch (err) { }


    var imageproducttxt = null;

    try {
      imageproducttxt =
        "app\\images\\product\\resized\\" + req.files.imageproduct[0].filename;
    } catch (err) {
      imageproducttxt = null;
    }



    try {
      data_product = {
        name: req.body.name,
        price: req.body.price,
        percent: req.body.percent,
        income: req.body.income,
        shopname: req.body.shopname,
      };
    } catch (err) { }
    if (imageproducttxt !== null) {
      data_product.imageproduct = imageproducttxt;
    }


    const id = req.params.id;
    product
      .update(data_product, {
        where: { id: id },
      })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "Product was updated successfully.",
          });
        } else {
          res.send({
            message: `Cannot update Product with id=${id}. Maybe Product was not found or req.body is empty!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error updating Product with id=" + id,
        });
      });
  });
};

exports.getAllProduct = async (req, res) => {
  product
    .findAll({ order: [["createdAt", "DESC"]], })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving User.",
      });
    });
};

exports.getAllProductHome = async (req, res) => {
  product
    .findAll({ order: [["createdAt", "DESC"]], })
    .then((data) => {
      if (data.length > 12) {
        data.length = 12;
      }
      res.send(shuffleArray(data));
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving User.",
      });
    });
};

exports.getAllProduct50Home = async (req, res) => {
  product
    .findAll({ order: [["createdAt", "DESC"]], })
    .then((data) => {
      if (data.length > 30) {
        data.length = 30;
      }
      res.send(shuffleArray(data));
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving User.",
      });
    });
};


exports.deleteProduct = async (req, res) => {
  const id = req.params.id;
  try {
    let data = await cusproduct.findAll({ attributes: ["productId", "peopleId",],group: "peopleId", where: { productId: id, }, });
    data = JSON.stringify(data);
    data = JSON.parse(data);

    for(let i in data){
     let data2 = await cusproduct.findAll({where: { peopleId: data[i].peopleId }, order: [["createdAt", "DESC"]]});
     data2 = JSON.stringify(data2);
    data2 = JSON.parse(data2);


    if(Number(data2[0].productId)===Number(id)){
      await people.update({ statusproduct: 0 }, { where: { id: data2[0].peopleId } });
    }
    }
  
    product
      .destroy({
        where: { id: id },
      })
      .then(() => {
        res.status(200).send({
          message: "Product was deleted successfully!",
        });
      })

 
  } catch (error) {
    error.status(500).send({
      message: "Could not delete Product with id=" + id,
    });
  }



};