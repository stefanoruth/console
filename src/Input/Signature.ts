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

		// if (isset($this -> arguments[$argument -> getName()])) {
		//     throw new LogicException(sprintf('An argument with name "%s" already exists.', $argument -> getName()));
		// }
		// if ($this -> hasAnArrayArgument) {
		//     throw new LogicException('Cannot add an argument after an array argument.');
		// }
		// if ($argument -> isRequired() && $this -> hasOptional) {
		//     throw new LogicException('Cannot add a required argument after an optional one.');
		// }
		// if ($argument -> isArray()) {
		//     $this -> hasAnArrayArgument = true;
		// }
		// if ($argument -> isRequired()) {
		//     ++$this -> requiredCount;
		// } else {
		//     $this -> hasOptional = true;
		// }
		// $this -> arguments[$argument -> getName()] = $argument;
		this.arguments[arg.getName()] = arg
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
	 * Gets the array of Argument objects.
	 */
	getArguments(): Argument[] {
		return Object.values(this.arguments)
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
		// if (isset($this -> options[$option -> getName()]) && !$option -> equals($this -> options[$option -> getName()])) {
		//     throw new LogicException(sprintf('An option named "%s" already exists.', $option -> getName()));
		// }
		// if ($option -> getShortcut()) {
		//     foreach(explode('|', $option -> getShortcut()) as $shortcut) {
		//         if (isset($this -> shortcuts[$shortcut]) && !$option -> equals($this -> options[$this -> shortcuts[$shortcut]])) {
		//             throw new LogicException(sprintf('An option with shortcut "%s" already exists.', $shortcut));
		//         }
		//     }
		// }
		// $this -> options[$option -> getName()] = $option;
		// if ($option -> getShortcut()) {
		//     foreach(explode('|', $option -> getShortcut()) as $shortcut) {
		//         $this -> shortcuts[$shortcut] = $option -> getName();
		//     }
		// }
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
}
