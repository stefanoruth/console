import {
	CommandNotFoundException,
	InvalidArgumentException,
	InvalidOptionException,
	LogicException,
	NamespaceNotFoundException,
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

	test('NamespaceNotFoundException', () => {
		expect(new NamespaceNotFoundException()).toBeInstanceOf(Error)
	})
})
