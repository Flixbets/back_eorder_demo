module.exports =(app)=>{
    const setstatus = require("../controllers/setstatus.controller");

    var router = require("express").Router();

    router.post('/newStatus',setstatus.createStatus)
    router.get('/allStatus',setstatus.getAllStatus)
    router.put('/updateStatus/:id',setstatus.updateStatus)
    router.get('/oneStatus',setstatus.getOneStatus)
    router.delete('/deleteStatus/:id',setstatus.deleteStatus)

    
    router.get('/gettest',setstatus.updateStatus1)
    
    app.use("/api/setstatus",router);
}