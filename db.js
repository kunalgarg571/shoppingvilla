// const Sequelize = require('sequelize')
// const db = new Sequelize({
//     dialect : 'sqlite',
//     storage : __dirname + '/database.db'
// })

// const Vendor = db.define('vendor', {
//     name : {
//         type:Sequelize.STRING,
//         allowNull: false
//     }
// });
// window.onload = function(){

//     var addVendor = document.getElementById('AddVendor');
//         var add = document.getElementById('Add');
//         var list =  document.getElementById('list');


//     add.onclick = function(){   
//         var value = addVendor.value
//         ele = document.createElement('li');
//         ele.innerText  = value;
//         list.appendChild(ele)

//         db.sync().then(()=>{
//             console.log('database Synchronized');
//             Vendor.create({name :value})
//             // Todos.findAll({
//             //     // Where Clause...
//             // }).then((todos)=>{
//             //     for(let i of todos){
//             //         console.log(i.name+" "+ i.priority);
//             //     }
//             // })
//         })
//     }  
// }

// const Todos = db.define('todo', {
//     name : {
//         type:Sequelize.STRING,
//         allowNull: false
//     },priority:{
//         type : Sequelize.NUMBER,
//         defaultValue : 5
//     }
// });

// db.sync().then(()=>{
//     console.log('database Synchronized');
//     Todos.create({name : 'fourth task',priority : '1'})
//     Todos.findAll({
//         // Where Clause...  
//     }).then((todos)=>{
//         for(let i of todos){
//             console.log(i.name+" "+ i.priority);
//         }
//     })
// })  

// const Op = Sequelize.Op

// const db = new Sequelize({
//   dialect: 'sqlite', // mysql, postgres, mssql
//   storage: __dirname + '/todos.db'
//   // database : '',
//   // host: 'localhost',
//   // username: '',
//   // password: '',
//   // port: ''
// })

// const Todos = db.define('todo', {
//   name: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   priority: {
//     type: Sequelize.INTEGER,
//     defaultValue: 5
//   }
// })

const Sequelize = require('sequelize')
const db = new Sequelize({
    dialect : 'sqlite',
    storage : __dirname + '/todos.db'
})

const Vendors = db.define('vendor',{
  name : Sequelize.STRING
})

const Products = db.define('products',{
  name : Sequelize.STRING,
  price : Sequelize.INTEGER,
  quantity  : Sequelize.INTEGER
})

const Users = db.define('user', {
  username: Sequelize.STRING,
  email: Sequelize.STRING
})

const CartItems = db.define('cartitem', {
  quantity:{type: Sequelize.INTEGER,
    allowNull : false
  }

})

Products.belongsTo(Vendors)
Vendors.hasMany(Products)

CartItems.belongsTo(Products)
CartItems.belongsTo(Users)
Users.hasMany(CartItems)
Products.hasMany(CartItems)

module.exports = {
  db, Users, Products, Vendors, CartItems
}