var collection = require("../config/collection");
var db=require("../config/connection")
var objectId=require("mongodb").ObjectID

module.exports={

addProduct:(product,callback)=>{
    console.log(product);
    db.get().collection("product").insertOne(product).then((data)=>{
            callback(data.ops[0]._id)
            console.log(data);
    })

},
getAllProducts:()=>{
    return new Promise(async(resolve,reject)=>{
        let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()

        resolve(products)
    })

},
deleteProduct:(proId)=>{
    return new Promise((resolve,reject)=>{
           db.get().collection(collection.PRODUCT_COLLECTION).removeOne({_id:objectId(proId)}).then((response)=>{
               resolve(response)
               console.log(response);
           })
    })
},
getProductDetails:(proId)=>{
    return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(proId)}).then((product)=>{
                resolve(product)
            })
    })
},
updateProduct:(proId,proDetails)=>{
    return new promise((resolve,reject)=>{
        db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:ObjectID(proId)},{
            $set:{
                Name:proDetails.Name,
                Category:proDetails.Category,
                Price:proDetails.Price,
                Description:proDetails.Description
            }

        }).then((response)=>{
            resolve()

        })
    })

}




}
