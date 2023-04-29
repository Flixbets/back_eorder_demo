const db = require("../models");
const weburl = db.weburl;
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");


const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // setting destination of uploading files
    // if uploading resume
    cb(null, "./app/images/logoweb");
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
    name: "nameurl",
    maxCount: 1,
  },
]);
exports.uploadimage = upload_test;

exports.deleteImageLogo = async (req, res) => {
  const filePath = req.body.imagelogoBackup;



  fs.unlink(filePath, async (err) => {
    if (err) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }
    await weburl
      .update(
        { nameurl: null },
        {
          where: { name: "logoweb" },
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

exports.updateLogowebImage = async (req, res) => {


  try {
    await sharp(req.files.nameurl[0].path)
      // .resize(400, 400)
      // .jpeg({ quality: 200 })
      .toFile(
        path.resolve(
          req.files.nameurl[0].destination,
          "resized",
          req.files.nameurl[0].filename
        )
      );
    fs.unlinkSync(req.files.nameurl[0].path);
  } catch (err) { }

  var imageprofiletxt = null;

  try {
    imageprofiletxt =
      "app\\images\\logoweb\\resized\\" +
      req.files.nameurl[0].filename;
  } catch (err) {
    imageprofiletxt = null;
  }

 
    weburl
    .update({nameurl:imageprofiletxt}, {
      where: { name: "logoweb" },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User. Maybe Question was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating",
      });
    });
  




};



exports.getAllWeburl = async (req, res) => {
    weburl.findAll()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Status."
            });
        });
}

exports.createweburl = async (req, res) => {
      return await weburl
        .create(req.body)
        .then((data) => {
          res.status(200).send({ status: true });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send({
            status: 500,
            message:
              err.message || "Some error occurred while creating the Loan.",
          });
        });
      // });
    
  };

  exports.deleteweburl = (req, res) => {
    const id = req.params.id;
  
    weburl
      .destroy({
        where: { id: id },
      })
      .then(() => {
        res.status(200).send({
          message: "Loan was deleted successfully!",
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: "Could not delete Loan with id=" + id,
        });
      });
  };

exports.updateWeburl = async (req, res) => {

        try{
            weburl.update({nameurl:req.body.facebookURL},{where:{name:"facebook"}});
            weburl.update({nameurl:req.body.websiteURL},{where:{name:"website"}});
            weburl.update({nameurl:req.body.lineURL},{where:{name:"line"}});
            weburl.update({nameurl:req.body.gmailURL},{where:{name:"gmail"}});
            weburl.update({nameurl:req.body.idbank},{where:{name:"idbank"}});
            weburl.update({nameurl:req.body.codebank},{where:{name:"codebank"}});
            weburl.update({nameurl:req.body.namebank},{where:{name:"namebank"}});
            res.status(200).send({
                message: "Weburl was updated successfully."
              });
        }catch(e){
            res.status(500).send({
                message: "Error updating weburl " 
            });
        }
}