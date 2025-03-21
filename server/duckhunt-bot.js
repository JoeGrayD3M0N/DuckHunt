export class DuckHunt {
  constructor() {
    this.stats = {};
  }

  handleCommand(username, command) {
    if (!this.stats[username]) {
      this.stats[username] = { shots: 0, hits: 0 };
    }

    switch (command) {
      case '!bang':
        this.stats[username].shots += 1;
        return `🔫 ${username} shot at a duck!`;
      case '!stats':
        const s = this.stats[username];
        return `${username}'s stats — Shots: ${s.shots}, Hits: ${s.hits}`;
      case '!help':
        return 'Commands: !bang, !stats, !top, !reload, !help';
      default:
        return 'Unknown command.';
    }
  }
}