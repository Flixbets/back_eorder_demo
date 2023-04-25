const db = require("../models");
const people = db.people;
const product = db.product;
const cusproduct = db.cusproduct;
const user = db.user;
const countdown = db.countdown;

const dayjs = require("dayjs");
const sequelize = require("sequelize");
const op = sequelize.Op;
const TODAY_START = dayjs().format("YYYY-MM-DD 00:00");
const NOW = dayjs().format("YYYY-MM-DD 23:59");

const monthStart = dayjs().startOf('month').format("YYYY-MM-DD 00:00");
const monthEnd = dayjs().endOf('month').format("YYYY-MM-DD 23:59");

exports.createCusProduct = async (req, res) => {
  cusproduct
    .count({ where: { peopleId: req.body.peopleId, status: { [op.in]: [1, 2] } } })
    .then(async (products) => {
      if (products > 0) {
        res.status(400).send({
          status: 400,
          message: "Failed! Product is already in use!",
        });
        return;
      }

      return await cusproduct
        .create(req.body)
        .then(async (data) => {
          try {
            await cusproduct.destroy({ where: { peopleId: req.body.peopleId, status: 3 }, });
            await people.update({ statusproduct: 1 }, { where: { id: req.body.peopleId }, });
            res.status(200).send({ status: true });
          } catch (error) {
            res.status(500).send({
              status: 500,
              message:
                error.message ||
                "Some error occurred while creating the Product.",
            });
          }
        })
        .catch((err) => {
          res.status(500).send({
            status: 500,
            message:
              err.message || "Some error occurred while creating the Product.",
          });
        });
    });
};

exports.updateCusProduct = async (req, res) => {

  try {
    const peopleId = req.body.peopleId;
    // const cusproductId = req.body.id;
    const Nowtime = dayjs();


    let cuscount = await cusproduct.count({ where: { peopleId: peopleId, status: 1 } })
    if (cuscount <= 0) {
      return res.status(400).send({
        status: 400,
        message: "ไม่มีสินค้า",
      });

    }
    let counttime = await countdown.findOne({ where: { id: 1 }, });
    counttime = JSON.stringify(counttime);
    counttime = JSON.parse(counttime);
    let plusmin = Nowtime.add(counttime.timestamp, "minute");

    await cusproduct.update({ endtime: plusmin, status: 2 }, { where: { peopleId: peopleId, status: 1 } });
    await people.update({ statusproduct: 2 }, { where: { id: peopleId }, });
    await people.increment("credit", { by: -1, where: { id: peopleId }, });
    res.status(200).send({ status: true });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message:
        error.message ||
        "Some error occurred while creating the Product.",
    });
  }

};

exports.paidProduct = async (req, res) => {

  try {
    const peopleId = req.body.peopleId;
    const pincode = req.body.pincode;
    const productId = req.body.productId;
    const cusproductId = req.body.id;

    people.findOne({ where: { id: peopleId }, }).then(async (user) => {
      if (user.pincode !== pincode) return res.status(401).send({ status: 401, message: "รหัส Pin ไม่ถูกต้อง", });

      let getproduct = await product.findOne({ where: { id: productId }, })
      getproduct = JSON.stringify(getproduct);
      getproduct = JSON.parse(getproduct);
      //check เงินฝาก
      if (user.credit < getproduct.price) return res.status(402).send({ status: 402, message: "จำนวนเครดิตไม่เพียงพอ", });

      await people.update({ statusproduct: 4 }, { where: { id: peopleId }, });
      // await people.increment("credit", { by: -getproduct.price, where: { id: peopleId }, });
      // await people.increment("creditwithdraw", { by: Number(getproduct.price) + Number(getproduct.income), where: { id: peopleId }, });
      await cusproduct.update({ status: 4 }, { where: { id: cusproductId } });
      res.status(200).send({ status: true });
    }).catch(err => {
      res.status(500).send({
        status: 500,
        message:
          err.message ||
          "Some error occurred while creating the Product.",
      });
    });


  } catch (error) {
    res.status(500).send({
      status: 500,
      message:
        error.message ||
        "Some error occurred while creating the Product.",
    });
  }

};



exports.getAllUserpickup = async (req, res) => {
  cusproduct
    .findAll({
      include: [
        {
          model: people,
          as: "people",

        },
        {
          model: product,
          as: "product",
        },
      ], where: { status: 1 }, order: [["createdAt", "DESC"]]
    })
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
  try {
    let cuspro = await cusproduct
      .findAll({
        where: { status: 2 }, order: [["createdAt", "DESC"]]
      })
    cuspro = JSON.stringify(cuspro);
    cuspro = JSON.parse(cuspro);
    const dateNow = dayjs();

    for (let i in cuspro) {
      let endtimelog = dayjs(cuspro[i].endtime);
      if (endtimelog.diff(dateNow, "second") <= 0) {
        await people.update({ statusproduct: 3 }, { where: { id: cuspro[i].peopleId }, });
        await cusproduct.update({ status: 3 }, { where: { id: cuspro[i].id } });
      }
    }
    let data = await cusproduct.findAll({
      include: [
        {
          model: people,
          as: "people",
        },
        {
          model: product,
          as: "product",
        },
      ], where: { status: 2 }, order: [["createdAt", "DESC"]]
    });
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving User.",
    });
  }
};

exports.getOneUserpaidHistory = async (req, res) => {
  try {
    const peopleId = req.params.peopleId;
    let data = await cusproduct.findAll({
      include: [
        {
          model: product,
          as: "product",
        },
      ], where: { status: 4, peopleId: peopleId }, order: [["createdAt", "DESC"]]
    });
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving User.",
    });
  }
};


exports.getOneUserproduct = async (req, res) => {
  const peopleId = req.params.peopleId;
  const statusproduct = req.params.statusproduct;
  try {
    let count = await cusproduct.count({
      where: { [sequelize.Op.or]: [{ status: 2 }, { status: 3 }], peopleId: peopleId },
    })

    if (count !== 0) {
      let cuspro = await cusproduct
        .findOne({
          where: { [sequelize.Op.or]: [{ status: 2 }, { status: 3 }], peopleId: peopleId },
        })

      cuspro = JSON.stringify(cuspro);
      cuspro = JSON.parse(cuspro);
      const dateNow = dayjs();


      let endtimelog = dayjs(cuspro.endtime);
      if (endtimelog.diff(dateNow, "second") <= 0) {
        await people.update({ statusproduct: 3 }, { where: { id: peopleId }, });
        await cusproduct.update({ status: 3 }, { where: { id: cuspro.id } });
        let data = await cusproduct.findOne({
          include: [
            {
              model: product,
              as: "product",
            },
          ], where: { status: 3 }
        });
        return res.send(data);
      } else {
        let data = await cusproduct.findOne({
          include: [
            {
              model: product,
              as: "product",
            },
          ], where: { status: 2 }
        });
        return res.send(data);
      }



    } else {
      res.status(500).send({
        message: "Some error occurred while retrieving CusProduct.",
      });
    }

  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving User.",
    });
  }
};

exports.getAllUserend = async (req, res) => {
  cusproduct
    .findAll({
      include: [
        {
          model: people,
          as: "people",
          attributes: [
            "firstname",
            "lastname",
            // "firstnamebank",
            // "lastnamebank",
            "idline",
            "idbank",
            "codebank",
            "username",
            "statusproduct",
            "credit",
            "creditwithdraw",
          ],
        },
        {
          model: product,
          as: "product",
        },
      ], where: { status: 3 }, order: [["createdAt", "DESC"]]
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving User.",
      });
    });
};





exports.deleteCusProduct = async (req, res) => {
  const id = req.params.id;
  const peopleId = req.params.peopleId;
  try {
    await cusproduct
      .destroy({
        where: { id: id },
      }).then(() => {
        people.update(
          { statusproduct: 0 },
          {
            where: { id: peopleId },
          }
        );
        res.status(200).send({
          message: "CusProduct was deleted successfully!",
        });
      })
  } catch (error) {
    res.status(500).send({
      message: "Could not delete CusProduct with id=" + id,
    });
  }

};

exports.getCountUser = async (req, res) => {
  try {
    let todaypeople = await people.count({
      where: {
        createdAt: {
          [op.between]: [TODAY_START, NOW],
        },
      }
    });
    let monthpeople = await people.count({
      where: {
        createdAt: {
          [op.between]: [monthStart, monthEnd],
        },
      }
    });
    let newpeople = await people.count({ where: { statusproduct: 0 } });
    let endpeople = await people.count({ where: { statusproduct: 3 } });
    res.status(200).send({
      todaypeople: todaypeople,
      monthpeople: monthpeople,
      newpeople: newpeople,
      endpeople: endpeople,
    });
  } catch (error) {
    res.status(500).send({
      message: error,
    });
  }

};

exports.getOneCusproduct = async (req, res) => {
  const peopleId = req.params.peopleId;
  cusproduct
    .findAll({
      include: [
        {
          model: product,
          as: "product",
        },
      ], where: { peopleId: peopleId }, order: [["createdAt", "DESC"]]
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving User.",
      });
    });
};

exports.getOneCusproductPrice = async (req, res) => {
  const peopleId = req.params.peopleId;
  cusproduct
    .findAll({
      include: [
        {
          model: product,
          as: "product",
        },
      ], where: { peopleId: peopleId, status: 4 }, order: [["createdAt", "DESC"]]
    })
    .then((data) => {
      data = JSON.stringify(data);
      data = JSON.parse(data);
      let purchase = 0;
      let dividend = 0;
      data.map((e) => {
        purchase += e.product.price;
        dividend += e.product.income;
      })
      res.send({
        purchase: purchase,
        dividend: dividend,

      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving User.",
      });
    });
};


