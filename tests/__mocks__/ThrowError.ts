/**
 * Throws a simple error.
 */
export function TestThrow() {
	throw new Error('Foobar')
}

/**
 * Throws custom error
 */
export function TestThrowCustom(msg: string) {
	throw new Error(msg)
}
