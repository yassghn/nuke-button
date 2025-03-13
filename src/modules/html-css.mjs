/**
 * nuke-button
 *
 * html-css.mjs
 */

import { config } from './config.mjs'
import { getElement } from './polling.mjs'

// add processing html/css
function addProcessingElement(post, href, style) {
    // create processing html
    const processingHtml = $(getProcessingHtml(href))
    // make timeline item div wrappers
    const divWrapper = $('<div/>')
    const outterDivWrapper = $('<div/>')
    const separatorDiv = $('<div/>')
    const divWrapperClasses = $(post).children().eq(0).attr('class')
    const outterDivWrapperClasses = $(post).attr('class')
    const separatorClasses = $(post).find('div[role="separator"]').attr('class')
    const transformCss = $(post).css('transform')
    log(transformCss)
    $(divWrapper).attr('class', divWrapperClasses)
    $(outterDivWrapper).attr('class', outterDivWrapperClasses)
    $(outterDivWrapper).attr('style', `transform: ${transformCss}; position: relative; width: 100%;`)
    $(outterDivWrapper).attr('data-testid', 'cellInnerDiv')
    $(separatorDiv).attr('class', separatorClasses)
    $(separatorDiv).attr('role', 'separator')
    // wrap divs
    $(processingHtml).attr('class', outterDivWrapperClasses)
    $(processingHtml).find('div').attr('class', outterDivWrapperClasses)
    // add css to elements
    $(processingHtml).css(getProcessingCss())
    $(processingHtml).wrap($(outterDivWrapper)).wrap($(divWrapper))
    const finalDiv = $(processingHtml).parents().eq(1)
    $(finalDiv).append($(separatorDiv))
    log($(separatorDiv))
    log(finalDiv)
    // add to dom
    $(finalDiv).insertBefore($(post))
    // return outter most div wrapper
    return finalDiv
}

// append style element to head
function appendStyle() {
    let $style = document.createElement('style')
    $style.dataset.insertedBy = config.projectName
    $style.dataset.role = 'features'
    document.head.appendChild($style)
    return $style
}

// get twitter theme colors
function getThemeColors() {
    // get body style
    const style = window.getComputedStyle($('body')[0])
    // try to get theme color from two different elements
    const themeColor1 = style.getPropertyValue('--theme-color')
    const themeColor2 = $(config.selectors.kbd).css('color')

    return {
        color: (themeColor1 != '') ? themeColor1 : themeColor2,
        bg: style.getPropertyValue('background-color')
    }
}

// nuke button css
function getNukeButtonCss() {
    const theme = getThemeColors()
    const css =
        `a.nuke-button {
                z-index: 1;
                position: absolute;
                width: 30px;
                height: 30px;
                top: 45px;
                text-decoration: none;
                text-align: center;
                user-select: none;
                -moz-user-select: none;
                -khtml-user-select: none;
                -webkit-user-select: none;
                -o-user-select: none;
            }
            a.nuke-button:hover {
                border-radius: 5px;
                background-color: ${theme.color};
            }
            #nuke-button {
                width: 100%;
                height: 100%;
                line-height: 30px;
            }
            #nuke-button-text {
                margin: 0 auto;
            }
            #processing-text {
                -moz-user-select: none;
                -khtml-user-select: none;
                -webkit-user-select: none;
                -o-user-select: none;
            }
            #processing-text span {
                display: inline-block;
                text-transform: uppercase;
                animation: flip 2s infinite;
                animation-delay: calc(.11s * var(--i));
            }
            #nuke-confirmation {
                height: 100px;
                width: 100%;
                text-align: center;
                justify-content: center;
                align-items: center;
                text-transform: uppercase;
                padding-top: 30px;
                border: 2px ${theme.color} solid;
                border-radius: 2px;
                box-shadow: inset 0 0 2px ${theme.bg},
                              inset 0 0 7px ${theme.bg},
                              inset 0 0 14px ${theme.color},
                              inset 0 0 21px ${theme.color},
                              inset 0 0 28px ${theme.color},
                              inset 0 0 35px ${theme.color};
                animation: glow 0.9s infinite alternate;
            }
            #nuke-confirmation-title {
                -moz-user-select: none;
                -khtml-user-select: none;
                -webkit-user-select: none;
                -o-user-select: none;
            }
            #nuke-confirmation-title span {
                display: inline-block;
                animation: flip 2s infinite;
                animation-delay: calc(.5s * var(--i));
            }
            .nuke-confirmation-button {
                display: inline-block;
                padding-left: 30px;
                padding-right: 30px;
            }
            .nuke-confirmation-button button {
                height: 50px;
                width: 80px;
                cursor: pointer;
                text-transform: uppercase;
            }
            @keyframes glow {
                100% {
                    box-shadow:
                           inset 0 0 3px ${theme.bg},
                           inset 0 0 10px ${theme.bg},
                           inset 0 0 20px ${theme.color},
                           inset 0 0 40px ${theme.color},
                           inset 0 0 70px ${theme.color},
                           inset 0 0 89px ${theme.color};
                }
            }
            @keyframes flip {
                0%,80% {
                    transform: rotateY(360deg);
                }
            }`
    return css
}

// nuke button html
export function getNukeButtonHtml() {
    const nukeButtonHtml =
        `<a class="nuke-button" data-testid="block">
                <div id="nuke-button">
                    <div id="nuke-button-text">
                        <span id="nuke-emoji">${config.static.icon}</span>
                    </div>
                </div>
            </a>`
    return nukeButtonHtml
}

// nuke confirmation html
export function getNukeConfirmationHtml() {
    const nukeConfirmationHtml =
        `<div id="nuke-confirmation">
                <div id="nuke-confirmation-title">
                    <span style="--i:1;">are</span>
                    <span style="--i:2;">you</span>
                    <span style="--i:3;">sure</span>
                    <span style="--i:4;">you</span>
                    <span style="--i:5;">want</span>
                    <span style="--i:6;">to</span>
                    <span style="--i:7;">nuke</span>
                    <span style="--i:8;">this</span>
                    <span style="--i:9;">thread?</span>
                </div>
                <br/>
                <div class="nuke-confirmation-button">
                    <button name="yes" type="button" value="true">
                        <span>${config.static.checkMark}</span>
                        <span>yes</span>
                    </button>
                </div>
                <div class="nuke-confirmation-button">
                    <button name="no" type="button" value="false">
                        <span>${config.static.redCross}</span>
                        <span>no</span>
                    </button>
                </div>
            </div>`
    return nukeConfirmationHtml
}

// get post href
export function getPostHref(post) {
    // get target links attached to post
    const links = $(post).find(config.selectors.postHref);
    // iterate links
    for (let i = 0; i < links.length; i++) {
        // get href
        const href = $(links[i]).attr('href')
        // toss out incorrect links
        if (href.includes('analytics') || href.includes('photo') || href.includes('history') || href.includes('retweets')) {
            const arr = href.split('/')
            const ret = `/${arr[1]}/${arr[2]}/${arr[3]}`
            return ret
        } else if (i == links.length - 1) {
            // return last link if none found
            return href
        }
    }
}

// processing css
export function getProcessingCss() {
    const theme = getThemeColors()
    const css = {
        'height': `100px`,
        'text-align': 'center',
        'justify-content': 'center',
        'align-items': 'center',
        'padding-top': '30px',
        'border': `2px ${theme.color} solid`,
        'border-radius': '2px',
        'box-shadow': `inset 0 0 2px ${theme.bg},
                           inset 0 0 7px ${theme.bg},
                           inset 0 0 14px ${theme.color},
                           inset 0 0 21px ${theme.color},
                           inset 0 0 28px ${theme.color},
                           inset 0 0 35px ${theme.color}`,
        'animation': 'glow 0.7s infinite alternate'
    }
    return css
}

// insert css
export function insertCss() {
    let $style
    $style ??= appendStyle()
    $style.textContent = getNukeButtonCss()
}

// edit status view css
export async function editStatusViewCss() {
    // create css
    const css = {
        'z-index': -1,
        'top': '17px'
    }
    // wait for element to load in
    await getElement(config.selectors.status)
    // add new style
    $(config.selectors.status).find('div').eq(1).children().eq(2).css(css)
}

// html to display while processing is happening
export function getProcessingHtml(href) {
    // remove leading slash from href
    const info = href.substring(1, href.length)
    // make processing text html
    const processingTextHtml =
        `<div id="processing-text">
                <span style="--i:1;">n</span>
                <span style="--i:2;">u</span>
                <span style="--i:3;">k</span>
                <span style="--i:4;">e</span>
                <span style="--i:5;">-</span>
                <span style="--i:6;">i</span>
                <span style="--i:7;">n</span>
                <span style="--i:8;">g</span>
                <span style="--i:10;">.</span>
                <span style="--i:11;">.</span>
                <span style="--i:12;">.</span>
            </div>`
    // combine and return
    const processingHtml =
        `<div id="processing"><article role="article" tabindex="0" data-testid="tweet">` +
        `${processingTextHtml}<br/>` +
        `<span id="processing-info-text">${info}</span></article></div>`
    return processingHtml
}