const { execSync } = require("child_process");
const http = require("http");
require("dotenv").config();

//2 hours
const INTERVAL = 2 * 60 * 60 * 1000;

const oauthtimer = function () {
  const clientid = process.env.BNET_ID;
  const clientsecret = process.env.BNET_SECRET;

  let curloutput = execSync(`curl -u ${clientid}:${clientsecret} -d grant_type=client_credentials https://us.battle.net/oauth/token`).toString('utf8');
  
  curloutput = curloutput.split("\n");

  console.log("**** Console log results are here: " + curloutput[curloutput.length - 1]);

  curloutput = curloutput[curloutput.length - 1]

  let accessToken;

  try {
    accessToken = JSON.parse(curloutput).access_token;
  } catch (err) {
    console.log(err);
  }

  console.log(accessToken);
  process.env.API_KEY = accessToken;
} 

oauthtimer();

global.setInterval(oauthtimer, INTERVAL);