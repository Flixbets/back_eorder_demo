const db = require("../models");
const weburl = db.weburl;

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