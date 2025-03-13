/**
 * nuke-button
 *
 * globals.mjs
 */

import { config } from "./config.mjs"

// globals
export var gCurrentPage = ''
export var gObservers = {}
export var gProfile = ''
export var gPageChanged = false
export var gWhiteList = []

// init profile href
function initProfile() {
	// check if we're on a mobile device
	if (!config.mobile) {
		gProfile = $(config.selectors.profile).attr('href').split('/')[1]
	} else {
		gProfile = $(config.selectors.communities).attr('href').split('/')[1]
	}
}

// init observers
function initObservers() {
	gObservers = { href: new MutationObserver(() => { }), timeline: new MutationObserver(() => { }) }
}

// init white list
function initWhiteList() {
	// array of usernames to whitelist
	gWhiteList = ['boryshn', 'yassghn_', 'commet_w']
}

// set current page
function initCurrentPage() {
	gCurrentPage = window.location.href
}

// update current page
export function setCurrentPage(page) {
	gCurrentPage = page
}

export function setPageChanged(changed) {
	gPageChanged = changed
}

// init globals
export function initGlobals() {
	initCurrentPage()
	initObservers()
	initProfile()
	initWhiteList()
}

// disconnect observers
export function disconnectObservers() {
	for (let observer of gObservers) {
		observer.disconnect()
	}
}