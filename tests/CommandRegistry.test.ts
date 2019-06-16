import { CommandRegistry } from '../src/CommandRegistry'

class Registry extends CommandRegistry {
	testValidName(name: string) {
		return this.validateName(name)
	}
}

let registry: Registry

beforeEach(() => {
	registry = new Registry({} as any)
})

describe('CommandRegistry', () => {
	//
	test('Invalid command name', () => {
		expect(() => registry.testValidName('')).toThrow()
		expect(() => registry.testValidName('foo:')).toThrow()
	})
})
