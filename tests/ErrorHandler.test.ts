import { ErrorHandler } from '../src/Output/ErrorHandler'
import { Output, Terminal } from '../src/Output'
import { Writer } from '../src/Output/Writer'
import { throwMe } from './__mocks__/ThrowError'

function getHandler(cb: (message: string) => void) {
	const t = new Terminal()
	const w = new (class extends Writer {
		write(m: string | string[]) {
			if (!(m instanceof Array)) {
				m = [m]
			}

			cb(m.join('\n'))
		}
	})(t)
	const o = new Output(t)

	return new ErrorHandler(o)
}

describe('ErrorHandler', () => {
	test('It can render an exception', () => {
		// try {
		// 	throwMe()
		// } catch (error) {
		// 	getHandler(m => {
		// 		expect(m).toMatchSnapshot()
		// 	}).render(error)
		// }
	})
})
