import { Argument } from './Argument'
import { Option } from './Option'

type CommandSignature = Array<Argument<any> | Option<any>>

export class Signature {
	protected arguments: Argument[] = []
	protected requiredCount: number = 0
	protected hasAnArrayArgument: boolean = false
	protected hasOptional: boolean = false
	protected options: Option[] = []
	protected shortcuts: string[] = []

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
	 * Sets the InputArgument objects.
	 */
	setArguments(args: Argument[] = []) {
		this.arguments = []
		this.requiredCount = 0
		this.hasOptional = false
		this.hasAnArrayArgument = false

		args.forEach(arg => this.addArgument(arg))
	}

	/**
	 * Add argument.
	 */
	addArgument(arg: Argument) {
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
	}

	/**
	 * Gets the array of InputArgument objects.
	 */
	getArguments(): Argument[] {
		return this.arguments
	}

	/**
	 * Sets the InputOption objects.
	 */
	setOptions(options: Option[] = []) {
		this.options = []
		this.shortcuts = []

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
	}

	/**
	 * Gets the array of InputOption objects.
	 */
	getOptions(): Option[] {
		return this.options
	}
}
