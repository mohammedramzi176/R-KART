var express = require('express');
var router = express.Router();
var productHelpers=require("../helpers/product-helpers")

/* GET users listing. */
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
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect("/admin")
  })
})
module.exports = router;