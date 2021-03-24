const { Plugin, Theme } = require('powercord/entities');
const { getOwnerInstance } = require('powercord/util');
const { inject, uninject } = require('powercord/injector');
const { channels: { getChannelId } } = require('powercord/webpack');
const { resolve } = require('path');

module.exports = class PeaceOfMind extends Plugin {
  async startPlugin () {
    this.zen = false;
    this.full = false;

    const zenTheme = new Theme('pom-zen', {
      effectiveTheme: resolve(__dirname, 'style.scss')
    })

    document.onkeydown = (e) => {
      if (e.ctrlKey && e.altKey && e.code === 'BracketRight') {
        if (this.full) {
          this.beginPOM();
        } else {
          this.pluginWillUnload();
        }
      }
      if (e.ctrlKey && e.altKey && e.code === 'BracketLeft') {
        if (this.zen) {
          this.zen = false;
          // TODO: implement this
          // document.body.classList.add();
          zenTheme.remove();
          // NOTE: removing and adding themes is terrible
        } else {
          this.zen = true;
          // TODO: also implement this
          // document.body.classList.add();
          zenTheme.apply();
        }
      }
    };
  }

  beginPOM () {
    const updateGuildInstance = () => (this.guildListInstance = getOwnerInstance(document.querySelector('.wrapper-1Rf91z')));
    const instancePrototypeGuildList = Object.getPrototypeOf(updateGuildInstance());
    updateGuildInstance();

    const updateMemberListInstance = () => (this.memberListInstance = getOwnerInstance(document.querySelector('.members-1998pB')));
    const instancePrototypeMemberList = Object.getPrototypeOf(updateMemberListInstance());
    updateMemberListInstance();

    inject('pom-guild', instancePrototypeGuildList, 'render', (_, res) => {
      if (res.props.children[0].props.children && res.props.children[0].props.children[1]) {
        res.props.children[0].props.children[1] = [];
      }
      res.props.children = [];
      return res;
    });

    inject('pom-memlist', instancePrototypeMemberList, 'render', (_, res) => {
      if (Array.isArray(res.props.children[0].props.children[1])) {
        const channel = getChannelId();
        res.props.children[0].props.children[1].filter(a => {
          if (!a) {
            return false;
          }
          return a.key === channel;
        });
      }
      if (res.props.children[0].props.children[1] && Array.isArray(res.props.children[0].props.children[1][2])) {
        res.props.children[0].props.children[1] = [];
      }
      return res;
    });
    this.memberListInstance.componentDidMount();
    this.memberListInstance.forceUpdate();
    this.guildListInstance.componentDidMount();
    this.guildListInstance.forceUpdate();
  }

  pluginWillUnload () {
    uninject('pom-guild');
    uninject('pom-memlist');
  }
};
