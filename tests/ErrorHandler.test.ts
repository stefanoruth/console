import { FilePreview, Output, Writer, TextStyle, NullColor, StackTrace, ErrorHandler } from '../src/Output'
import { TerminalMock } from './__mocks__'
import { TestThrow } from './__mocks__/ThrowError'

describe('ErrorHandler', () => {
	const output = new Output(TerminalMock, new Writer(TerminalMock), new TextStyle(new NullColor()))

	test('Preview file content', () => {
		const fp = new FilePreview(output)

		expect(
			fp
				.render({
					path: __dirname + '/__mocks__/ApplicationMock.ts',
					line: 14,
				})
				.join('\n')
		).toMatchSnapshot()
	})

	test('Format error stack trace', () => {
		const e = new Error('Foobar Error Stack')
		const s = new StackTrace(file => {
			return file.replace(__dirname, '/project/')
		})

		expect(e.stack).toMatchSnapshot()
		expect(s.render(e)).toMatchSnapshot()
	})

	test('Render error', () => {
		const e = new Error('Foobar')
		const h = new ErrorHandler(output, false)

		expect(h.report(e)).toMatchSnapshot()
	})

	test('Render error from remote file', () => {
		const h = new ErrorHandler(output, false)

		try {
			TestThrow()
		} catch (error) {
			expect(h.report(error)).toMatchSnapshot()
		}
	})
})
