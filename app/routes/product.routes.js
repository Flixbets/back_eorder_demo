module.exports =(app)=>{
    
    const product = require("../controllers/product.controller");

    var router = require("express").Router();

    router.post('/addProduct',product.uploadimage,product.createProduct)
    router.get('/allProduct',product.getAllProduct)
    router.get('/getAllProductHome',product.getAllProductHome)
    router.get('/getAllProduct50Home',product.getAllProduct50Home)

    router.put('/updateProduct/:id',product.uploadimage,product.updateProduct)

    router.delete('/deleteProduct/:id',product.deleteProduct)

    router.post('/deleteimageproduct',product.deleteImageProduct)



    
    app.use("/api/product",router);
}