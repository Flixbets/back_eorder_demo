

module.exports =(app)=>{
    
    const people = require("../controllers/people.controller");

    var router = require("express").Router();

    router.post('/newPeople',people.uploadimage,people.createPeople)
    router.get('/allPeople',people.getAllUser)
    router.put('/updatePeople/:id',people.uploadimage,people.updateUser)
    router.put('/updateUseUser',people.updateUseUser)

    router.put('/updateUserImage/:id',people.uploadimage,people.updateUserImage)
   
    router.get('/getOneUserAdmin/:id',people.getOneUserAdmin)
    router.delete('/deletePeople/:id',people.deleteUser)
    router.post('/deleteimageprofile',people.deleteImageProfile)

    router.get('/allPeoplenew',people.getAllUsernew)
    router.get('/allPeoplepending',people.getAllUserpending)
    router.get('/allPeopleend',people.getAllUserend)
    router.get('/getlastuser',people.getlast10user)



    //userLogin
    router.post('/onePeople',people.getOneUser)
    router.get('/oneUserdata/:id',people.getOneUserAfter)






    
    app.use("/api/people",router);
}