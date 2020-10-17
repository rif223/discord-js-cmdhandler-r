const { MessageEmbed } = require("discord.js");
const { defaultColor } = require("./cmdhandler");
const colors = require("./colors");

module.exports = class Command {
  constructor(client, info) {
    this.client = client;
    this.invokes = info.invokes;
    this.description = info.description || "no description";
    this.usage = info.usage || "no usage";
    this.group = info.group || "DEFAULT";
    this.permission = info.permission || 0;
  }
  
  exec(msg, args) {
    console.error("exec() must be implemented!");
  }
  
  sendErrorMsg(chan, error) {
    let emb = new MessageEmbed()
    .setColor(colors.RED)
    .setTitle("Error")
    .setDescription(error)
    chan.send("", emb)
  }
  
  sendHelpMsg(chan) {
    let aliases = delete this.invokes[0]
    let emb = new MessageEmbed()
    .setColor(defaultColor)
    .addField("Command", this.invokes[0])
    .addField("Description", this.description)
    .addField("Usage", this.usage)
    .addField("Aliases", aliases)
    .addField("Group", this.group)
    .addField("Permission", this.permission)
    chan.send("", emb)
  }
  
}