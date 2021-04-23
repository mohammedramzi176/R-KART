
var collection = require("../config/collection");
var db=require("../config/connection")
const bcrypt=require("bcrypt")
var objectId=require("mongodb").ObjectID;
const { resolve, reject } = require("promise");
module.exports={
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.Password= await bcrypt.hash(userData.Password,10)
            if(err) throw err
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((response)=>{
                resolve(data.ops[0])
            })
        })
       
    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
          let response={}
           let user=  await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            if(user){
                bcrypt.compare(userData.Password,user.Password).then((status)=>{
                    if(status){
                        console.log("login success");
                        response.user=user
                        response.status=true
                        resolve(response)
                    }
                    else{
                        console.log("login failed");
                        resolve({status:false})
                    }
                })
           
        }
        else{
            console.log("login failed");
            resolve({status:false})
        }
        })
    },
    addToCart:(proId,userId)=>{
        let proObj={
            item:objectId(proId),
            quantity:1
        }
        return new Promise(async(resolve,reject)=>{
            let userCart= await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
        if(userCart){
            let proExist=userCart.products.findIndex(product=>product.item==proId)
            console.log(proExist);
            if(proExist!=-1){
                db.get().collection(collection.CART_COLLECTION).updateOne({"products.item":objectId(proId)},
                {
                    $inc:{"products.$.quantity":1}
                }
                ).then(()=>{
                    resolve()
                })
            }else{
                  db.get().collection(collection.CART_COLLECTION).updateOne({user:objectId(userId)},
                  {
                    
                     $push:{products:proObj}
                    
                }
                  ).then((response)=>{
                    resolve()
                })
        }}
        else{
            let cartObj={
                user:objectId(userId),
                products:[proObj]

            }
            db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                resolve()
            })
        }
})


    },
    getCartProducts:(userId)=>{
        return new Promise(async(resolve,reject)=>{
         let cartItems= await db.get().collection(collection.CART_COLLECTION).aggregate([
             {
                 $match:{user:objectId(userId)}
             },
             {
                 $unwind:"$products"
             },
             {
                 $project:{
                     item:"$products.item",
                     quantity:"$products.quantity"
                 }
             },
             {
                 $lookup:{
                    from:collection.PRODUCT_COLLECTION,
                    localField:"item",
                    foreignField:"_id",
                    as:"product"
                 }
             }
            //  {
            //      $lookup:{
            //          from:collection.PRODUCT_COLLECTION,
            //          let:{prodList:"$products"},
            //          pipeline:[
            //              {
            //                  $match:{
            //                      $expr:{
            //                          $in:["$_id","$$prodList"]
            //                      }
            //                  }
            //              }
            //          ],
            //          as:"cartItems"
            //      }
            //  }
         ]).toArray()
         console.log(cartItems[0].products);
         resolve(cartItems)
        })
    },
    getCartCount:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let count=0
           let cart= await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
               if(cart){
                   count=cart.products.length
               }
               resolve(count)

        })
    }
}

