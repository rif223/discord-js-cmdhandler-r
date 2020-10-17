const colors = require("./colors");
const { MessageEmbed } = require("discord.js");

module.exports = class Argument {
  constructor(opt) {
    this.opt = opt;
  }
  
  reason(number) {
    let reason = this.opt.args.slice(number).join(" ");
    let emb = new MessageEmbed()
    .setColor(colors.RED)
    .setTitle("Error")
    .setDescription("No reason was given!")
    if(!reason) this.opt.channel.send("", emb);
    return reason;
  }
  
  member(number) {
    let margs = this.opt.args.slice(number).join(" ");
    let m = this.opt.guild.members.find((m) => m.user.username == margs || m.id == margs || "<@" + m.id + ">" == margs);
    let emb = new MessageEmbed()
    .setColor(colors.RED)
    .setTitle("Error")
    .setDescription("I haven't found a member!")
    if(!m) this.opt.channel.send("", emb);
    return m;
  }
  
  channel(number) {
    let chargs = this.opt.args.slice(number).join(" ");
    let ch = this.opt.guild.channels.find((ch) => ch.name == chargs || ch.id == chargs || "<#" + ch.id + ">" == chargs);
    let emb = new MessageEmbed()
    .setColor(colors.RED)
    .setTitle("Error")
    .setDescription("I haven't found a channel!")
    if(!ch) this.opt.channel.send("", emb);
    return ch;
  }
  
  role(number) {
    let roleargs = this.opt.args.slice(number).join(" ");
    let role = this.opt.guild.roles.find((r) => r.name == roleargs || r.id == roleargs || "<@&" + r.id + ">" == roleargs);
    let emb = new MessageEmbed()
    .setColor(colors.RED)
    .setTitle("Error")
    .setDescription("No role is specified!")
    if(!role) this.opt.channel.send("", emb);
    return role;
  }
  
}