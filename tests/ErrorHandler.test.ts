import { FilePreview, Output, Writer, TextStyle, NullColor, StackTrace, ErrorHandler } from '../src/Output'
import { TerminalMock } from './__mocks__'
import { TestThrow } from './__mocks__/ThrowError'

const filePath = (file: string) => file.replace(process.cwd(), '/project')

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
		const s = new StackTrace(filePath)

		expect(s.render(e)).toMatchSnapshot()
	})

	describe('Catching exceptions', () => {
		const handler = new ErrorHandler(output, filePath, false)

		test('Render error', () => {
			const e = new Error('Foobar')
			expect(handler.report(e)).toMatchSnapshot()
		})

		test('Render error from remote file', () => {
			try {
				TestThrow()
			} catch (error) {
				expect(handler.report(error)).toMatchSnapshot()
			}
		})
	})
})
