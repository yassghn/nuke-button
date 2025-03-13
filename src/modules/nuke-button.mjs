/**
 * nuke-button
 *
 * nuke-button.mjs
 */

import { config } from './config.mjs'
import { gWhiteList, gProfile } from './globals.mjs'
import { log } from './log.mjs'
import { extractUserId } from './api-data.mjs'
import { getBlockList, blockBlockList, fetchUserId } from './api-request.mjs'
import { getProcessingHtml, getProcessingCss, getPostHref, getNukeConfirmationHtml, getNukeButtonHtml } from './html-css.mjs'
import { removeReactObjects, hidePost } from './fight-react.mjs'

// kill 'em all
async function killEmAll(href) {
	// get username from href
	const targetUsername = href.split('/')[1]
	const tweetId = href.split('/')[3]
	try {
		// get user data
		const userData = await fetchUserId(targetUsername)
		// check for error
		if (userData.message) {
			// throw error
			throw userData.message
		}
		// extract user id
		const targetUserId = extractUserId(userData)
		const blockList = await getBlockList(targetUserId, targetUsername, tweetId)
		const result = await blockBlockList(blockList, href)
		log(`processing finished for ${href}: blocked ${result} accounts`)
	} catch (e) {
		// log error url
		if (e.url) {
			log(`api request error for url: ${e.url}`, true)
		}
		// log error
		log(e, true)
		return undefined
	}
	// return href on success
	return href
}

// rebind the nuke function
function rebindNukeCommand(post) {
	$(post).find(config.selectors.nukeButton).on('click', nuke)
}

// check for quote tweet
function isQuoteTweet(post) {
	// quoted tweets have two classes
	if ($(post).attr('class').split(/\s+/).length > 1) {
		const quote = $(post).parents().eq(6).find('span:contains("Quote")')
		return quote.length > 0
	}
	return false
}

// should add nuke button
function shouldAddNukeButton(post) {
	// check if post is null
	if (post != null) {
		// do not add nuke button to self's own posts
		let profile = ''
		// check for quote tweet
		if (isQuoteTweet(post)) {
			profile = $(post).parents().eq(1).find('span:contains("@")').first().text().split('@')[1]
		} else {
			profile = $(post).parents().eq(1).find('a').first().attr('href').split('/')[1]
		}
		// white list check
		const whiteListed = gWhiteList.find((username) => username.toString() === profile.toString())
		// check against global profile variable and whitelist
		if (gProfile != profile && !whiteListed) {
			return true
		}
	}
	// default return
	return false
}

// append nuke button html to post
export function appendNukeButtonHtml(post) {
	// check if buke button should be added
	if (shouldAddNukeButton(post)) {
		// apend html
		$(post).parents().first().parents().first().append(getNukeButtonHtml())
		// arm nuke
		$(post).parents().eq(1).find(config.selectors.nukeButton).on('click', nuke)
	}
}

// insert nuke button html
export function addNukeButton() {
    // todo: breaks opening post in new tab, link at the end, probably react is looking for last link
    $(config.selectors.avatar).each((index, post) => { appendNukeButtonHtml(post) })
}

// nuke confirmation
export async function nukeConfirmation(post) {
    // init return
    let ret = false
    // store post html
    const postHtml = $(post).html()
    // set confirmation html
    $(post).html(getNukeConfirmationHtml())
    // add even listeners to buttons
    const promise = new Promise((resolve) => {
        // yes button
        $(post).find('button[name="yes"]').on('click', function (event) {
            resolve(true)
        })
        // no button
        $(post).find('button[name="no"]').on('click', function (event) {
            resolve(false)
        })
    })
    // await confirmation response
    await promise.then((result) => {
        // store return value
        ret = result
        // reset post html
        $(post).html(postHtml)
    })
    // return result
    return ret
}

// nuke
export async function nuke(event) {
	// get upper context
	const post = $(this).parents().eq(6)
	// get post href
	const href = getPostHref(post)
	// confirm nuke-ing
	if (await nukeConfirmation(post)) {
		// log
		log('NUKE-ing!: ...' + href)
		// append processing html
		$(post).html(getProcessingHtml(href))
		// add css to elements
		$(post).find('#processing').css(getProcessingCss())
		// start nuking!
		await killEmAll(href)
		// remove react object
		removeReactObjects(href)
		// todo: error reporting, syncing with view
		// hide post from timeline
		hidePost(post)
	} else {
		rebindNukeCommand(post)
	}
}