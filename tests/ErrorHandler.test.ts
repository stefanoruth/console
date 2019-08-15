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

	describe('Catching exceptions', () => {
		const handler = new ErrorHandler(output, false)

		test('Render error', () => {
			const report = handler.report(new Error('Foobar'))
			// console.log(report)

			expect(report).toContain('Foobar')
			expect(report).toContain('Error  :  Foobar')
			expect(report).toContain(`const report = handler.report(new Error('Foobar'))`)
			expect(report).toContain('Exception trace:')
		})
	})
})
