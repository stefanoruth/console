import { FilePreview, Output, Writer, TextStyle, NullColor, StackTrace, ErrorHandler } from '../src/Output'
import { TerminalMock } from './__mocks__'

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
		const h = new ErrorHandler(output)

		expect(h.report(e)).toMatchSnapshot()
	})
})
