const colors = require("./colors");
const { MessageEmbed } = require("discord.js");
const ArgsTypes = require("./args");
const Command = require("./command");
const HelpCmd = require("./help");

module.exports = class CmdHandler {
  constructor(client, options = {}) {
    if(!client) return;
    if(!options.prefix) return;
    
    this.botOwnerID = options.botOwnerID ? options.botOwnerID : console.error("The bot owner id must be set!");
    this.botOwnerLvl = options.botOwnerLvl ? options.botOwnerLvl : 10;
    
    this.defaultColor = options.defaultColor || colors.BLUE;

    this.client = client;
    this.fs = require("fs");
    this.prefix = options.prefix;
    this.parseDM = options.parseDM || false;
    
    this._helpCmd = new HelpCmd();
    this.cmds = {};
    this.cmdArray = [];
    this.guildPrefix = {};
    this.rolePerm = {};
    this.userPerm = {};
    
    this.userPerm[this.botOwnerID] = this.botOwnerLvl;
    
    client.on("message", msg => this._messageHandler(msg));
  }
  
  setGuildPrefix(guildID, prefix) {
    if(!guildID) return console.error("The guild id must be set!");
    if(!prefix) return console.error("The prefix must be set!");
    this.guildPrefix[guildID] = prefix;
  }
  
  getGuildPrefix(guildID) {
    if(!guildID) return console.error("The guild id must be set!");
    return this.guildPrefix[guildID];
  }
  
  setRolePerm(roleID, permLvl) {
    if(!roleID) return console.error("The role id must be set!");
    if(!permLvl) return console.error("The perm level must be set!");
    this.rolePerm[roleID] = permLvl;
  }
  
  getRolePerm(roleID) {
    if(!roleID) return console.error("The role id must be set!");
    return this.rolePerm[roleID];
  }
  
  setUserPerm(userID, permLvl) {
    if(!userID) return console.error("The user id must be set!");
    if(!permLvl) return console.error("The perm level must be set!");
    if(userID == this.botOwnerID) return console.error("The owner id is already set!");
    
    this.userPerm[userID] = permLvl;
  }
  
  getUserPerm(userID) {
    if(!userID) return console.error("The user id must be set!");
    return this.userPerm[userID];
  }
  
  
  
  _getRoleFromUser(userID) {
    let role = [];
    this.client.guilds.forEach(g => {
      let member = g.members.get(userID);
      if(member) {
        member._roles.forEach(r => {
          if(this.getRolePerm(r)) {
            role.push({ roleID: r, permLvl: this.getRolePerm(r) });
          }
        });
      }
    });
    return role;
  }
  
  _getHighestPermRoleFromUser(userID) {
    let role = this._getRoleFromUser(userID).sort((role1, role2) => {
      return role2.permLvl - role1.permLvl;
    })[0];
    return role;
  }
  
  
  registerCommand(cmd) {
    if(typeof cmd == "function") {
      if(cmd.prototype instanceof Command) {
        cmd = new cmd(this.client);
        cmd.invokes.forEach(invoke => {
          this.cmds[invoke] = cmd;
        });
        this.cmdArray.push(cmd);
      } else {
        console.error("The class must be extend the command class!");
      }
    } else {
      console.error("The class must be set!");
    }
  }
  
  registerCommandsIn(path) {
    this.fs.readdir(path, (err, files) => {
      if(err) return console.error(err);
      files.forEach(file => {
        const cmd = require(path + file);
        this.registerCommand(cmd);
      });
    });
  }
  
  _messageHandler(msg) {
    let chan = msg.channel;
    let memb = msg.member;
    let aut = msg.author;
    let g = msg.guild;
    let cont = msg.content;

    if(aut.bot) return;
    if(!g && this.parseDM == false) return;
    
    let guildPrefix = this.getGuildPrefix(g.id);
    if(guildPrefix) this.prefix == guildPrefix;
    
    if(cont.indexOf(this.prefix) !== 0) return;

    const args = msg.content.slice(this.prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    
    let opt = {};
    opt.message = msg;
    opt.channel = chan;
    opt.args = args;
    opt.guild = g;
    opt.cmdhandler = this;
    opt.argsTypes = new ArgsTypes(opt);
    
    if(this.cmds[cmd]) {
      
      let rolePermLvl = this._getHighestPermRoleFromUser(aut.id).permLvl;
      let userPermLvl = this.getUserPerm(aut.id);
      
      let permLvl = 0;
      if(rolePermLvl && userPermLvl) {
        if(rolePermLvl < userPermLvl) {
          permLvl = userPermLvl;
        } else if(rolePermLvl > userPermLvl) {
          permLvl = rolePermLvl;
        }
      } else if(!rolePermLvl && userPermLvl) {
        permLvl = userPermLvl;
      } else if(rolePermLvl && !userPermLvl) {
        permLvl = rolePermLvl;
      }
          
      if(permLvl >= this.cmds[cmd].permission) {
        this.cmds[cmd].exec(opt);
      } else {
        let emb = new MessageEmbed()
        .setColor(colors.RED)
        .setTitle("Error")
        .setDescription("Missing Permission!")
        chan.send("", emb)
      }
      
    } else if(cmd == "help") {
      console.log(cmd);
      this._helpCmd.exec(opt);
    }
  }

}
