var express = require('express');
var router = express.Router();
var productHelpers=require("../helpers/product-helpers")

/* GET users listing. */
router.get('/', function(req, res, next) {
  let products=[
    {name:"iphone-12",category:"mobiles",price:1500,description:"very good camera",image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPOH4aVJ2xlOW3Cpx6ivsPeiMr5rJKSW8sb3IujkP1zD4ByjcOTjscQaHACVnD2wT7PZLW82bG&usqp=CAc"}, 
    {name:"iphone-x",category:"mobiles",price:2500,description:"very good memory",image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPOH4aVJ2xlOW3Cpx6ivsPeiMr5rJKSW8sb3IujkP1zD4ByjcOTjscQaHACVnD2wT7PZLW82bG&usqp=CAc"},
    {name:"iphone-7",category:"mobiles",price:3500,description:"very good storage",image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPOH4aVJ2xlOW3Cpx6ivsPeiMr5rJKSW8sb3IujkP1zD4ByjcOTjscQaHACVnD2wT7PZLW82bG&usqp=CAc"},
    {name:"iphone-11",category:"mobiles",price:5500,description:"very good performance",image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPOH4aVJ2xlOW3Cpx6ivsPeiMr5rJKSW8sb3IujkP1zD4ByjcOTjscQaHACVnD2wT7PZLW82bG&usqp=CAc"}
    ]
  res.render('admin/view-products',{products,admin:true});
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

module.exports = router;
