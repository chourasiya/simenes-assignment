const fs = require('fs');
const ejs = require('ejs');
const genuser = require('./usercreation');
const express = require('express');
const path = require('path');
const html = require('html');
const app = express();
const dpath = path.join(__dirname+'/pages');
app.use(express.static(dpath));
app.use(express.urlencoded())
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
	res.sendFile(dpath + '/home.html');
});

app.post('/createuser', (req, res) => {
	let p ;
	var userdate = new Date(req.body.dob);
	var currentdate = new Date();
	if(req.body.pass != req.body.cpass || userdate > currentdate)
		res.sendFile(dpath + '/reregistration.html');
	fs.readFile('userdata.json', function(err, data) {
		const stats = fs.statSync("userdata.json");
		const filesize = stats.size;
		if(err)
			console.log('error happen');
		else if(!filesize){
			console.log("yes i am null");
			var jsondata = {"username" : req.body.username, "address" : req.body.address, "department" : req.body.department, "field" : req.body.field1, "dob" : req.body.dob, "pass" : req.body.pass, "cpass" : req.body.cpass};
			var userData = [];
			userData.push(jsondata);
			var send = JSON.stringify(userData);
			genuser.userdata(send);	
			res.sendFile(dpath + '/rehome.html');		
		}
		else{
			console.log("hello");
			var send = JSON.parse(data);
			send.forEach((userlist) => {
				console.log(userlist.username);
				if(userlist.username == req.body.username && userlist.address == req.body.address && userlist.department == req.body.department && userlist.field == req.body.field1 && userlist.dob == req.body.dob && userlist.pass == req.body.pass){
					p = 1;
					console.log("user exist1");
				}
			});
			if(p)
			{
				console.log("user exist3" , p);		
				res.sendFile(dpath + '/reuregistration.html');
			}
			else{	
				var jsondata = {"username" : req.body.username, "address" : req.body.address, "department" : req.body.department, "field" : req.body.field1, "dob" : req.body.dob, "pass" : req.body.pass, "cpass" : req.body.cpass};
				send.push(jsondata);
				var sendit = JSON.stringify(send);
				genuser.userdata(sendit);
				res.sendFile(dpath + '/rehome.html');
			}
		}	
	});	
});


app.post('/validateuser', (req, res) => {
	var user = req.body.username;
	var pass = req.body.pass;
	const stats = fs.statSync("userdata.json");
	const filesize = stats.size;
	fs.readFile('userdata.json', function(err, data) {
		if(err)
			console.log('error happen');
		else if(!filesize){
			res.sendFile(dpath + '/reuhome.html');			
		}
		else{
			var send = JSON.parse(data);
			var p = 0;
			var getdata;
			send.forEach((userlist) => {
				if(userlist.username == user && userlist.pass == pass){
					p = 1;
					getdata = {"username" : userlist.username, "address" : userlist.address, "department" : userlist.department, "field" : userlist.field1, "dob" : userlist.dob, "pass" : userlist.pass, "cpass" : userlist.cpass};
				}
			});
			if(p == 0)
				res.sendFile(dpath + '/reuhome.html');
			else{
				res.render(dpath+'/show.ejs', getdata);
			}    
		}	
	});	
});


app.post('/registerpage', (req, res) => {
	res.sendFile(dpath + '/registration.html');
});

app.post('/loginagain', (req, res) => {
	res.sendFile(dpath + '/home.html');
});

app.listen(3000, () => {
	console.log("server start");
});