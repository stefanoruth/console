import { CommandRegistry } from '../src/CommandRegistry'
import { Mock } from 'ts-mockery'
import { Input } from '../src/Input'
import { ListCommand, InspireCommand } from '../src/Commands'

class Registry extends CommandRegistry {
	testValidName(name: string) {
		return this.validateName(name)
	}

	initDefault() {
		this.init()

		return this
	}
}

function registry() {
	return new Registry({} as any)
}

describe('CommandRegistry', () => {
	test('Invalid command name', () => {
		expect(() => registry().testValidName('')).toThrow()
		expect(() => registry().testValidName('foo:')).toThrow()
	})

	test('Default commands a defined', () => {
		const r = registry()

		r.initDefault()

		expect(r.getCommands().length).toBe(3)
	})

	test('It can find the command based on input', () => {
		let i: Input

		const r = registry().initDefault()

		i = Mock.of<Input>({ getFirstArgument: () => 'foobar', hasParameterOption: () => false })
		expect(r.getCommandName(i)).toBe('foobar')

		i = Mock.of<Input>({ getFirstArgument: () => 'foobar', hasParameterOption: () => true })
		expect(r.getCommandName(i)).toBe('foobar')

		i = Mock.of<Input>({ getFirstArgument: () => undefined, hasParameterOption: () => false })
		expect(r.getCommandName(i)).toBe('list')
	})

	test('Finds a command if it is registered', () => {
		const r = registry().initDefault()

		expect(r.find('list')).toBeInstanceOf(ListCommand)
		expect(r.find('inspire')).toBeInstanceOf(InspireCommand)
		expect(() => r.find('nop')).toThrow()
	})
})
