const { Client } = require("discord.js");
const client = new Client();

let prefix = "^";

const { CmdHandler } = require("../src/index");

const cmdhandler = new CmdHandler(client, {
  prefix: prefix,
  botOwnerID: "123"
});

cmdhandler.registerCommandsIn(__dirname + "/cmds/");

client.login("1234567890");