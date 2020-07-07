const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const xoauth2 = require("xoauth2");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const User = require("../models/user");

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		type: "OAuth2",
		user: "pradysshop@gmail.com",
		clientId:
			"495558664491-33bl1kp3qv22ihtk1rofm3rk8cjgm6hj.apps.googleusercontent.com",
		clientSecret: "I_6Fyf8qbUwXsOYYy_6ye78T",
		refreshToken:
			"1//04jbhXNGyaxO5CgYIARAAGAQSNwF-L9IrOP0JqQNH-A006T3yekDuAk4gRuMfhrcd2uEkzUuyYr41AIEDVN5l1C-Mjqnk1l33lDI",
		accessToken:
			"ya29.a0AfH6SMCpP_p9FK-xAHESaoZh8EiNWxnmHrxib-Yd-ovhcSurIWe30K6llTeSM3sStPMWQRzQPSMT-Jd6j-lgqZdUagPOVGO01RKjblOHd5WvQn9EK66LNzz-DNQ9g9bH5xzGgTk_u5f7ykrc1lMzg3Yr5gAr5UjgPbY",
	},
});

exports.getLogin = (req, res, next) => {
	let message = req.flash("error");
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render("auth/login", {
		path: "/login",
		pageTitle: "Login",
		errorMessage: message,
	});
};

exports.postLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	User.findOne({ email: email })
		.then((user) => {
			if (!user) {
				req.flash("error", "invalid email or password");
				return res.redirect("/login");
			}
			bcrypt
				.compare(password, user.password)
				.then((doMatch) => {
					if (doMatch) {
						req.session.isLoggedIn = true;
						req.session.user = user;
						return req.session.save((err) => {
							console.log(err);
							res.redirect("/");
						});
					}
					req.flash("error", "invalid email or password");
					res.redirect("/login");
				})
				.catch((err) => {
					console.log(err);
					res.redirect("/login");
				});
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.postLogout = (req, res, next) => {
	req.session.destroy((err) => {
		console.log(err);
		res.redirect("/");
	});
};

exports.getSignup = (req, res, next) => {
	let message = req.flash("error");
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render("auth/signup", {
		path: "/signup",
		pageTitle: "Signup",
		errorMessage: message,
	});
};

exports.postSignup = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const confirmPassword = req.body.password;

	User.findOne({ email: email })
		.then((userDoc) => {
			if (userDoc) {
				req.flash("error", "account already exists");
				return res.redirect("/signup");
			} else {
				return bcrypt
					.hash(password, 12)
					.then((hashedPassword) => {
						const user = new User({
							email: email,
							password: hashedPassword,
							card: { items: [] },
						});
						return user.save();
					})
					.then((result) => {
						res.redirect("/login");
						let mailOptions = {
							from: "Prady's Shop <pradyumnshukla26@gmail.com",
							to: email.toString(),
							subjext: "Thank You For Signing Up!",
							text: "Thank you very much for signing up to my Shop!",
						};
						return transporter.sendMail(mailOptions, (err, res) => {
							if (err) {
								console.log(err);
							} else {
								console.log("Email Sent!");
							}
						});
					});
				// .then(() => {
				// 	console.log("Email sent");
				// })
				// .catch((err) => {
				// 	console.log(err);
				// });
			}
		})
		.catch((err) => {
			console.log(err);
		});
};
