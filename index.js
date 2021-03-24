const { Plugin, Theme } = require('powercord/entities');
const { resolve } = require('path');

module.exports = class ZenCord extends Plugin {
  async startPlugin () {
    this.zenClass = 'zen-mode';
    this.zen = false;

    // Automatically load the zen styles on plugin load
    new Theme('zen', {
      effectiveTheme: resolve(__dirname, 'style.scss')
    }).apply();

    document.onkeydown = (e) => {
      // CTRL + ALT + [
      if (e.ctrlKey && e.altKey && e.code === 'BracketLeft') {
        this.zen ? this.zen = false : this.zen = true;
        this.zen ? 
          document.body.classList.add(this.zenClass) :
          document.body.classList.remove(this.zenClass);
      }
    };
  }
};
