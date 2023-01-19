const db = require("../models");
const people = db.people;
const deposit = db.deposit;
const withdraw = db.withdraw;
const creditadmin = db.creditadmin;
const cusproduct = db.cusproduct;
const product = db.product;

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const { Op } = require("sequelize");

function makecode(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function pad(d) {
  return (1350 + d).toString();
}
// import multer from 'multer'

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // setting destination of uploading files
    // if uploading resume
    cb(null, "./app/images/profile");
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
    name: "imageprofile",
    maxCount: 1,
  },
]);
exports.uploadimage = upload_test;

exports.deleteImageProfile = async (req, res) => {
  const filePath = req.body.imageprofileBackup;

  const id = req.body.id;

  fs.unlink(filePath, async (err) => {
    if (err) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }
    await people
      .update(
        { imageprofile: null },
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

exports.createPeople = async (req, res) => {

  if (req.body == null) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  people
    .findOne({ where: { phone: req.body.phone } })
    .then(async (user) => {
      if (user) {
        res.status(400).send({
          status: 400,
          message: "Failed! username is already in use!",
        });
        return;
      }
      var data_people = {};

      try {
        await sharp(req.files.imageprofile[0].path)
          .resize(400, 400)
          .jpeg({ quality: 50 })
          .toFile(
            path.resolve(
              req.files.imageprofile[0].destination,
              "resized",
              req.files.imageprofile[0].filename
            )
          );
        fs.unlinkSync(req.files.imageprofile[0].path);
      } catch (err) { }
      //************************************************************ */

      var imageprofiletxt = null;

      try {
        imageprofiletxt =
          "app\\images\\profile\\resized\\" +
          req.files.imageprofile[0].filename;
      } catch (err) {
        imageprofiletxt = null;
      }

      try {
        data_people = {
          imageprofile: imageprofiletxt,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          password: req.body.password,
          idline: req.body.idline,
          credit: req.body.credit,
          phone: req.body.phone,
          pincode: req.body.pincode,
          idbank: req.body.idbank,
          codebank: req.body.codebank,
          addressnow: req.body.addressnow,
          // firstnamebank: req.body.firstnamebank,
          // lastnamebank: req.body.lastnamebank,

          refcode: makecode(8),
        };
      } catch (err) { }

      return await people
        .create(data_people)
        .then(async (data) => {

          await people.update({ username: "eorder" + pad(data.id) }, { where: { id: data.id } })
          res.status(200).send({ status: true, id: data.id });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send({
            status: 500,
            message:
              err.message || "Some error occurred while creating the People.",
          });
        });
    });
};

exports.getAllUser = async (req, res) => {
  people
    .findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving User.",
      });
    });
};

exports.getlast10user = async (req, res) => {
  people
    .findAll({
      attributes: ['id', 'firstname', 'lastname', 'username', 'phone', 'credit'], order: [
        ["createdAt", "DESC"],
      ],
    })
    .then((data) => {
      if (data.length > 10) {
        data.length = 10;
      }
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving User.",
      });
    });
};

exports.getAllUsernew = async (req, res) => {
  people
    .findAll({ where: { statusproduct: { [Op.in]: [0, 4] } } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving User.",
      });
    });
};

exports.getAllUserpending = async (req, res) => {
  people
    .findAll({
      where: { statusproduct: 1 },
      order: [
        ["createdAt", "DESC"],
      ],
    })
    .then((data) => {
      let resdata = [];
      for (e of data) {
        cusproduct.findOne({
          include: [
            {
              model: product,
              as: "product",
            },
          ],
          where: { peopleId: e.id, status: 1 },
        }).then((data2) => {
          const getproduct = data2.product;

          let endtime = data2.endtime;
          e = { ...e, ...getproduct, endtime };

        })
      }

      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving User.",
      });
    });
};

exports.getAllUserend = async (req, res) => {
  people
    .findAll({ where: { statusproduct: 2 } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving User.",
      });
    });
};

exports.getOneUser = (req, res) => {

  people
    .findOne({
      attributes: ['id', 'firstname', 'lastname', 'username', 'phone', 'password'],
      where: { [Op.or]: [{ phone: req.body.phone }, { username: req.body.phone }] },
    })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      if (req.body.password != user.password) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }
      res.status(200).send({ user });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Exams.",
      });
    });
};

exports.getOneUserAdmin = (req, res) => {
  people
    .findOne({
      where: { id:req.params.id },
    })
    .then((user) => {
    
      res.status(200).send({ user });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Exams.",
      });
    });
};

exports.getOneUserAfter = (req, res) => {
  const id = req.params.id;
  people
    .findOne({
      attributes: ["id", "firstname", "lastname", "username", 
      "idline", "credit", "creditwithdraw", "phone", "imageprofile",
       "idbank", "codebank","statusproduct","refcode","pincode","addressnow"],
      where: { id: id },
    })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      res.status(200).send({ user });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Exams.",
      });
    });
};

exports.updateUser = async (req, res) => {
  people
    .findAll({ where: { phone: req.body.phone } })
    .then(async (user) => {
      if (user.length > 1) {
        res.status(400).send({
          status: 400,
          message: "Failed! Username is already in use!",
        });
        return;
      }

      var data_people = {};

      try {
        await sharp(req.files.imageprofile[0].path)
          .resize(400, 400)
          .jpeg({ quality: 50 })
          .toFile(
            path.resolve(
              req.files.imageprofile[0].destination,
              "resized",
              req.files.imageprofile[0].filename
            )
          );
        fs.unlinkSync(req.files.imageprofile[0].path);
      } catch (err) { }

      var imageprofiletxt = null;

      try {
        imageprofiletxt =
          "app\\images\\profile\\resized\\" +
          req.files.imageprofile[0].filename;
      } catch (err) {
        imageprofiletxt = null;
      }

      try {
        data_people = {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          password: req.body.password,
          idline: req.body.idline,
          credit: req.body.credit,
          creditwithdraw: req.body.creditwithdraw,
          phone: req.body.phone,
          pincode: req.body.pincode,
          idbank: req.body.idbank,
          codebank: req.body.codebank,
          addressnow: req.body.addressnow,
          // lastnamebank: req.body.lastnamebank,
        };
      } catch (err) { }
      if (imageprofiletxt !== null) {
        data_people.imageprofile = imageprofiletxt;
      }

      const id = req.params.id;
      people
        .update(data_people, {
          where: { id: id },
        })
        .then((num) => {
          if (num == 1) {
            res.send({
              message: "User was updated successfully.",
            });
          } else {
            res.send({
              message: `Cannot update User with id=${id}. Maybe Question was not found or req.body is empty!`,
            });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: "Error updating User with id=" + id,
          });
        });
    });
};

exports.updateUserImage = async (req, res) => {

      var data_people = {};

      try {
        await sharp(req.files.imageprofile[0].path)
          .resize(400, 400)
          .jpeg({ quality: 50 })
          .toFile(
            path.resolve(
              req.files.imageprofile[0].destination,
              "resized",
              req.files.imageprofile[0].filename
            )
          );
        fs.unlinkSync(req.files.imageprofile[0].path);
      } catch (err) { }

      var imageprofiletxt = null;

      try {
        imageprofiletxt =
          "app\\images\\profile\\resized\\" +
          req.files.imageprofile[0].filename;
      } catch (err) {
        imageprofiletxt = null;
      }

      if (imageprofiletxt !== null) {
        data_people.imageprofile = imageprofiletxt;
      }

      const id = req.params.id;
      people
        .update(data_people, {
          where: { id: id },
        })
        .then((num) => {
          if (num == 1) {
            res.send({
              message: "User was updated successfully.",
            });
          } else {
            res.send({
              message: `Cannot update User with id=${id}. Maybe Question was not found or req.body is empty!`,
            });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: "Error updating User with id=" + id,
          });
        });
  
};

exports.updateUseUser = async (req, res) => {
  people
    .update(req.body, {
      where: { id: req.body.id },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe Question was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with id=" + id,
      });
    });
};

exports.deleteUser = (req, res) => {
  const id = req.params.id;

  people
    .destroy({
      where: { id: id },
    })
    .then(() => {
      res.status(200).send({
        message: "User was deleted successfully!",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id,
      });
    });
};
