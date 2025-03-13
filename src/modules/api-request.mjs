/**
 * nuke-button
 *
 * api-request.mjs
 */

import { config } from './config.mjs'
import { log } from './log.mjs'
import { openHrefInNewTab } from './browser.mjs'
import { extractUserResponseData, extractTweetResponseData } from './api-data.mjs'
import { filterDedupWhiteList } from './whitelist.mjs'

// get cookie
function getCookie(cname) {
	const name = cname + '='
	const ca = document.cookie.split(';')
	for (let i = 0; i < ca.length; ++i) {
		const c = ca[i].trim()
		if (c.indexOf(name) === 0) {
			return c.substring(name.length, c.length)
		}
	}
	return ''
}

// api request headers
function createRequestHeaders() {
	const headers = {
		Authorization: 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
		'X-Twitter-Auth-Type': 'OAuth2Session',
		'X-Twitter-Active-User': 'yes',
		'X-Csrf-Token': getCookie('ct0')
	}
	return headers
}

// Universal API request function for making requests
async function apiRequest(url, method = 'GET', body = null) {
	const options = {
		headers: createRequestHeaders(),
		method,
		credentials: 'include'
	}
	if (body) {
		options.body = body
		options.headers['Content-Type'] = 'application/x-www-form-urlencoded'
	}
	try {
		const response = await fetch(url, options)
		// check for errors
		if (response.ok) {
			// return data
			const data = await response.json()
			return data
		} else {
			// throw response error
			const errors = await response.json()
			throw errors
		}
	} catch (error) {
		// add url to error
		error.url = url
		//throw error
		throw error
	}
}

// build api url
function buildUrl(endpoint, variables) {
	// start with endpoint
	const url = `${endpoint}` +
		`?variables=${encodeURIComponent(JSON.stringify(Object.assign(variables, config.fieldToggles)))}` +
		`&features=${encodeURIComponent(JSON.stringify(config.features))}`
	return url
}

// Fetches the list of users a given user is following
async function fetchUserFollowing(userId) {
	const variables = {
		userId
	}
	const url = buildUrl(config.apiEndpoints.following, variables)
	try {
		const data = await apiRequest(url)
		return data
	} catch (e) {
		throw e
	}
}

// fetch users followers
async function fetchUserFollowers(userId) {
	const variables = {
		userId
	}
	const url = buildUrl(config.apiEndpoints.followers, variables)
	try {
		const data = await apiRequest(url)
		return data
	} catch (e) {
		throw e
	}
}

// fetch verified followers
async function fetchVerifiedFollowers(userId) {
	const variables = {
		userId: userId
	}
	const url = buildUrl(config.apiEndpoints.verifiedFollowers, variables)
	try {
		const data = await apiRequest(url)
		return data
	} catch (e) {
		throw e
	}
}

// Fetches responses for a tweet, with optional pagination cursor
async function fetchTweetResponses(tweetId, cursor = null) {
	const variables = {
		focalTweetId: tweetId,
		cursor
	}
	const url = buildUrl(config.apiEndpoints.tweetDetail, variables)
	try {
		const data = await apiRequest(url)
		return data
	} catch (e) {
		throw e
	}
}

// fetch retweeters
async function fetchTweetRetweeters(tweetId, cursor = null) {
	const variables = {
		tweetId: tweetId
	}
	const url = buildUrl(config.apiEndpoints.retweeters, variables)
	try {
		const data = await apiRequest(url)
		return data
	} catch (e) {
		throw e
	}
}

// blocks a user with the given user ID
async function blockUser(userId) {
	try {
		const data = await apiRequest(config.apiEndpoints.blockUser, 'POST', `user_id=${userId}`)
		return data
	} catch (error) {
		throw error
	}
}

// fetch user id from username
export async function fetchUserId(username) {
	const variables = { screen_name: username }
	const url = buildUrl(config.apiEndpoints.userid, variables)
	try {
		const data = await apiRequest(url)
		return data
	} catch (e) {
		throw e
	}
}

// get block list
export async function getBlockList(userId, username, tweetId) {
	try {
		// get data
		const followingData = await fetchUserFollowing(userId)
		const following = extractUserResponseData(followingData?.data?.user?.result?.timeline?.timeline?.instructions)
		const followersData = await fetchUserFollowers(userId)
		const followers = extractUserResponseData(followersData?.data?.user?.result?.timeline?.timeline?.instructions)
		const verifiedFollowersData = await fetchVerifiedFollowers(userId)
		const verifiedFollowers = extractUserResponseData(verifiedFollowersData?.data?.user?.result?.timeline?.timeline?.instructions)
		const responsesData = await fetchTweetResponses(tweetId)
		const responses = extractTweetResponseData(responsesData?.data?.threaded_conversation_with_injections_v2?.instructions)
		const retweetersData = await fetchTweetRetweeters(tweetId)
		const retweeters = extractUserResponseData(retweetersData?.data?.retweeters_timeline?.timeline?.instructions)
		// add target user to front of array
		const target = [{ username: username, isBlocking: false, userId: userId }]
		// combine data
		const blockList = [].concat(target, following, followers, verifiedFollowers, responses, retweeters)
		// filter blocklist based on username and userid
		const filteredBlockList = blockList.filter(filterDedupWhiteList)
		// return block list
		return filteredBlockList
	} catch (e) {
		throw e
	}
}

// block a block list
export async function blockBlockList(blockList, href) {
	// init return
	let blockedTally = 0
	let openedHref = false
	// iterate block list
	for (const item of blockList) {
		// check if user is blocked already
		if (!item.isBlocked) {
			try {
				// block user
				const ret = await blockUser(item.userId)
				// increment blocked tally
				blockedTally += 1;
			} catch (error) {
				// log error
				log(`${error.name}, ${error.message}, ${error.cause}`, true)
				// something's going wrong, open post in new tab to finish nuke-ing later
				// probably got logged out (401), or api timeout (429)
				if (!openedHref && config.behavior.newTabOnError) {
					openHrefInNewTab(href)
					openedHref = true
				}
			}
		}
	}
	// return success
	return blockedTally
}