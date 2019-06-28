/**
 * https://github.com/yuanyan/node-escapeshellarg
 */
export function escapeshellarg(arg: string) {
	return String(arg).replace(/[^\\]'/g, (m, i, s) => {
		return m.slice(0, 1) + "\\'"
	})
}

/**
 * For consideration of terminal "color" programs like colors.js,
 * which can add ANSI escape color codes to strings,
 * we destyle the ANSI color escape codes for padding calculations.
 *
 * see: http://en.wikipedia.org/wiki/ANSI_escape_code
 * https://github.com/Automattic/cli-table/blob/master/lib/utils.js#L80
 */
export function strlen(str: string): number {
	const code = /\u001b\[(?:\d*;){0,5}\d*m/g
	const stripped = ('' + (str != null ? str : '')).replace(code, '')
	const split = stripped.split('\n')
	return split.reduce((memo, s) => {
		const len = s.length
		return len > memo ? len : memo
	}, 0)
}

/**
 * Split string to fetch the top level namespace.
 */
export function extractNamespace(commandName: string): string {
	const parts = commandName.split(':')

	if (parts.length < 2) {
		return ''
	}

	parts.pop()

	return parts.join(':')
}

/**
 * Format time based on seconds.
 */
export function formatTime(time: number) {
	// Date.getTime() in miliseconds
	time = time / 1000

	const timeFormats = [
		[0, '< 1 sec'],
		[1, '1 sec'],
		[2, 'secs', 1],
		[60, '1 min'],
		[120, 'mins', 60],
		[3600, '1 hr'],
		[7200, 'hrs', 3600],
		[86400, '1 day'],
		[172800, 'days', 86400],
	]

	// tslint:disable-next-line:prefer-for-of
	for (let i = 0; i < timeFormats.length; i++) {
		const format = timeFormats[i]

		if (time >= format[0]) {
			if ((timeFormats[i + 1] && time < timeFormats[i + 1][0]) || i === timeFormats.length - 1) {
				if (format.length === 2) {
					return format[1] as string
				}

				return Math.floor(time / (format as any)[2]) + ' ' + format[1]
			}
		}
	}

	throw new Error(`Out of scope timeformat: ${time}`)
}

/**
 * Format the usage of memory.
 */
export function formatMemory(memory: number) {
	if (memory >= 1024 * 1024 * 1024) {
		return `${(memory / 1024 / 1024 / 1024).toFixed(1)} GiB`
	}
	if (memory >= 1024 * 1024) {
		return `${(memory / 1024 / 1024).toFixed(1)} MiB`
	}
	if (memory >= 1024) {
		return `${(memory / 1024).toFixed(0)} KiB`
	}
	return `${memory.toFixed(0)} B`
}
