#!/usr/bin/env node
/**
 * nuke-button
 *
 * _build.js
 */
import fs from 'node:fs'
import { exit } from 'node:process'
import minimist from 'minimist'

// config object
const config = {
	dirs: {
		dist: './dist'
	}
}

// clean
function clean() {
	try {
		if (fs.existsSync(config.dirs.dist)) {
			// wipe dist dirs
			fs.rmdirSync(config.dirs.dist, { recursive: true, force: true })
		}
	} catch (e) {
		console.error(e)
		exit(1)
	} finally {
		// exit process success
		exit(0)
	}
}

// parse args
function parseArgs() {
	// get args
	const args = minimist(process.argv.slice(2))

	// check for clean
	if (args.c) {
		clean()
	}

	// exit error
	exit(1)
}

// main
function _build() {
	// parse args
	parseArgs()
}

// run
_build()