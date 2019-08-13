import { Descriptor } from '../src/Output/Descriptor'
import { Argument } from '../src/Input/Argument'
import { Output, Terminal } from '../src/Output'
import { Color, TextStyle } from '../src/Output/Style'
import { Option, Signature, CommandSignature } from '../src/Input'
import { Mock } from 'ts-mockery'
import { Command } from '../src/Commands'
import { Application } from '../src/Application'

class TestDescriptor extends Descriptor {
	public buffer = ''
	public bufferList: string[] = []

	protected write(content: string) {
		this.buffer += content.replace(new RegExp(/\n/g), '#')

		content.split('\n').forEach(text => {
			this.bufferList.push(text)
		})
	}
}

class TestCommand extends Command {
	protected name = 'foobar'

	constructor(definition: CommandSignature = [], description: string = '', help: string = '') {
		super()
		this.application = new Application()
		this.signature = new Signature(definition)
		this.description = description
		this.help = help
	}

	async handle() {
		//
	}
}

const color = Mock.of<Color>({
	apply: (text: string) => {
		return text
	},
})

const output = new Output(new Terminal())
const formatter = new TextStyle(color)

function desc(descObject: any): string {
	return new TestDescriptor(output, formatter).describe(descObject).buffer
}

function desc2(descObject: any): string[] {
	return new TestDescriptor(output, formatter).describe(descObject).bufferList.filter(line => {
		return line.length
	})
}

describe('Descriptor', () => {
	test('Describe unknown type of object', () => {
		expect(() => desc({})).toThrow()
	})

	test('Describe an Argument', () => {
		expect(desc(new Argument('foo'))).toBe('  foo')
		expect(desc(new Argument('foo', 'required'))).toBe('  foo')
		expect(desc(new Argument('foo', 'optional'))).toBe('  foo')
		expect(desc(new Argument('foo', 'isArray'))).toBe('  foo')
		expect(desc(new Argument('foo', 'required', 'Foobar'))).toBe('  foo Foobar')
		expect(desc(new Argument('foo', 'optional', 'Foobar'))).toBe('  foo Foobar')
		expect(desc(new Argument('foo', 'isArray', 'Foobar'))).toBe('  foo Foobar')
		expect(desc(new Argument('foo', 'required', 'Foobar', 'baz'))).toBe('  foo Foobar [default: "baz"]')
		expect(desc(new Argument('foo', 'optional', 'Foobar', 'baz'))).toBe('  foo Foobar [default: "baz"]')
		expect(desc(new Argument('foo', 'isArray', 'Foobar', 'baz'))).toBe('  foo Foobar [default: "baz"]')
	})

	test('Describe an Option', () => {
		expect(desc(new Option('foo'))).toBe('      --foo')
		expect(desc(new Option('foo', 's'))).toBe('  -s, --foo')
		expect(desc(new Option('foo', 's', 'none'))).toBe('  -s, --foo')
		expect(desc(new Option('foo', 's', 'optional'))).toBe('  -s, --foo[=FOO]')
		expect(desc(new Option('foo', 's', 'required'))).toBe('  -s, --foo=FOO')
		// expect(desc(new Option('foo', 's', OptionMode.optional | OptionMode.isArray, undefined, 'baz'))).toBe('  -s, --foo')
	})

	test('Describe an Signature', () => {
		expect(desc(new Signature())).toBe('')
		expect(desc(new Signature([new Argument('foo')]))).toBe('Arguments:#  foo#')
		expect(desc(new Signature([new Option('bar')]))).toBe('Options:#      --bar')
		expect(desc(new Signature([new Argument('foo'), new Option('bar')]))).toBe('Arguments:#  foo##Options:#      --bar')
	})

	test('Describe an Command', () => {
		function result(
			usage: string = '',
			args: string[] = [],
			options: string[] = [],
			descs: string[] = [],
			help: string[] = []
		) {
			const texts: string[] = []
			if (descs.length > 0) {
				texts.push('Description:', ...descs)
			}

			texts.push('Usage:', ('  foobar ' + usage).trimRight())

			if (args.length > 0) {
				texts.push('Arguments:', ...args)
			}

			texts.push('Options:')

			if (options.length > 0) {
				texts.push(...options)
			}

			texts.push(
				'  -h, --help            Display this help message',
				'  -q, --quiet           Do not output any message',
				'  -V, --version         Display this application version',
				'  -n, --no-interaction  Do not ask any interactive question',
				'  -v|vv|vvv, --verbose  Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug'
			)

			if (help.length > 0) {
				texts.push('Help:', ...help)
			}

			return texts
		}

		expect(desc2(new TestCommand())).toEqual(result())
		expect(desc2(new TestCommand([], 'foobarDesc'))).toEqual(result('', [], [], ['  foobarDesc']))
		expect(desc2(new TestCommand([], '', 'foobarHelp'))).toEqual(result('', [], [], [], ['  foobarHelp']))
		expect(desc2(new TestCommand([new Argument('foo')]))).toEqual(result('[\\<foo>]', ['  foo']))
		expect(desc2(new TestCommand([new Option('foo')]))).toEqual(result('[options]', [], ['      --foo']))
		expect(desc2(new TestCommand([new Argument('foo'), new Option('foo')]))).toEqual(
			result('[options] [--] [\\<foo>]', ['  foo'], ['      --foo'])
		)
	})

	test('Describe an Application', () => {
		expect(desc(new Signature())).toBe('')
		expect(desc(new Signature([new Argument('foo')]))).toBe('Arguments:#  foo#')
		expect(desc(new Signature([new Option('bar')]))).toBe('Options:#      --bar')
		expect(desc(new Signature([new Argument('foo'), new Option('bar')]))).toBe('Arguments:#  foo##Options:#      --bar')
	})
})
