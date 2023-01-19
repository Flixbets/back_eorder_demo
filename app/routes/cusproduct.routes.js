module.exports =(app)=>{
    
    const cusproduct = require("../controllers/cusproduct.controller");

    var router = require("express").Router();

    router.post('/addCusproduct',cusproduct.createCusProduct)
    // router.get('/oneCusProduct/:id',cusproduct.getOneUserpending)
    router.get('/AllCusProductPickup',cusproduct.getAllUserpickup)
    router.get('/AllCusProductPending',cusproduct.getAllUserpending)
    router.get('/AllCusProductEnd',cusproduct.getAllUserend)
    // router.get('/allProduct',product.getAllProduct)
    router.put('/updateCusProduct',cusproduct.updateCusProduct)

    router.delete('/deleteCusProduct/:peopleId/:id',cusproduct.deleteCusProduct)

    // router.post('/deleteimageproduct',product.deleteImageProduct)

    //count
    router.get('/getCount',cusproduct.getCountUser)

    //oneuser
    router.get('/getOneCusproduct/:peopleId',cusproduct.getOneCusproduct)
    router.get('/getOneCusproductPrice/:peopleId',cusproduct.getOneCusproductPrice)

    //orderone 
    router.get('/getOneUserproduct/:peopleId/:statusproduct',cusproduct.getOneUserproduct)
    router.get('/getOneUserpaidHistory/:peopleId',cusproduct.getOneUserpaidHistory)
    router.post('/paidProduct',cusproduct.paidProduct)




    
    app.use("/api/cusproduct",router);
}