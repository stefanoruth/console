// https://github.com/yuanyan/node-escapeshellarg
export function escapeshellarg(arg: string) {
	return String(arg).replace(/[^\\]'/g, (m, i, s) => {
		return m.slice(0, 1) + "\\'"
	})
}
