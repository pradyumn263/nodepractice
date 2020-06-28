const dp = require("../util/database");
const Cart = require("./cart");

module.exports = class Product {
	constructor(id, title, imageURL, description, price) {
		this.id = id;
		this.title = title;
		this.imageUrl = imageURL;
		this.description = description;
		this.price = price;
	}

	save() {}

	static deleteById() {}

	static fetchAll() {
		return dp.execute("SELECT * FROM products");
	}

	static findById(id) {}
};
