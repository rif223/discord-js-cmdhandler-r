const { MessageEmbed } = require("discord.js");
const Command = require("./command");

module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client, { 
      invokes: ["help"],
      description: "This is a list of all commands!",
      usage: ["help", "help <command>"]
    })
  }
  
  exec(opt) {
    let cmd = opt.cmdhandler.cmds[opt.args[0]];
    if(cmd) {
      cmd.sendHelpMsg(opt.channel);
    } else {
      
      let emb = new MessageEmbed()
      .setColor(opt.cmdhandler.defaultColor)
      .setTitle("Commands")
      
      let cmds = {};
      opt.cmdhandler.cmdArray.forEach(c => {
        if(!Object.keys(cmds).includes(c.group)) {
          cmds[c.group] = [c];
        } else {
          cmds[c.group].push(c);
        }
      });
      
      Object.keys(cmds).forEach(group => {
        let text = cmds[group].map(c => {
          return `**${c.invokes[0]}** - *${c.description}*`;
        }).join("\n");
        emb.addField(group, text);
      });
      
      opt.channel.send("", emb);
    }
  }
}
