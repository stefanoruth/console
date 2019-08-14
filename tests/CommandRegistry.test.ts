import { CommandRegistry } from '../src/Commands/CommandRegistry'
import { Mock } from 'ts-mockery'
import { Input } from '../src/Input'
import { ListCommand, InspireCommand, HelpCommand } from '../src/Commands'

class TestRegistry extends CommandRegistry {
	testValidName(name: string) {
		return this.validateName(name)
	}

	inputWantsHelp() {
		return this.wantHelps
	}

	getInternal(name: string) {
		return this.get(name)
	}
}

function registry() {
	return new TestRegistry({} as any)
}

describe('CommandRegistry', () => {
	test('Invalid command name', () => {
		expect(() => registry().testValidName('')).toThrow()
		expect(() => registry().testValidName('foo:')).toThrow()
	})

	test('Default commands a defined', () => {
		const r = registry()

		expect(r.getCommands().length).toBe(3)
	})

	test('It can find the command based on input', () => {
		let i: Input

		const r = registry()

		i = Mock.of<Input>({ getFirstArgument: () => 'foobar', hasParameterOption: () => false })
		expect(r.getCommandName(i)).toBe('foobar')

		i = Mock.of<Input>({ getFirstArgument: () => 'foobar', hasParameterOption: () => true })
		expect(r.getCommandName(i)).toBe('foobar')

		i = Mock.of<Input>({ getFirstArgument: () => undefined, hasParameterOption: () => false })
		expect(r.getCommandName(i)).toBe('list')
	})

	test('Finds a command if it is registered', () => {
		const r = registry()

		expect(r.find('list')).toBeInstanceOf(ListCommand)
		expect(r.find('inspire')).toBeInstanceOf(InspireCommand)
		expect(() => r.find('nop')).toThrow()
	})

	test('Can show help command', async () => {
		const i = new Input(['list', '-h'])
		const r = registry()

		expect(i.hasParameterOption(['-h'])).toBeTruthy()
		expect(r.getCommandName(i)).toBe('list')
		expect(r.inputWantsHelp()).toBeTruthy()
		// expect(r.find('list')).toBeInstanceOf(HelpCommand)
	})

	test('Registry get throw if a command is not registered', async () => {
		const r = registry()

		expect(() => r.getInternal('doesNotExist')).toThrow()
	})
})
