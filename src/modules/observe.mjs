/**
 * nuke-button
 *
 * observe.mjs
 */

import { config } from './config.mjs'
import { gObservers, gCurrentPage, gPageChanged, setCurrentPage, setPageChanged } from './globals.mjs'
import { log } from './log.mjs'
import { getElement, pollReactState, isLoggedIn } from './polling.mjs'
import { addNukeButton, appendNukeButtonHtml } from './nuke-button.mjs'

// on timeline change
function onTimelineChange(mutations) {
	for (const mutation of mutations) {
		// append nuke button
		$(mutation.addedNodes).find(config.selectors.avatar).each((index, post) => { appendNukeButtonHtml(post) })
	}
}

function isUserPage() {
	// try to get username
	const username = window.location.href.split('/')[3]
	const url = `/${username}/header_photo`
	// test for user page
	if ($('div').find(`a[href="${url}"]`).length == 1) {
		log(':is user page:')
		return true
	}
	// return false
	return false
}

// build userpage timeline selector
function getUserPageTimelineSelector() {
	// get user display name
	const displayName = $('div[data-testid="UserName"]').find('span').first().text()
	const selector = `div[aria-label="Timeline: ${displayName}’s posts"]`
	return selector
}

// observe timeline
async function observeTimeline(selector) {
	// create observer with callback
	const observer = new MutationObserver((mutations) => { onTimelineChange(mutations) })
	// disconnect old observer
	// todo: not sure if this is necessary, maybe modals disconnect it anyway?
	gObservers.timeline.disconnect()
	gObservers.timeline = observer
	// wait for timeline to load in
	await getElement(config.selectors.status)
	observer.observe($(selector).children().first()[0], { childList: true })
	// check if page has changed
	//if (!gPageChanged) {
	// add nuke button to initial posts
	addNukeButton()
	//}
}

// when home timeline navigation event is propagated
function onHomeNavigationEvent() {
	// reset page changed if it was changed
	setPageChanged(false)
	// create timeline observer
	observeTimeline(config.selectors.hometl)
	log('home nav changed')
}

async function observeWindowHref() {
	setInterval(() => {
		// check if location changed
		if (gCurrentPage != window.location.href) {
			// update current page
			setCurrentPage(window.location.href)
			onWindowHrefChange()
		}
	}, 1000)
}

// observe for location changes
function observeWindowHrefasdf() {
	// observer with callback
	const observer = new MutationObserver(() => {
		// check if location changed
		if (gCurrentPage != window.location.href) {
			// update current page
			setCurrentPage(window.location.href)
			onWindowHrefChange()
		}
	})
	gObservers.href.disconnect()
	gObservers.href = observer
	observer.observe(document, { childList: true, subtree: true })
}

// process current page
export async function processCurrentPage(updatePage = false) {
	// check href location
	if (window.location.href.endsWith('home')) {
		// check for home
		// todo: work out updating this value after more back and forth browsing
		// todo: work out race conditions where polling fails
		// update page changed
		setPageChanged(updatePage ? true : false)
		addHomeNavigationListener()
		// wait for timeline to load in
		await getElement(config.selectors.hometl)
		// todo: dethrottle polling when no posts are loading
		observeTimeline(config.selectors.hometl)
	} else if (isUserPage()) {
		// check for userpage
		// update page changed
		setPageChanged(updatePage ? true : false)
		// get userpage timeline selector
		const selector = getUserPageTimelineSelector()
		// wait for timeline to load in
		await getElement(selector)
		observeTimeline(selector)
	} else if (window.location.href.includes('status')) {
		// check for status (post) view page
		// todo: editstatusview does not update correctly sometimes
		// todo: if you need to use 'view' for the post nuke-button does not populate to the main status
		//update page changed
		setPageChanged(updatePage ? true : false)
		// wait for timeline to load in
		await getElement(config.selectors.statustl)
		// change status view css
		editStatusViewCss()
		// obvserve timeline
		observeTimeline(config.selectors.statustl)
	} else if (window.location.href.includes('search?q=')) {
		// check for search page
		//update page changed
		setPageChanged(updatePage ? true : false)
		// wait for timeline to load in
		await getElement(config.selectors.searchtl)
		// observe timeline
		observeTimeline(config.selectors.searchtl)
	}
}

export async function onWindowHrefChange() {
	log(`window href changed: ${window.location.href}`)
	// wait for react state
	const reactState = await pollReactState()
	// wait for login if necessary
	await isLoggedIn(reactState)
	// process current page
	processCurrentPage(true)
}

// add navigation listener
export function addHomeNavigationListener() {
	// add event listener for timeline tabs
	$(config.selectors.nav).eq(1).on('mousedown', onHomeNavigationEvent)
}

// setup mutation observers
export function observeApp() {
	// add timeline observer
	processCurrentPage()
	// add window location poling
	observeWindowHref()
}