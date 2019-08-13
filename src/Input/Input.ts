import { Signature } from './Signature'
import { InvalidOptionException, InvalidArgumentException } from '../Exceptions'
import { escapeshellarg, isRunningTestMode } from '../helpers'

export type Args = { [k: string]: any }

export class Input {
	protected tokens: string[] = []
	protected parsed: string[] = []
	protected signature: Signature = new Signature()
	protected options: { [k: string]: string[] | string } = {}
	protected arguments: { [k: string]: string[] | string } = {}
	protected interactive: boolean = true

	constructor(argv?: string[]) {
		if (!argv) {
			argv = isRunningTestMode() ? [] : process.argv.slice(2)
		}

		this.tokens = argv
	}

	/**
	 * Bind a new Signature the input.
	 */
	bind(signature: Signature) {
		this.arguments = {}
		this.options = {}
		this.signature = signature
		this.parse()
	}

	/**
	 * Processes command line arguments.
	 */
	protected parse() {
		let parseOptions = true
		this.parsed = [...this.tokens]
		let token: string | undefined = this.parsed.shift()

		while (token !== undefined) {
			// console.log('parse', token.length, token)

			if (parseOptions && token === '') {
				this.parseArgument(token)
			} else if (parseOptions && token === '--') {
				parseOptions = false
			} else if (parseOptions && token.indexOf('--') === 0) {
				this.parseLongOption(token)
			} else if (parseOptions && token[0] === '-' && token !== '-') {
				this.parseShortOption(token)
			} else {
				this.parseArgument(token)
			}

			token = this.parsed.shift()
		}
	}

	/**
	 * Parses a short option.
	 */
	protected parseShortOption(token: string) {
		const name = token.substr(1)

		if (name.length > 1) {
			if (this.signature.hasShortcut(name[0]) && this.signature.getOptionForShortcut(name[0]).acceptValue()) {
				// an option with a value (with no space)
				this.addShortOption(name[0], name.substr(1))
			} else {
				this.parseShortOptionSet(name)
			}
		} else {
			this.addShortOption(name, null)
		}
	}

	/**
	 * Parses a short option set.
	 */
	protected parseShortOptionSet(name: string) {
		const len = name.length
		// console.log('parseShortOptionSet', name, len)
		for (let i = 0; i < len; i++) {
			if (!this.signature.hasShortcut(name[i])) {
				throw new Error(`The "-${name[i]}" option does not exist.`)
			}
			const option = this.signature.getOptionForShortcut(name[i])
			if (option.acceptValue()) {
				this.addLongOption(option.getName(), i === len - 1 ? null : name.substr(i + 1))
				break
			} else {
				this.addLongOption(option.getName(), null)
			}
		}
	}

	/**
	 * Parses a long option.
	 */
	protected parseLongOption(token: string) {
		const name = token.substr(2)
		const pos = name.indexOf('=')
		// console.log('parseLongOption', token, name, pos)

		if (pos !== -1) {
			const value = name.substr(pos + 1)
			// console.log(value, value.length)
			if (value.length === 0) {
				this.parsed.unshift(value)
			}
			this.addLongOption(name.substr(0, pos), value)
		} else {
			this.addLongOption(name, null)
		}
	}

	/**
	 * Parses an argument.
	 */
	protected parseArgument(token: string) {
		const c = Object.keys(this.arguments).length

		if (this.signature.hasArgument(c)) {
			const arg = this.signature.getArgument(c)
			this.arguments[arg.getName()] = arg.isArray() ? [token] : token
			// if last argument isArray(), append token to last argument
		} else if (this.signature.hasArgument(c - 1) && this.signature.getArgument(c - 1).isArray()) {
			const arg = this.signature.getArgument(c - 1)
			const argValues = this.arguments[arg.getName()]

			if (argValues instanceof Array) {
				argValues.push(token)
			}
			// unexpected argument
		} else {
			const all = this.signature.getArguments()

			if (all.length) {
				throw new Error(`Too many arguments, expected arguments "${all.map(a => a.getName()).join('" "')}".`)
			}

			throw new Error(`No arguments expected, got "${token}".`)
		}
	}

	/**
	 * Adds a short option value.
	 */
	protected addShortOption(shortcut: string, value: any) {
		if (!this.signature.hasShortcut(shortcut)) {
			throw new Error(`The "-${shortcut}" option does not exist.`)
		}
		this.addLongOption(this.signature.getOptionForShortcut(shortcut).getName(), value)
	}

	/**
	 * Adds a long option value.
	 */
	protected addLongOption(name: string, value: any) {
		// console.log('addLongOption', name, value)
		if (!this.signature.hasOption(name)) {
			throw new Error(`The "--${name}" option does not exist.`)
		}
		const option = this.signature.getOption(name)
		// console.log(option)

		if (value !== null && !option.acceptValue()) {
			throw new Error(`The "--${name}" option does not accept a value.`)
		}

		if (['', null].includes(value) && option.acceptValue() && this.parsed.length) {
			// if option accepts an optional or mandatory argument
			// let's see if there is one provided
			const next = this.parsed.shift()

			if (next !== undefined) {
				if ((next[0] && next[0] !== '-') || ['', null].includes(next)) {
					value = next
				} else {
					this.parsed.unshift(next)
				}
			}
		}

		if (value === null) {
			if (option.isValueRequired()) {
				throw new Error(`The "--${name}" option requires a value.`)
			}

			if (!option.isArray() && !option.isValueOptional()) {
				value = true
			}
		}

		if (option.isArray()) {
			if (typeof this.options[name] === 'undefined') {
				this.options[name] = []
			}

			const optionValues = this.options[name]

			if (optionValues instanceof Array) {
				optionValues.push(value)
			}
		} else {
			this.options[name] = value
		}
	}

	/**
	 * Returns the first argument from the raw parameters (not parsed).
	 */
	getFirstArgument(): string | undefined {
		let isOption = false

		for (let i = 0; i < this.tokens.length; i++) {
			const token = this.tokens[i]

			if (token && token[0] === '-') {
				if (token.indexOf('=') !== -1 || typeof this.tokens[i + 1] === 'undefined') {
					continue
				}
				// If it's a long option, consider that everything after "--" is the option name.
				// Otherwise, use the last char (if it's a short option set, only the last one can take a value with space separator)
				let name = token[1] === '-' ? token.substr(2) : token.substr(-1)

				if (typeof this.options[name] === 'undefined' && !this.signature.hasShortcut(name)) {
					// noop
				} else if (
					this.options[name] ||
					(this.options[(name = this.signature.shortcutToName(name))] && this.tokens[i + 1] === this.options[name])
				) {
					isOption = true
				}

				continue
			}

			if (isOption) {
				isOption = false
				continue
			}

			return token
		}
	}

	/**
	 * Returns the value of a raw option (not parsed).
	 *
	 * This method is to be used to introspect the input parameters
	 * before they have been validated. It must be used carefully.
	 * Does not necessarily return the correct result for short options
	 * when multiple flags are combined in the same option.
	 */
	getParameterOption(
		values: string | string[],
		defaultValue: any = false,
		onlyParams: boolean = false
	): string | undefined {
		values = values instanceof Array ? values : [values]

		const tokens = [...this.tokens]

		while (tokens.length > 0) {
			const token = tokens.shift()

			if (onlyParams && token === '--') {
				return defaultValue
			}

			for (const value of values) {
				if (token === value) {
					return tokens.shift()
				}

				// Options with values:
				//   For long options, test for '--option=' at beginning
				//   For short options, test for '-o' at beginning
				const leading = value.indexOf('--') === 0 ? `${value}=` : value

				if (leading !== '' && token && token.indexOf(leading) === 0) {
					return token.substr(leading.length)
				}
			}
		}

		return defaultValue
	}

	/**
	 * Returns a stringified representation of the args passed to the command.
	 */
	toString() {
		return this.tokens
			.map(token => {
				const match = /{^(-[^=]+=)(.+)}/g.exec(token)

				if (match) {
					return match[0] + this.escapeToken(match[1])
				}

				if (token && token[0] !== '-') {
					return this.escapeToken(token)
				}

				return token
			})
			.join(' ')
	}

	/**
	 * Escapes a token through escapeshellarg if it contains unsafe chars.
	 */
	protected escapeToken(token: string): string {
		return /{^[\w-]+$}/.test(token) ? token : escapeshellarg(token)
	}

	/**
	 * Returns true if the raw parameters (not parsed) contain a value.
	 *
	 * This method is to be used to introspect the input parameters
	 * before they have been validated. It must be used carefully.
	 * Does not necessarily return the correct result for short options
	 * when multiple flags are combined in the same option.
	 */
	hasParameterOption(values: string | string[], onlyParams: boolean = false): boolean {
		values = values instanceof Array ? values : [values]

		for (const token of this.tokens) {
			if (onlyParams && '--' === token) {
				return false
			}

			for (const value of values) {
				// Options with values:
				//   For long options, test for '--option=' at beginning
				//   For short options, test for '-o' at beginning
				const leading = value.indexOf('--') === 0 ? value + '=' : value
				if (token === value || ('' !== leading && token.indexOf(leading) === 0)) {
					return true
				}
			}
		}

		return false
	}

	/**
	 * Is this input means interactive?
	 */
	isInteractive() {
		return this.interactive
	}

	/**
	 * Sets the input interactivity.
	 */
	setInteractive(interactive: boolean) {
		this.interactive = interactive
	}

	/**
	 * Returns all the given arguments merged with the default values.
	 */
	getArguments() {
		return {
			...this.signature.getArgumentDefaults(),
			...this.arguments,
		}
	}

	/**
	 * Returns the argument value for a given argument name.
	 */
	getArgument(name: string) {
		if (!this.signature.hasArgument(name)) {
			throw new InvalidArgumentException(`The "${name}" argument does not exist.`)
		}
		return this.arguments[name] || this.signature.getArgument(name).getDefault()
	}

	/**
	 * Returns all the given options merged with the default values.
	 */
	getOptions() {
		return {
			...this.signature.getOptionDefaults(),
			...this.options,
		}
	}

	/**
	 * Returns the option value for a given option name.
	 */
	getOption(name: string) {
		if (!this.signature.hasOption(name)) {
			throw new InvalidOptionException(`The "${name}" option does not exist.`)
		}

		return this.options[name] || this.signature.getOption(name).getDefault()
	}

	/**
	 * Check if an option is parsed in by the user.
	 */
	hasOption(option: string): boolean {
		return this.signature.hasOption(option)
	}

	/**
	 * Check if an argument is parsed in by the user.
	 */
	hasArgument(arg: string): boolean {
		return this.signature.hasArgument(arg)
	}

	/**
	 * List args & options
	 */
	getArgs() {
		return {
			...this.getArguments(),
			...this.getOptions(),
		}
	}
}
