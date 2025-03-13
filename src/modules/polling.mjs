/**
 * nuke-button
 *
 * polling.mjs
 */

import { log } from './log.mjs'
import { getReactState } from './fight-react.mjs'

/**
 * @param {string} selector
 * @param {{
*   name?: string
*   stopIf?: () => boolean
*   timeout?: number
*   context?: Document | HTMLElement
* }?} options
* @returns {Promise<HTMLElement | null>}
*/
export function getElement(selector, {
	name = null,
	stopIf = null,
	timeout = Infinity,
	context = document,
} = {}) {
	return new Promise((resolve) => {
		let startTime = Date.now()
		let rafId
		let timeoutId

		function stop($element, reason) {
			resolve($element)
		}

		if (timeout !== Infinity) {
			timeoutId = setTimeout(stop, timeout, null, `${timeout}ms timeout`)
		}

		function queryElement() {
			let $element = context.querySelector(selector)
			if ($element) {
				log(`found element with selector: ${selector}`)
				stop($element)
			}
			else if (stopIf?.() === true) {
				stop(null, 'stopIf condition met')
			}
			else {
				log(`waiting for element with selector: ${selector}`)
				rafId = requestAnimationFrame(queryElement)
			}
		}

		queryElement()
	})
}

// poll for react state
export async function pollReactState() {
	// new promise
	const promise = new Promise((resolve) => {
		// interval id
		let intervalId = 0
		// function to return react state
		function returnReactState(reactState) {
			log('found react state')
			log(reactState)
			// resolve react state
			resolve(reactState)
		}
		// poll for react state
		function poll() {
			// use set interval to poll
			intervalId = setInterval(function () {
				try {
					const reactState = getReactState()
					// clear interval
					clearInterval(intervalId)
					// resolve
					returnReactState(reactState)
				} catch (error) {
					log('waiting for react state...')
				}
			}, 1000)
		}
		// start polling
		poll()
	})
	return promise
}

// wait for user to login if necessary
export async function isLoggedIn(reactState) {
	// new promise
	const promise = new Promise((resolve) => {
		// interval id
		let intervalId = 0
		// resolve promise
		function resolved() {
			log('user logged in')
			// resolve
			resolve(true)
		}
		// poll checking if user is logged in
		function pollLoggedIn() {
			// poll with set interval
			intervalId = setInterval(function () {
				//check href and window vars
				if (!(window?.__META_DATA__?.isLoggedIn == false) &&
					!window.location.href.includes('/i/flow/login')) {
					// clear interval
					clearInterval(intervalId)
					// resolve
					resolved()
				} else {
					// keep polling
					log('waiting for user login')
				}
			}, 1000)
		}
		// start polling
		pollLoggedIn()
	})
	// return promise
	return promise
}
