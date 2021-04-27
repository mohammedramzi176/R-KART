var express = require('express');
var router = express.Router();
var productHelpers=require("../helpers/product-helpers")
const verifyLogin=(req,res,next)=>{
  if(req.session.admin.loggedIn){
    next()

  }else{
res.redirect("/login")
  }
}

/* GET users listing. */
router.get("/signup",(req,res)=>{
  res.render("admin/signup")
})
router.post("/signup",(req,res)=>{
  userHelpers.doSignup(req.body).then((response)=>{
    console.log(response);
   
    req.session.admin=response
    req.session.admin.loggedIn=true
    res.redirect("/")
    
  })
})
router.get("/login",(req,res)=>{
  if(req.session.admin)
  {
    res.redirect("/")
  }
  else
  res.render("admin/login",{"loginErr":req.session.adminloginErr})
  req.session.adminloginErr=false
})
router.post("/login",(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.admin=response.user
      req.session.admin.loggedIn=true
      
      res.redirect("/")
    }
    else{
      req.session.adminloginErr="invalid username or password"
      res.redirect("/login")
    }
  })
})
router.get('/', function(req, res, next) {
 productHelpers.getAllProducts().then((products)=>{
   console.log(products);
  res.render('admin/view-products',{products,admin:true});
 })
 
});
router.get("/add-products",(req,res)=>{
  res.render("admin/add-products")
})
router.post("/add-products",(req,res)=>{
  console.log(req.body);
  console.log(req.files.Image);
  
productHelpers.addProduct(req.body,(id)=>{
  let image=req.files.Image
  image.mv("./public/database-images/"+id+".jpg",(err,done)=>{
    if(!err){
      res.render("admin/add-products")
    }
    else{
      console.log(err);
    }
  })
 
})
})
router.get("/delete-product/:id",(req,res)=>{
  let proId=req.params.id
  console.log(proId);
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect("/admin/")
  })
 
})
router.get("/edit-product/:id",async(req,res)=>{
  let product= await productHelpers.getProductDetails(req.params.id)
  console.log(product);
  res.render("admin/edit-product",{product})
})
router.post("/edit-product",(req,res)=>{
  let id=req.params.id
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
  
    let image=req.files.Image
    if(req.files.Image){
      image.mv("./public/database-images/"+id+".jpg")
      res.redirect("/")
    }
  })
})

module.exports = router;