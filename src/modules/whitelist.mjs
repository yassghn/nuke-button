/**
 * nuke-button
 *
 * whitelist.mjs
 */

import { gWhiteList } from "./globals.mjs"

// filter block list
export function filterDedupWhiteList(item, index, arr) {
	// do not include white listed accounts
	if (gWhiteList.indexOf(item.username) > -1) {
		return false
	}
	// dedup based username and userid
	const i = arr.findIndex((item2) => ['username', 'userId'].every((key) => item2[key] === item[key]))
	return i === index
}