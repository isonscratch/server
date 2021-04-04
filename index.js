const express = require('express');
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
require('dotenv').config();
const jsoning = require('jsoning');
var status = new jsoning("status.json");
var auth = new jsoning("auth.json");
const fetch = require("node-fetch");
const retronid = require("retronid");
// home page
app.get('/', (req, res) => {
	res.sendFile("/home/runner/onestate-server/pages/index.html");
});
// css
app.get('/css.css', (req, res) => {
	res.sendFile("/home/runner/onestate-server/css/tailwind.css");
});
// auth pages
app.get('/auth', (req, res) => {
	res.sendFile("/home/runner/onestate-server/pages/welcomeauth.html");
});
app.get('/auth/send', (req, res) => {
	res.redirect(`https://fluffyscratch.hampton.pw/auth/getKeys/v2?redirect=aXNvbi53Z3l0LnRrL2F1dGgvY2FsbGJhY2s`);
});
app.get("/auth/callback", (req, res) => {
	var response;
	h = fetch(`https://fluffyscratch.hampton.pw/auth/verify/v2/${req.query.privateCode}`).then((response) => {
		if (response.valid === true) {
			retroid = retronid.generate();
			res.json({
				"user": req.query.username,
				"retronid": retroid
			});
			status.set(`${req.query.username}`,false);
			auth.set(`${req.query.username}`,retroid);
		} else {
			res.redirect('/auth');
		}
	});
});
app.post('/api/v1/:user', async(req, res) => {
	authtoken = req.body.retroid;
	username = req.params.user;
	if (await auth.get(req.params.user) === authtoken) {
		status.set(`${req.params.user}`,req.body.online||false);
		res.send('done');
	} else {
		res.send('error');
		console.log('auth error')
	}
});
app.listen(3000);
app.get('/api/v1/:user', async (req, res) => {
	json = await (await fetch(`https://my-ocular.jeffalo.net/api/user/${req.params.user}`)).json()
	data = {status:await status.get(req.params.user),ocular:json}
	res.json(data)
});