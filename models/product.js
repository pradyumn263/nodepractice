const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	imageUrl: {
		type: String,
		required: true,
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
});

module.exports = mongoose.model("Product", productSchema);

// const mongodb = require("mongodb");
// const { get } = require("http");

// const getdb = require("../util/database").getdb;
// class Product {
// 	constructor(title, price, description, imageUrl, id, userId) {
// 		this.title = title;
// 		this.price = price;
// 		this.description = description;
// 		this.imageUrl = imageUrl;
// 		this._id = id ? new mongodb.ObjectID(id) : null;
// 		this.userId = userId;
// 	}

// 	save() {
// 		const db = getdb();
// 		//connect to mongo and save product
// 		let dbOp;
// 		if (this._id) {
// 			//update the product
// 			dbOp = db
// 				.collection("products")
// 				.updateOne({ _id: this._id }, { $set: this });
// 		} else {
// 			// insert it
// 			dbOp = db.collection("products").insertOne(this);
// 		}
// 		return dbOp
// 			.then((result) => {
// 				console.log(result);
// 			})
// 			.catch((err) => {
// 				console.log(err);
// 			});
// 	}

// 	static fetchAll() {
// 		const db = getdb();
// 		return db
// 			.collection("products")
// 			.find()
// 			.toArray()
// 			.then((products) => {
// 				console.log(products);
// 				return products;
// 			})
// 			.catch((err) => {
// 				console.log(err);
// 			}); //Returns a cursor, basically an iterator
// 	}

// 	static findById(prodId) {
// 		const db = getdb();
// 		return db
// 			.collection("products")
// 			.find({ _id: mongodb.ObjectID(prodId) })
// 			.next()
// 			.then((product) => {
// 				console.log(product);
// 				return product;
// 			})
// 			.catch((err) => {
// 				console.log(err);
// 			});
// 	}

// 	static deleteById(prodId) {
// 		const db = getdb();
// 		return db
// 			.collection("products")
// 			.deleteOne({ _id: new mongodb.ObjectID(prodId) })
// 			.then((result) => {
// 				console.log("Deleted Product!");
// 			})
// 			.catch((err) => {
// 				console.log(err);
// 			});
// 	}
// }

// module.exports = Product;
