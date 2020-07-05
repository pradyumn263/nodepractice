const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
	MongoClient.connect(
		"mongodb+srv://pradyboy:Pradyboy263@cluster0.ylycp.mongodb.net/shop?retryWrites=true&w=majority"
	)
		.then((client) => {
			console.log("Connected!");
			_db = client.db();
			callback();
		})
		.catch((err) => {
			console.log("I'm Here");
			console.log(err);
			throw err;
		});
};

const getdb = () => {
	if (_db) {
		return _db;
	}
	throw "No Database Found!";
};
exports.mongoConnect = mongoConnect;
exports.getdb = getdb;
