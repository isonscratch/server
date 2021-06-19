const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
const jsoning = require("jsoning-no-limits");
var user = new jsoning(".env/db.json");
const fetch = require("node-fetch");
const retronid = require("retronid");
// keep
app.get("/", async (req, res) => {
	res.send("hiiiiiiiiiiiiiii");
});
// ext
app.get("/extension", async (req, res) => {
	res.send("hiiiiiiiiiiiiiii");
});
app.get("/extension/changes", async (req, res) => {
	res.send("hiiiiiiiiiiiiiii");
});
// auth pages
app.get("/auth", async (req, res) => {
	res.redirect(`https://fluffyscratch.hampton.pw/auth/getKeys/v2?redirect=c3RhdGUub25lZG90LmNmL2F1dGhjYWxsYmFjaw==`);
});
app.get("/authcallback", async (req, res) => {
	var response = await fetch(`https://fluffyscratch.hampton.pw/auth/verify/v2/${req.query.privateCode}`);
	var data = await response.json();
	if (data.valid) {
		retroid = retronid.generate();
		res.send(
			`<h1>Welcome @${escape(
				data.username,
			)}! Enter the following code in your client, but <b><i>DO NOT SHARE IT</i></b>:</h1><br><h2 id="token">${retroid}</h2><br><p>Some clients may automatically get your token.</p>`,
		);
		// welcome user
		user.set(`${data.username}`, {
			online: true,
			retroid: retroid,
			richpresense: "",
			richpresenseurl: "",
		});
	} else {
		res.redirect("/auth");
	}
});
// api
app.post("/api/v1/user/:user", async (req, res) => {
	if ((await user.get(req.params.user)).retroid == req.body.retroid) {
		user.set(`${req.params.user}`, req.body);
		res.json({ ok: true });
	} else {
		res.json({ ok: false });
	}
});
app.get("/api/v1/user/:user", async (req, res) => {
	json = await (await fetch(`https://my-ocular.jeffalo.net/api/user/${req.params.user}`)).json();
	var clone = Object.assign({}, await user.get(req.params.user), { token: undefined, ocular: json });
	res.json(clone);
});
app.listen(3000);
