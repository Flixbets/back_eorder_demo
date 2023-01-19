module.exports =(app)=>{
    const weburl = require("../controllers/weburl.controller");

    var router = require("express").Router();

    router.get('/getallweburl',weburl.getAllWeburl);
    router.put('/updateweburl',weburl.updateWeburl);
    router.post('/addweburl',weburl.createweburl);
    router.delete('/delweburl/:id',weburl.deleteweburl);

    app.use("/api/weburl",router);
    
}