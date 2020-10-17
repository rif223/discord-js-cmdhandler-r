const { Command } = require("../../src/index");

module.exports = class TestCommand extends Command {
  constructor(client) {
    super(client, { 
      invokes: ["test"],
      description: "This is a test command!",
      usage: "test <member>",
      group: "TEST",
      permission: 0
    })
  }
  
  exec(opt) {
    
    let member = opt.argsTypes.member(0);
    if(!member) return;
    opt.channel.send("This is a test for " + member.user.username);
    
  }
}
