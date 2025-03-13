/**
 * nuke-button
 *
 * browser.mjs
 */

import { log } from './log.mjs'

// open href in new tab
export function openHrefInNewTab(href) {
	// complete url
	const url = `https://x.com${href}`
	log(`opening url: ${url}`)
	// open new tab
	window.open(url, '_blank')
	//window.focus()
}