const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const xoauth2 = require("xoauth2");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const User = require("../models/user");
const user = require("../models/user");

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
							subject: "Thank You For Signing Up!",
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

exports.getReset = (req, res, next) => {
	let message = req.flash("error");
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render("auth/reset", {
		path: "/reset",
		pageTitle: "Reset Password",
		errorMessage: message,
	});
};

exports.postReset = (req, res, next) => {
	crypto.randomBytes(32, (err, buffer) => {
		if (err) {
			console.log(err);
			return res.redirect("/reset");
		}
		const token = buffer.toString("hex");
		User.findOne({ email: req.body.email })
			.then((user) => {
				if (!user) {
					req.flash("err", "No account with that email found");
					return res.redirect("/reset");
				}

				user.resetToken = token;
				user.resetTokenExpiration = Date.now() + 3600000;
				user.save().then((result) => {
					let mailOptions = {
						from: "Prady's Shop <pradysshop@gmail.com>",
						to: req.body.email.toString(),
						subject: "Password Reset link",
						html: `
							<p> You requested a Password Reset, ignore this message if you did not.
							<p> Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
						`,
					};
					res.redirect("/");
					return transporter.sendMail(mailOptions, (err, res) => {
						if (err) {
							console.log(err);
						} else {
							console.log("Email Sent!");
						}
					});
				});
			})
			.catch((err) => {
				console.log(err);
			});
	});
};

exports.getNewPassword = (req, res, next) => {
	const token = req.params.token;
	User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
		.then((user) => {
			console.log("Im here", user);
			let message = req.flash("error");
			if (message.length > 0) {
				message = message[0];
			} else {
				message = null;
			}
			res.render("auth/new-password", {
				path: "/new-password",
				pageTitle: "Change Password",
				errorMessage: message,
				userId: user._id.toString(),
				passwordToken: token,
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.postNewPassword = (req, res, next) => {
	const newPassword = req.body.password;
	const userId = req.body.userId;
	const passwordToken = req.body.passwordToken;
	let resetUser;
	let userEmail;
	User.findOne({
		resetToken: passwordToken,
		resetTokenExpiration: { $gt: Date.now() },
		_id: userId,
	})
		.then((user) => {
			resetUser = user;
			return bcrypt.hash(newPassword, 12);
		})
		.then((hashedPassword) => {
			resetUser.password = hashedPassword;
			resetUser.resetToken = undefined;
			resetUser.resetTokenExpiration = undefined;
			userEmail = resetUser.email;
			return resetUser.save();
		})
		.then((result) => {
			console.log("Hey, I am about to send mail");
			let mailOptions = {
				from: "Prady's Shop <pradysshop@gmail.com>",
				to: userEmail,
				subject: "Password Reset link",
				html: `
					<p>Your Password has been reset successfully. Try not forgetting the password of the most important website you've ever visited. IF YOU DID NOT WISH TO RESET YOUR PASSWORD CONTACT PRADY BOY RIGHT NOW </p>
				`,
			};
			res.redirect("/login");
			return transporter.sendMail(mailOptions, (err, res) => {
				if (err) {
					console.log(err);
				} else {
					console.log("Email Sent!");
				}
			});
		})
		.catch((err) => {
			console.log(err);
		});
};
