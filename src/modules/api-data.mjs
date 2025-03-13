/**
 * nuke-button
 *
 * api-data.mjs
 */

// extract item content from tweet responses
function extractTweetResponseItemContent(entry) {
	if (entry.content.entryType === 'TimelineTimelineItem')
		return [entry.content.itemContent]
	if (entry.content.entryType === 'TimelineTimelineModule')
		return entry.content.items.map((item) => item.item.itemContent)
	return []
}

// check if item content is a tweet entry
function isTweetEntry(itemContent) {
	return (
		itemContent.itemType === 'TimelineTweet' &&
		itemContent.tweet_results.result.__typename !== 'TweetWithVisibilityResults' &&
		itemContent.tweet_results.result.__typename !== 'TweetTombstone'
	)
}

// extract user id from data
export function extractUserId(data) {
	return data?.data?.user?.result?.rest_id
}

// extract user response data from instructions
export function extractUserResponseData(instructions) {
	const data = instructions
		.flatMap((instr) => instr.entries || [])
		.filter(
			(entry) =>
				entry.content.entryType === "TimelineTimelineItem" &&
				entry.content.itemContent.user_results.result &&
				entry.content.itemContent.user_results.result.__typename !== "UserUnavailable"
		)
		.map((entry) => ({
			username: entry.content.itemContent.user_results.result.legacy?.screen_name,
			isBlocked: entry.content.itemContent.user_results.result.legacy.blocking ??
				entry.content.itemContent.user_results.result.smart_blocking ??
				false,
			userId: entry.content.itemContent.user_results.result?.rest_id
		})) || []
	return data
}

// extract user response data from instructions
export function extractTweetResponseData(instructions) {
	const entries = instructions.flatMap((instr) => instr.entries || [])
	// collect targets
	let responseTargets = []
	// iterate instructions
	for (const entry of entries) {
		// get item contents
		const itemContents = extractTweetResponseItemContent(entry)
		// iterate item contents
		for (const itemContent of itemContents) {
			if (isTweetEntry(itemContent)) {
				const userId = itemContent.tweet_results.result.legacy.user_id_str
				const username = itemContent.tweet_results.result.core.user_results.result.legacy.screen_name
				const responseTarget = { username: username, isBlocked: false, userId: userId }
				responseTargets.push(responseTarget)
			}
		}
	}
	return responseTargets
}
