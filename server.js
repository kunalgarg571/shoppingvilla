const express = require('express')
const app = express()

const {
    db,
    Users,Vendors,Products,CartItems
  } = require('./db')


app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.use('/',
  express.static(__dirname + '/public')
)
app.get('/hel',(req,res)=>{
    res.send({a:1})
})

app.post('/hel',async(req,res)=>{
    var x = req.body;
    console.log(x)
    try{
        await Vendors.create({
            name: req.body.vendorName
        })
        res.send('thia')
    }catch(ex){
        res.send(ex)
    }
})

app.get('/list',async(req,res)=>{
        Vendors.findAll({
        // Where Clause...  
    }).then((todos)=>{
        // for(let i of todos){
        //     console.log(i.name+" "+ i.priority);
        res.send(todos)
    })
})





app.post('/Product',async(req,res)=>{
  var data = req.body
  try{
    await Vendors.findOrCreate({
        where:{name:data.PVendor} 
    })
    .then(([data2,created])=>{
       Products.create({
        name: data.PName,
        price:  data.PPrice,
        quantity: data.PQuantity,
        vendorId : data2.id
      })
      res.send('Product Added')
    })
  }catch(e){
    res.send(e)
}
})


// app.post('/Product',async(req,res)=>{
//   var data = req.body
//   try{
//     await Vendors.findOrCreate(
//       {where:{name:data.PVendor} }).then(([data2,created])=>{
//        Products.create({
//         name: data.PName,
//         price:  data.PPrice,
//         quantity: data.PQuantity,
//         vendorId : data2.id
//     })
//       })


//       // Products.findAll({
//       //   // Where Clause...  
//       // }).then((todos)=>{
//       //   for(let i of todos){
//       //       console.log(i.name);
//       //   }
//       res.send('Product Added Successfully!!')
//       // })
//   }catch(e){
//     Products.findAll({
//       // Where Clause...  
//     }).then((todos)=>{
//       for(let i of todos){
//           console.log(i.name+" "+ i.priority);
//       }
//     res.send(e)
//   })
// }
// })
// // ;async function findVendorName(vendorId){
// //   await Vendors.findOrCreate({
// //     where : {id:vendorId}
// //   }).then(([data2,created])=>{
// //     Console.log(data2.name)
// //       return data2.name
// //   })
// // }


app.get('/products',async(req,res)=>{
  var All=[];
  var products={}
  await Products.findAll({
    include: [
      Vendors
    ] 
}).then((todos)=>{
  for(let i of todos){
    // console.log(i)
    // products.vendorName=findVendorName(i.vendorId)
    products.price = i.price
    products.quantity = i.quantity
    products.name = i.name
    products.id = i.id
    products.vendorId = i.id
    products.vendorName = i.vendor.name
    
    All.push(products)
    products={}
  }
  // console.log(All)
  res.send(All)

})
})
app.post('/DVend',(req,res)=>{
  var id = req.body.id    
        Vendors.findByPk(id).then((vendor) => {
            if(vendor)
            {
                Vendors.destroy({               
                    where: {
                        id:id
                }
                }).then(()=>{   
                    Products.destroy({
                        where:{
                            VendorId:null
                        }
                    }).then(()=>{
                      CartItems.destroy({
                        where : {
                          ProductId:null
                        }
                      }).then((data)=>{
                          // console.log(data)
                      })
                    })
                    
                    res.send({success:true,message:'deleted successfully'})
                })
                .catch((error)=>{
                    res.send({success:false,message:error})
                })
             
            }else
            {
             res.send({success:false,message:'no vendor exists with this id'})
            }             
           })
           .catch((error)=>{
               res.send({success:false,data:null,message:error})
           })

})

app.post('/DProd',(req,res)=>{
  var id = req.body.id    
        Products.findByPk(id).then((Product) => {
            if(Product)
            {
                Products.destroy({               
                    where: {
                        id:id
                    }
                }).then(()=>{   
                    CartItems.destroy({
                      where : {
                        ProductId:null
                      }
                    })
                    res.send({success:true,message:'deleted successfully'})
                })
                .catch((error)=>{
                    res.send({success:false,message:error})
                })
             
            }else
            {
             res.send({success:false,message:'no vendor exists with this id'})
            }             
           })
           .catch((error)=>{
               res.send({success:false,data:null,message:error})
           })

})

app.post('/AUsr',async(req,res)=>{
  UserData = req.body
  await Users.findOrCreate({where :{username:UserData.username,email:UserData.email}}).then(([data,created])=>{
    if(created){
      res.send({success:true,message:'User Added successfully!',use:data})
    }
    else{
      res.send({success:false,message:'User Already Existed!',use:data})
    }
  })
})

app.post('/AddProduct',async(req,res)=>{
  x = req.body
  await CartItems.findOne({
    include: [ Users,Products ],where:{userId:x.userId,productId:x.productId}
  }).then(async (data)=>{
    if(data){
      var newQuantity = parseInt(x.Quantity)+parseInt(data.quantity)
      // console.log(newQuantity)
      // console.log(" "+data.userId+" "+ data.productId)
      await CartItems.update({quantity: newQuantity},
        {
          where:{
            userId:data.userId,
            productId:data.productId
          }
        }).then((returneddata)=>{
          // console.log('Here We Are!!')
          if(returneddata)
          {
            res.send({success:true,data:data,message:'Entered successfully'});
          }
      }).catch((error)=>{
        res.send({success:false,data:data,message:'some db error'})
      })
    }
    else{
      await CartItems.create(
        {
          quantity:x.Quantity,
          productId:x.productId,
          userId:x.userId
        }
     ).then((data)=>
     {
        if(data)
        {
            res.send({success:true,data:data,message:'Entered successfully'});
        }
        else
        {
            res.send({success:false,data:data,message:'some error occured'});
        }

     })
     .catch((error)=>{
         res.send({success:false,data:data,message:'some db error'})
     })
    }
  })
})

app.post('/getQuant',(req,res)=>{
  var pid = req.body.productId
  var Quantity = req.body.Quantity
  var uid = req.body.userId

  Products.findOne({where:{id:pid}}).then(async(product)=>{
    // console.log("kunal here! ")
    if(product.quantity>=Quantity){
      await CartItems.findOne({
        include: [ Users,Products ],where:{userId:uid,productId:pid}
      }).then(async (data)=>{
        if(data){
          var newQuantity = parseInt(Quantity)+parseInt(data.quantity)
          if(product.quantity>=newQuantity){
            // console.log(newQuantity)
            // console.log(" "+data.userId+" "+ data.productId)
            await CartItems.update({quantity: newQuantity},
              {
                where:{
                  userId:data.userId,
                  productId:data.productId
                }
              }).then((returneddata)=>{
                // console.log('Here We Are!!')
                if(returneddata)
                {
                  res.send({success:true,data:data,message:'Entered successfully'});
                }
            }).catch((error)=>{
              res.send({success:false,data:data,message:'some db error'})
            })
          }
          else{
            res.send({success:false,data:data,message:'Quantity not Available, Some Items Are already in cart!!'})
          }
        }
        else{
          await CartItems.create(
            {
              quantity:Quantity,
              productId:pid,
              userId:uid
            }
         ).then((data)=>
         {
            if(data)
            {
                res.send({success:true,data:data,message:'Entered successfully'});
            }
            else
            {
                res.send({success:false,data:data,message:'some error occured'});
            }
    
         })
         .catch((error)=>{
             res.send({success:false,data:data,message:'some db error'})
         })
        }
      })
    }
    else{
      res.send({message:'Not Available!!'})
    }
  })
})


app.post('/getItems',(req,res)=>{
  var x = req.body.userId
  CartItems.findAll({include:[Products],where:{userId:x}}).then((products)=>{
    res.send({data:products,success:'true'})
  })
})

app.post('/getProduct',(req,res)=>{
  productId = req.body.pid
  Products.findOne({include:[Vendors],where:{id:productId}}).then((data)=>{
    res.send(data)
  })
})


app.post('/RemCart',(req,res)=>{
  pid = req.body.pid
  CartItems.destroy({include:[Products],where:{productId:pid}}).then((data)=>{
    res.send({succes:true})
  })
})

const PORT = process.env.PORT ||8090

db.sync()
  .then(() => 
  {
    app.listen(PORT, () => {
    console.log(PORT);
  })
}) 
