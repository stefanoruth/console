import { Input } from '../../src/Input'
import { Command } from '../../src/Commands'
import { Application } from '../../src/Application'
import { Mock } from 'ts-mockery'
import { Terminal, Output } from '../../src/Output'

export function appMock(input: string[], c?: Command) {
	const a = new Application('TestApp')
	const i = new Input(input)
	const t = Mock.all<Terminal>()
	const o = new Output(t)

	if (c) {
		a.register([c])
	}

	return {
		command: c,
		app: a,
		input: i,
		run: () => a.run(i, o),
	}
}
