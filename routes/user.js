var express = require('express');
const { response } = require('../app');
var router = express.Router();
var productHelpers=require("../helpers/product-helpers")
var userHelpers=require("../helpers/user-helpers")

/* GET home page. */
router.get('/', function(req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
    console.log(products);
   res.render('user/view-products',{products});
  })
});
router.get("/login",(req,res)=>{
  res.render("user/login")
})
router.get("/signup",(req,res)=>{
  res.render("user/signup")
})
router.post("/signup",(req,res)=>{
  userHelpers.doSignup(req.body).then((response)=>{
    console.log(response);
  })
})
router.post("/login",(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect("/")
    }
    else{
      res.redirect("/login")
    }
  })
})

module.exports = router;
