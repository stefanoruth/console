import { Parser } from '../src/Parser'
import { Signature } from '../src/index'

let results: Signature

describe('Parser', () => {
	test('BasicParameterParsing', () => {
		results = new Parser().parse('command:name')
		expect(results.name).toBe('command:name')

		results = new Parser().parse('command:name {argument} {--option}')

		// console.log(results)

		expect(results.name).toBe('command:name')
		expect(results.arguments.argument.getName()).toBe('argument')
		expect(results.options.option.getName()).toBe('option')
		// expect(results.options.option.acceptValue()).toBeTruthy()
	})

	test('ShortcutNameParsing', () => {
		results = new Parser().parse('command:name {--o|option}')
		expect(results.options.option.getShortcut()).toBe('o')
		expect(results.options.option.getName()).toBe('option')
		// expect(results.options.option.acceptValue()).toBeTruthy()
	})

	test('DefaultValueParsing', () => {
		results = new Parser().parse('command:name {argument=defaultArgumentValue} {--option=defaultOptionValue}')
		// expect(results.arguments[0].isRequired()).toBeFalsy()
		// expect(results.arguments[0].getDefault()).toBe('defaultArgumentValue')
		// expect(results.options[0].acceptValue()).toBeTruthy()
		// expect(results.options[0].getDefault()).toBe('defaultOptionValue')
	})

	// test('ArgumentDefaultValue', () => {
	// 	results = new Parser().parse('command:name {argument= : The argument description.}')
	// 	expect(results.arguments.argument.getDefault()).toBeUndefined()

	// 	results = new Parser().parse('command:name {argument=default : The argument description.}')
	// 	expect(results.arguments[0].getDefault()).toBe('default')
	// })

	// test('OptionDefaultValue', () => {
	// 	results = new Parser().parse('command:name {--option= : The option description.}')
	// 	expect(results.options.option.getDefault()).toBeUndefined()

	// 	results = new Parser().parse('command:name {--option=default : The option description.}')
	// 	expect(results.options.option.getDefault()).toBe('default')
	// })
})
