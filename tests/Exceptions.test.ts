import {
	CommandNotFoundException,
	InvalidArgumentException,
	InvalidOptionException,
	LogicException,
} from '../src/Exceptions'

describe('Exceptions', () => {
	test('CommandNotFoundException', () => {
		expect(new CommandNotFoundException()).toBeInstanceOf(Error)
	})

	test('InvalidArgumentException', () => {
		expect(new InvalidArgumentException()).toBeInstanceOf(Error)
	})

	test('InvalidOptionException', () => {
		expect(new InvalidOptionException()).toBeInstanceOf(Error)
	})

	test('LogicException', () => {
		expect(new LogicException()).toBeInstanceOf(Error)
	})
})
