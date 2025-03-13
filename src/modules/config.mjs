/**
 * nuke-button
 *
 * config.mjs
 */

// config object
export const config = {
	projectName: 'nuke-button',
	debug: true,
	mobile: (window.location.href.startsWith('https://mobile')) ? true : false,
	behavior: {
		newTabOnError: true
	},
	selectors: {
		nukeButton: 'a[class="nuke-button"]',
		posts: 'div[data-testid="User-Name"]',
		hometl: 'div[aria-label="Timeline: Your Home Timeline"]',
		tl: 'div[aria-label*="Timeline:"]',
		statustl: 'div[aria-label="Timeline: Conversation"]',
		searchtl: 'div[aria-label="Timeline: Search timeline"]',
		status: 'article[data-testid="tweet"]',
		postHref: 'a[href*="status"]',
		avatar: 'div[data-testid="Tweet-User-Avatar"]',
		nav: 'div [role="navigation"]',
		profile: 'a[aria-label="Profile"]',
		kbd: 'a[href="/i/keyboard_shortcuts"]',
		communities: 'a[aria-label="Communities"]'
	},
	static: {
		icon: '💣',
		checkMark: '✔️',
		redCross: '❌'
	},
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
		blockUser: 'https://x.com/i/api/1.1/blocks/create.json'
	}
}