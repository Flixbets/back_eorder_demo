const express = require("express");
const cors = require("cors");
const app = express();
var corsOptions = 

["https://www.flixbets.com","https://flixbets.com"];
// "http://localhost:3000";


// app.use(cors(corsOptions));
app.use(cors({credentials: true, origin: corsOptions}));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.static('public')); 
app.use(express.urlencoded({ extended: true }));


//static image folder

app.use('/app/images',express.static('./app/images'))
// app.use('/app/images/driving',express.static('./app/images/driving'))

const db = require("./app/models");
const Role = db.role;
const Weburl = db.weburl;
const Countdown = db.countdown;


// db.sequelize.sync();

db.sequelize.sync({force: true}).then(() => {
    console.log('Drop and Resync Db');
    initial();
    initial2();
    initial4();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});


require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/admin.routes')(app);
require('./app/routes/people.routes')(app);
require('./app/routes/countdown.routes')(app);
require('./app/routes/product.routes')(app);
require('./app/routes/weburl.routes')(app);
require('./app/routes/cusproduct.routes')(app);
require('./app/routes/creditadmin.routes')(app);
require('./app/routes/deposit.routes')(app);




// set port, listen for requests
const PORT =  8082;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


function initial() {
  Role.create({
    id: 1,
    name: "user"
  });

  Role.create({
    id: 3,
    name: "mod"
  });

  Role.create({
    id: 2,
    name: "admin"
  });
}
function initial2() {
  Countdown.create({
    timestamp:30
  })
}



function initial3() {
  
    Bank.create({
        bankname: "ธนาคารกสิกรไทย"
    });
  
    Bank.create({
        bankname: "ธนาคารกรุงเทพ"
    });
  
    Bank.create({
        bankname: "ธนาคารไทยพาณิชย์"
    });
    Bank.create({
        bankname: "ธนาคารกรุงไทย"
      });
      Bank.create({
        bankname: "ธนาคารกรุงศรี"
      });
    
      Bank.create({
        bankname: "ธนาคารทหารไทยธนชาต"
      });
    
      Bank.create({
        bankname: "ธนาคารแลนด์แอนด์เฮ้าส์"
      });
      Bank.create({
        bankname: "ธนาคารออมสิน"
      });
      Bank.create({
        bankname: "ธนาคารเกียรตินาคินภัทร"
      });
      Bank.create({
        bankname: "ธนาคารซิตี้แบงก์"
      });
      Bank.create({
        bankname: "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร"
      });
      Bank.create({
        bankname: "ธนาคารยูโอบี"
      });
  }

  function initial4(){
    Weburl.create({
      name: "facebook",
      nameurl: "https://www.facebook.com"
    });
    Weburl.create({
      name: "line",
      nameurl: "https://www.line.com"
    });
    Weburl.create({
      name: "website",
      nameurl: "https://www.e-order4you.com"
    });
    Weburl.create({
      name: "gmail",
      nameurl: "https://www.gmail.com"
    });
    Weburl.create({
      name: "idbank",
      nameurl: "1"
    });
    Weburl.create({
      name: "codebank",
      nameurl: "0000000000"
    });
    Weburl.create({
      name: "namebank",
      nameurl: "name lastname"
    });
   
  }

