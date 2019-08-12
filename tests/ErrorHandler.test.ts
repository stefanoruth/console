import { ErrorHandler } from '../src/Output/ErrorHandler'
import { Output, Terminal } from '../src/Output'
import { Writer } from '../src/Output/Writer'
import { TestThrow, TestThrowCustom } from './__mocks__/ThrowError'
import { Mock } from 'ts-mockery'
import { Formatter } from '../src/Output/Style'
import { TestColor, NullColor } from './__mocks__/TestColor'

function getHandler(cb: (message: string) => void) {
	const t = Mock.all<Terminal>()
	const w = new (class extends Writer {
		write(m: string | string[]) {
			if (!(m instanceof Array)) {
				m = [m]
			}

			cb(m.join(''))
		}
	})(t)

	return new (class extends ErrorHandler {
		protected formatFile(file: string) {
			return file.replace(process.cwd(), '/project')
		}
	})(new Output(t, w, new Formatter(new NullColor())))
}

describe('ErrorHandler', () => {
	test('Render Basic Error', () => {
		try {
			TestThrow()
		} catch (error) {
			getHandler(m => {
				expect(m).toMatchSnapshot()
			}).render(error)
		}
	})
})
