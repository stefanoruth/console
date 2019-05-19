import { Argument } from './Argument'
import { Option } from './Option'
import { InvalidArgumentException, LogicException } from '../Exceptions'

type CommandSignature = Array<Argument | Option>

export class Signature {
	protected arguments: { [k: string]: Argument } = {}
	protected requiredCount: number = 0
	protected hasAnArrayArgument: boolean = false
	protected hasOptional: boolean = false
	protected options: { [k: string]: Option } = {}
	protected shortcuts: { [k: string]: string } = {}

	constructor(definition: CommandSignature = []) {
		this.setDefinition(definition)
	}

	/**
	 * Sets the definition of the input.
	 */
	setDefinition(definition: CommandSignature) {
		const args: Argument[] = []
		const options: Option[] = []

		definition.forEach(item => {
			if (item instanceof Option) {
				options.push(item)
			} else {
				args.push(item)
			}
		})

		this.setArguments(args)
		this.setOptions(options)
	}

	/**
	 * Sets the Argument objects.
	 */
	setArguments(args: Argument[] = []) {
		this.arguments = {}
		this.requiredCount = 0
		this.hasOptional = false
		this.hasAnArrayArgument = false

		this.addArguments(args)
	}

	/**
	 * Adds an array of Argument objects.
	 */
	addArguments(args: Argument[] = []) {
		args.forEach(arg => this.addArgument(arg))
	}

	/**
	 * Add argument.
	 */
	addArgument(arg: Argument) {
		if (this.arguments[arg.getName()]) {
			throw new LogicException(`An argument with name "${arg.getName()}" already exists.`)
		}

		if (this.hasAnArrayArgument) {
			throw new LogicException('Cannot add an argument after an array argument.')
		}

		if (arg.isRequired() && this.hasOptional) {
			throw new LogicException('Cannot add a required argument after an optional one.')
		}

		if (arg.isArray()) {
			this.hasAnArrayArgument = true
		}

		if (arg.isRequired()) {
			this.requiredCount++
		} else {
			this.hasOptional = true
		}

		this.arguments[arg.getName()] = arg
	}

	/**
	 * Gets the array of Argument objects.
	 */
	getArguments(): Argument[] {
		return Object.values(this.arguments)
	}

	/**
	 * Returns an Argument by name or by position.
	 */
	getArgument(name: string | number): Argument {
		if (!this.hasArgument(name)) {
			throw new InvalidArgumentException(`The "${name}" argument does not exist.`)
		}

		if (typeof name === 'number') {
			return this.arguments[name]
		}

		return this.arguments[name]
	}

	/**
	 * Returns true if an Argument object exists by name or position.
	 */
	hasArgument(name: any): name is Argument {
		if (typeof name === 'number') {
			return !!this.getArguments()[name]
		}

		if (typeof name !== 'string') {
			throw new InvalidArgumentException(`The argument must be a string.`)
		}

		return !!this.arguments[name]
	}

	/**
	 * Gets the default values.
	 */
	getArgumentDefaults() {
		const values: { [k: string]: any } = {}

		Object.values(this.arguments).forEach(arg => {
			values[arg.getName()] = arg.getDefault()
		})

		return values
	}

	/**
	 * Sets the Option objects.
	 */
	setOptions(options: Option[] = []) {
		this.options = {}
		this.shortcuts = {}

		options.forEach(option => this.addOption(option))
	}

	/**
	 * Add option.
	 */
	addOption(option: Option) {
		if (this.options[option.getName()] && !option.equals(this.options[option.getName()])) {
			throw new LogicException(`An option named "${option.getName()}" already exists.`)
		}

		const optionShortcut = option.getShortcut()

		if (optionShortcut) {
			optionShortcut.split('|').forEach(shortcut => {
				if (this.shortcuts[shortcut] && !option.equals(this.options[this.shortcuts[shortcut]])) {
					throw new LogicException(`An option with shortcut "${shortcut}" already exists.`)
				}
			})
		}

		this.options[option.getName()] = option

		if (optionShortcut) {
			optionShortcut.split('|').forEach(shortcut => {
				this.shortcuts[shortcut] = option.getName()
			})
		}

		this.options[option.getName()] = option
	}

	/**
	 * Returns an InputOption by name.
	 */
	getOption(name: string) {
		if (!this.hasOption(name)) {
			throw new InvalidArgumentException(`The "--${name}" option does not exist.`)
		}
		return this.options[name]
	}

	/**
	 * Returns true if an Option object exists by name.
	 */
	hasOption(name: any): name is Option {
		if (typeof name !== 'string') {
			throw new InvalidArgumentException(`The argument must be a string.`)
		}

		return !!this.options[name]
	}

	/**
	 * Gets the array of Option objects.
	 */
	getOptions(): Option[] {
		return Object.values(this.options)
	}

	/**
	 * Returns true if an InputOption object exists by shortcut.
	 */
	hasShortcut(name: any): name is Option {
		if (typeof name !== 'string') {
			throw new InvalidArgumentException(`The option must be a string.`)
		}

		return !!this.shortcuts[name]
	}

	/**
	 * Gets an InputOption by shortcut.
	 */
	getOptionForShortcut(shortcut: string) {
		return this.getOption(this.shortcutToName(shortcut))
	}

	/**
	 * Gets an array of default values.
	 */
	getOptionDefaults() {
		const values: { [k: string]: any } = {}

		Object.values(this.options).forEach(option => {
			values[option.getName()] = option.getDefault()
		})

		return values
	}

	/**
	 * Returns the InputOption name given a shortcut.
	 */
	shortcutToName(shortcut: string): string {
		if (!this.shortcuts[shortcut]) {
			throw new InvalidArgumentException(`The "-${shortcut}" option does not exist.`)
		}

		return this.shortcuts[shortcut]
	}

	/**
	 * Gets the synopsis.
	 */
	getSynopsis(short: boolean = false): string {
		const elements: string[] = []

		if (short && this.getOptions().length) {
			elements.push('[options]')
		} else if (!short) {
			this.getOptions().forEach(option => {
				let value = ''

				if (option.acceptValue()) {
					const optional = option.isValueOptional()

					value = ` ${optional ? '[' : ''}${option.getName().toUpperCase()}${optional ? ']' : ''}`
				}

				const shortcut = option.getShortcut() ? `-${option.getShortcut()}|` : ''
				elements.push(`[${shortcut}--${option.getName()}${value}]`)
			})
		}

		if (elements.length && this.getArguments().length) {
			elements.push('[--]')
		}

		let tail = ''
		this.getArguments().forEach(arg => {
			let element = `<${arg.getName()}>`

			if (arg.isArray()) {
				element += '...'
			}

			if (!arg.isRequired()) {
				element = `[${element}`
				tail += ']'
			}

			elements.push(element)
		})

		return elements.join(' ') + tail
	}
}
