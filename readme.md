# nuke-button <img align="right" style="width: 46px; height: 46px" alt-text="nuke-button icon" title="nuke-button" src="https://www.svgrepo.com/download/528868/bomb-emoji.svg"/>

*kill 'em all!*

userscript written to assist in blocking on twitter

## dev

```boo
$ npm i

$ npm build

$ npm cleanbuild
```

## install

add userscript manager plugin, like, [tampermonkey](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/), to your browser

[click to add nuke-button[+]](https://github.com/yassghn/nuke-button/raw/refs/heads/master/dist/nuke-button.user.js)
    - has debugging enabled

nuke-button is also available on [greasyfork!](https://update.greasyfork.org/scripts/528380/nuke%20button.user.js)

## notes

disable debugging for normal usage, or install from greasyfork.

due to how object logging works in the browser, leaving debugging enabled with extensive use of the script can be prone to memory leaks. it'll slow down your browser and eventually force you to restart.

## license

[OUI](/license)