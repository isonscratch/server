const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
require("dotenv").config();
const jsoning = require("jsoning");
var status = new jsoning("status.json");
var auth = new jsoning("auth.json");
const fetch = require("node-fetch");
const retronid = require("retronid");
// auth pages
app.get("/auth", (req, res) => {
	res.redirect(`https://scratch.auth.onedot.cf/?url=https://state.onedot.cf/auth/callback`);
});
app.get("/auth/callback", (req, res) => {
	var response;
	if (req.query.verified == 'true') {
		retroid = retronid.generate();
		res.send(`<h1>Welcome @${req.query.username}! Enter the following code in your client:</h1><br><h2>${retroid}</h2>`)
		status.set(`${req.query.username}`,true);
		auth.set(`${req.query.username}`, retroid);
	} else {
		res.redirect("/auth");
	}
});
// api
app.post("/api/v1/user/:user", async (req, res) => {
	authtoken = req.body.retroid;
	username = req.params.user;
	if ((await auth.get(req.params.user)) === authtoken) {
		status.set(`${req.params.user}`, req.body.online || false);
		res.json({"ok":true});
	} else {
		res.json({"ok":false});
		console.log("auth error");
	}
});
app.get("/api/v1/user/:user", async (req, res) => {
	json = await (await fetch(`https://my-ocular.jeffalo.net/api/user/${req.params.user}`)).json();
	data = { status: await status.get(req.params.user), ocular: json };
	res.json(data);
});
app.get("/api/v1/users/", async (req, res) => {
	res.json(await status.all());
});
app.listen(3000);
