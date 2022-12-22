const Cart = require("../models/Cart");
const Item = require('../models/Items')
const { mongoose} = require("mongoose");
const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://gaston:hola123456@cluster0.rwbkoiq.mongodb.net/motorx"


const client = new MongoClient(uri, { useNewUrlParser: true })

const collection = client.db("motorx").collection("carts")

let pacialQuantity = 0


const controller = {
  deleteManyById : async (req, res) => {
    
    const { userId } = req.params;

    try {
      await collection.deleteMany({ "userId" : mongoose.Types.ObjectId(userId) })
      res.status(200).json({
        message: "Thank you for your purchase",
        success: true
      });
    } catch (error) {
      res.status(400).json({
        message: "What the shit",
        success: false
      });
    }
    


  },
 addItemCart : async (req, res) => {
  const { title, picture_url, unit_price, userId } = req.body;

  /* Nos fijamos si tenemos el Item */
  const itsInItems = await Item.findOne({ title });

  /* Nos fijamos si todos los campos vienen con info */
  const isntEmpty = title !== "" && picture_url !== "" && unit_price !== "" && userId !== "";

  /* Nos fijamos si el Item ya esta en el carrito */
  const itsInTheCart = await Cart.findOne({ title });
  const userCart = await Cart.findOne({ userId,title });
  /* Si no tenemos el Item */

  if (!itsInItems) {
    res.status(400).json({
      message: "This Item doesn´t exist in our data base ",
    });

    /* Si nos envian algo y no esta en el carrito lo agregamos */
  } else if (isntEmpty && !itsInTheCart) {
    const newItemInCart = new Cart({ title, picture_url, unit_price, quantity: 1, userId });

    /* Y actualizamos la prop inCart: true en nuestros Items */
    await Item.findByIdAndUpdate(
      itsInItems?._id,
      { inCart: true, title, picture_url, unit_price, userId },
      { new: true }
    )
      .then((item) => {
        newItemInCart.save();
        res.json({
          message: `The item has been added to the cart`,
          newItemInCart,
        });
      })
      .catch((error) => console.error(error));

    /* Y si esta en el carrito avisamos */
  } else if (!userCart) {
    const newItemInCart = new Cart({ title, picture_url, unit_price, quantity: 1, userId });
    newItemInCart.save();

    res.json({
      message: "The new Item has been added to the cart",
    });
  } else if (userCart) {
    res.json({
      message: "The item is already in the cart",
    });
  }
},

increaseAmount : async (req, res) =>{

  const { itemId } = req.params;

  const body = req.body;

  /* Buscamos el item en el carrito */
  const itemSearched = await Cart.findById(itemId);

  if (itemSearched) {

    body.amount + 1 ;
    console.log(body.amount);
    await Cart.findByIdAndUpdate(itemId, body, {
      new: true,
    }).then((item) => {
      res.json({
        mensaje: `The item: ${item.title} was updated`,
        item,
      });
    });

  } 


},

//*
deleteItem : async (req, res) => {
    const { itemId } = req.params;
  
    /* Buscamos el item en el carrito */
    const itemInCart = await Cart.findById(itemId);
  
    /* Buscamos el item en nuestra DB por el nombre del que esta en el carrito */
    const { title, picture_url, unit_price, _id } = await Item.findOne({
      title: itemInCart.title,
    });
  
    /* Buscamos y eliminamos el item con la id */
    await Cart.findByIdAndDelete(itemId);
    
    /* Buscamos y editamos la prop inCart: false */
    /* Le pasamos la id del producto en la DB */
    /* La prop a cambiar y las demas */
    /* Y el new para devolver el producto editado */
    await Item.findByIdAndUpdate(
      _id,
      { inCart: false, title, picture_url, unit_price },
      { new: true }
    )
      .then((item) => {
        res.json({
          message: `The item ${item.title} was eliminated of the cart`,
        });
      })
      .catch((error) => res.json({ message: "Error" }));
  },
  getItems : async (req, res) => {
    const items = await Item.find();
  
    if (items) {
      res.json({ items });
    } else {
      res.json({ menssage: "No items found" });
    }
  },
  getItemsCart : async (req, res) => {
    const itemsCart = await Cart.find();
  
    if (itemsCart) {
      res.json({ itemsCart });
    } else {
      res.json({ menssage: "There aren´t items in the cart" });
    }
  },
  putItem : async (req, res) => {
    const { itemId } = req.params;
    const { query } = req.query;
    const body = req.body;

    /* Buscamos el item en el carrito */
    const itemSearched = await Cart.findById(itemId);
  
    /* Si no hay query 'add' o 'del' */
    if (!query) {
      res.status(404).json({ message: "You must send a query" });
  
      /* Si esta el item en el carrito y quiero agregar */
    } else if (itemSearched && query === "add") {
      pacialQuantity += body.quantity;
      
      await Cart.findByIdAndUpdate(itemId, {quantity:pacialQuantity}, {
        new: true,
      }).then((item) => {
        res.json({
          message: `The item: ${item.title} was updated`,
          item,
        });
      });
  
      /* Si esta el item en el carrito y quiero sacar */
    } else if (itemSearched && query === "del") {
      pacialQuantity -= body.quantity;
  
      await Cart.findByIdAndUpdate(itemId, {quantity:pacialQuantity}, {
        new: true,
      }).then((item) =>
        res.json({
          message: `The item: ${item.title} was updated`,
          item,
        })
      );
    } else {
      res.status(400).json({ message: "Error" });
    }
  },

}
module.exports = controller