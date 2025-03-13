/**
 * nuke-button
 *
 * nuke-button.user.js
 */
import { config } from './modules/config.mjs'
import { initGlobals } from './modules/globals.mjs'
import { pollReactState, isLoggedIn, getElement } from './modules/polling.mjs'
import { observeApp } from './modules/observe.mjs'
import { insertCss } from './modules/html-css.mjs'

(function () {
    'use strict'

    // main
    async function main() {
        // wait for react state
        const reactState = await pollReactState()
        // wait for login if necessary
        await isLoggedIn(reactState)
        // wait for timeline to load in
        await getElement(config.selectors.tl)
        // init globals
        initGlobals()
        // insert css
        insertCss()
        // observe
        observeApp()
    }

    // run script
    window.onload = main()

})();