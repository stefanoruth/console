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
