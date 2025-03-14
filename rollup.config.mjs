/**
 * nuke-button
 *
 * rollup.config.mjs
 */

import fs from 'node:fs'

// userscript manifest file
const manifest = './manifest.mjs'
let banner = ''

try {
	banner = fs.readFileSync(manifest)
} catch(e) {
	console.error(e)
}

export default [{
	input: 'src/nuke-button.user.js',
	output: {
		dir: './dist',
		format: 'iife',
		banner: banner
	}
}]