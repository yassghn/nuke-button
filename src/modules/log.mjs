/**
 * nuke-button
 *
 * log.mjs
 */

import { config } from "./config.mjs"

// log
export function log(msg, err = false) {
	if (config.debug) {
		if (err) {
			console.error(msg)
		} else {
			console.log(msg)
		}
	}
}