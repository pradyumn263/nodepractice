const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "nodejs", {
	dialect: "mysql",
	host: "localhost",
});

module.exports = sequelize;
