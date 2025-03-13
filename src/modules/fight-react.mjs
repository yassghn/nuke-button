/**
 * nuke-button
 *
 * fight-react.mjs
 */


// delete react state
/* function deleteReactState() {
	if ($('div')[0].firstElementChild['wrappedJSObject']) {
		delete ($('div')[0].firstElementChild['wrappedJSObject'])
		return ''

	}
	if ($('div')[0].firstElementChild) {
		delete ($('div')[0].firstElementChild)

	}
	//const reactPropsKey = Object.keys(wrapped).find(key => key.startsWith('__reactProps'))
	//         //const state = wrapped[reactPropsKey].children?.props?.children?.props?.store?.getState()
	//         //delete(state)
} */

/**
 *
 * notes:
 * reactProps.children.props.history ???
 */
/* async function removePostsReactProps(post, href) {
	const wrapped = $('div')[0].firstElementChild['wrappedJSObject'] || $('div')[0].firstElementChild
	const reactPropsKey = Object.keys(wrapped).find(key => key.startsWith('__reactProps'))
	const reactFiberKey = Object.keys(wrapped).find(key => key.startsWith('__reactFiber'))
	const reactProps = wrapped[reactPropsKey]
	const reactFiber = wrapped[reactFiberKey]
	logObj(reactFiber)
	logObj(reactProps)
	 delete(reactFiber.memorizedProps)
	 delete(reactFiber.stateNode)
	 delete(reactProps.children.props.children.props)
	//delete(wrapped[key])
	//wrapped[key] = {}
	//removeReactObjects(href)
	const article = $(post).find('article')[0].firstElementChild['wrappedJSObject']
	const keys = Object.keys(article).filter(key => key.startsWith('__react'))
	//console.dir(article, { depth: null })
	logObj(keys)
	keys.forEach((key) => {
		//logObj(article[key])
		if (article[key]) {
			delete (article[key])
		}
	})
	//logObj(article)
} */

// get react state
export function getReactState() {
	const wrapped = $('div')[0].firstElementChild['wrappedJSObject'] || $('div')[0].firstElementChild
	const reactPropsKey = Object.keys(wrapped).find(key => key.startsWith('__reactProps'))
	const state = wrapped[reactPropsKey].children?.props?.children?.props?.store?.getState()
	return state
}

// remvoe post react object
export function removeReactObjects(href) {
	// todo: not sure how to approach hacking at the react obejcts
	//       need to stop them from repopulating the timeline with removed posts
	//       also causes page to crash needing to reload
	// get react state
	const reactState = getReactState()
	const statusId = href.split('/')[3]
	// get in-reply-to if it exists
	const inReply = reactState.entities.tweets.entities[statusId].in_reply_to_status_id_str
	// remove react objects
	if (reactState.entities.tweets.entities[statusId]) {
		//delete(reactState.entities.tweets.entities[statusId])
		reactState.entities.tweets.entities[statusId].conversation_id_str = "1234"
	}
	if (reactState.entities.tweets.fetchStatus[statusId]) {
		delete (reactState.entities.tweets.fetchStatus[statusId])
	}
	for (const key in reactState.urt) {
		if (reactState.urt[key].entries) {
			for (let i = 0; i < reactState.urt[key].entries.length; i++) {
				if (reactState.urt[key].entries[i]) {
					if (reactState.urt[key].entries[i].entryId.includes(statusId)) {
						//delete(reactState.urt[key].entries[i])
						reactState.urt[key].entries[i].entryId = 'noid-0000'
						reactState.urt[key].entries[i].sortIndex = "1234"
						reactState.urt[key].entries[i].type = 'nonexistingType'
					}
				}
			}
		}
	}
	for (const key in reactState.audio.conversationLookup) {
		if (reactState.audio.conversationLookup[key]) {
			for (let i = 0; i < reactState.audio.conversationLookup[key].length; i++) {
				delete (reactState.audio.conversationLookup[key][i])
			}
		}
	}
}

// hide post from timeline
export function hidePost(post) {
	// hide html from timeline
	$(post).html('')
	$(post).hide()
}