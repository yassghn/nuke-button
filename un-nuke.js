/**
 * nuke-button
 *
 * un-nuke.js
 *
 * this is not a userscript.
 * this code is meant to be dropped into the dev console.
 *
 * due to the nature of the twitter api,
 * and the lack of a cursor implementation in this code,
 * results may vary.
 */

(function () {
    'use strict'

    // config object
    const config = {
        debug: true,
        features: {
            rweb_tipjar_consumption_enabled: true,
            responsive_web_graphql_exclude_directive_enabled: true,
            verified_phone_label_enabled: false,
            creator_subscriptions_tweet_preview_api_enabled: true,
            responsive_web_graphql_timeline_navigation_enabled: true,
            responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
            communities_web_enable_tweet_community_results_fetch: true,
            c9s_tweet_anatomy_moderator_badge_enabled: true,
            articles_preview_enabled: true,
            responsive_web_edit_tweet_api_enabled: true,
            graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
            view_counts_everywhere_api_enabled: true,
            longform_notetweets_consumption_enabled: true,
            responsive_web_twitter_article_tweet_consumption_enabled: true,
            tweet_awards_web_tipping_enabled: false,
            creator_subscriptions_quote_tweet_preview_enabled: false,
            freedom_of_speech_not_reach_fetch_enabled: true,
            standardized_nudges_misinfo: true,
            tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
            rweb_video_timestamps_enabled: true,
            longform_notetweets_rich_text_read_enabled: true,
            longform_notetweets_inline_media_enabled: true,
            responsive_web_enhance_cards_enabled: false,
            blue_business_profile_image_shape_enabled: false,
            tweetypie_unmention_optimization_enabled: true,
            responsive_web_text_conversations_enabled: true,
            vibe_api_enabled: true,
            responsive_web_twitter_blue_verified_badge_is_enabled: false,
            interactive_text_enabled: true,
            longform_notetweets_richtext_consumption_enabled: true,
            premium_content_api_read_enabled: true,
            profile_label_improvements_pcf_label_in_post_enabled: true,
            responsive_web_grok_analyze_post_followups_enabled: false,
            responsive_web_grok_analyze_button_fetch_trends_enabled: false,
            responsive_web_grok_share_attachment_enabled: false
        },
        fieldToggles: {
            count: 1000,
            rankingMode: "Relevance",
            includeBlocking: true,
            withSafetyModeUserFields: true,
            includePromotedContent: true,
            withQuickPromoteEligibilityTweetFields: true,
            withVoice: true,
            withV2Timeline: true,
            withDownvotePerspective: false,
            withBirdwatchNotes: true,
            withCommunity: true,
            withSuperFollowsUserFields: true,
            withReactionsMetadata: false,
            withReactionsPerspective: false,
            withSuperFollowsTweetFields: true,
            isMetatagsQuery: false,
            withReplays: true,
            withClientEventToken: false,
            withAttachments: true,
            withConversationQueryHighlights: true,
            withMessageQueryHighlights: true,
            withMessages: true,
            with_rux_injections: false
        },
        apiEndpoints: {
            tweetDetail: 'https://x.com/i/api/graphql/nBS-WpgA6ZG0CyNHD517JQ/TweetDetail',
            following: 'https://x.com/i/api/graphql/eWTmcJY3EMh-dxIR7CYTKw/Following',
            followers: 'https://x.com/i/api/graphql/pd8Tt1qUz1YWrICegqZ8cw/Followers',
            retweeters: 'https://x.com/i/api/graphql/0BoJlKAxoNPQUHRftlwZ2w/Retweeters',
            verifiedFollowers: 'https://x.com/i/api/graphql/srYtCtUs5BuBPbYj7agW6A/BlueVerifiedFollowers',
            userid: 'https://x.com/i/api/graphql/sLVLhk0bGj3MVFEKTdax1w/UserByScreenName',
            unblockUser: 'https://x.com/i/api/1.1/blocks/destroy.json'
        }
    }

    // log
    function log(msg, err = false) {
        if (config.debug) {
            if (err) {
                console.error(msg)
            } else {
                console.log(msg)
            }
        }
    }

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
            const data = await response.json()
            return data
        } catch (error) {
            console.error(`Error in API request to ${url}: `, error)
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
        const data = await apiRequest(url)
        return data
    }

    // fetch users followers
    async function fetchUserFollowers(userId) {
        const variables = {
            userId
        }
        const url = buildUrl(config.apiEndpoints.followers, variables)
        const data = await apiRequest(url)
        return data
    }

    // fetch verified followers
    async function fetchVerifiedFollowers(userId) {
        const variables = {
            userId: userId
        }
        const url = buildUrl(config.apiEndpoints.verifiedFollowers, variables)
        const data = await apiRequest(url)
        return data
    }

    // Fetches responses for a tweet, with optional pagination cursor
    async function fetchTweetResponses(tweetId, cursor = null) {
        const variables = {
            focalTweetId: tweetId,
            cursor
        }
        const url = buildUrl(config.apiEndpoints.tweetDetail, variables)
        const data = await apiRequest(url)
        return data
    }

    // fetch retweeters
    async function fetchTweetRetweeters(tweetId, cursor = null) {
        const variables = {
            tweetId: tweetId
        }
        const url = buildUrl(config.apiEndpoints.retweeters, variables)
        const data = await apiRequest(url)
        return data
    }

    // fetch user id from username
    async function fetchUserId(username) {
        const variables = { screen_name: username }
        const url = buildUrl(config.apiEndpoints.userid, variables)
        const data = await apiRequest(url)
        return data
    }

    // blocks a user with the given user ID
    async function unblockUser(userId) {
        try {
            const data = await apiRequest(config.apiEndpoints.unblockUser, 'POST', `user_id=${userId}`)
            return data
        } catch (error) {
            throw error
        }
    }

    // extract user id from data
    function extractUserId(data) {
        return data?.data?.user?.result?.rest_id
    }

    // extract user response data from instructions
    function extractUserResponseData(instructions) {
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

    // extract user response data from instructions
    function extractTweetResponseData(instructions) {
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

    // get block list
    async function getunBlockList(userId, tweetId) {
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

        // combine data
        const blockList = [].concat(following, followers, verifiedFollowers, responses, retweeters)
        // filter blocklist based on username and userid
        // todo: not sure how to filter yet
        const filteredBlockList = blockList.filter(
            (item, index, arr) =>
                arr.findIndex(
                    (item2) => ['username', 'userId'].every((key) => item2[key] === item[key])) === index)
        // return block list
        return blockList
    }

    // block a block list
    async function unblockunBlockList(blockList, href) {
        // init return
        let blockedTally = 0
        let openedHref = false
        // iterate block list
        for (const item of blockList) {
            // unblock regardless (todo: not sure what "smart blocking" is ???)
            // not every request returns entry.content.itemContent.user_results.result.legacy.blocking
            if (true) {
                try {
                    // block user
                    const ret = await unblockUser(item.userId)
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

    // abort, abort!
    async function abortAbort() {
        // get href
        const href = window.location.href;

        // get username from href
        const targetUsername = href.split('/')[3]
        const tweetId = href.split('/')[5]
        // get user data
        const userData = await fetchUserId(targetUsername)
        // check for error
        if (userData.message) {
            // return error on error
            return userData
        }
        // extract user id
        const targetUserId = extractUserId(userData)
        const unblockList = await getunBlockList(targetUserId, tweetId)
        const result = await unblockunBlockList(unblockList, href)
        log(`processing finished for ${href}: unblocked ${result} accounts`)
        // check for errors TODO
        // return href on success
        return href
    }

    // abort nuke launch!
    abortAbort()

})();