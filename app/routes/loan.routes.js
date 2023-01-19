module.exports =(app)=>{
    const loan = require("../controllers/loan.controller");

    var router = require("express").Router();

    router.get('/getreqloan',loan.getreqloan)
    router.get('/getonereqloan/:id',loan.getOneLoan)
    router.get('/getallloan',loan.getAllLoan)
    router.post('/newloan',loan.createLoan)
    router.post('/updateloanuser',loan.updateloanuser)
    // router.get('/allStatus',setstatus.getAllStatus)
   
    // router.get('/oneStatus',setstatus.getOneStatus)
    // router.delete('/deleteStatus/:id',setstatus.deleteStatus)

    
    // router.get('/gettest',setstatus.updateStatus1)
    
    app.use("/api/loan",router);
}