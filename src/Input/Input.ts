import { Signature } from './Signature'

export class Input {
	protected tokens: string[] = []
	protected parsed: string[] = []
	protected commandName?: string
	protected options = []
	protected arguments = []

	constructor(argv?: string[], protected signature: Signature = new Signature()) {
		if (!argv) {
			argv = process.argv.slice(2)
		}

		if (argv.length > 0) {
			this.commandName = argv[0]
		}

		this.tokens = argv

		this.parse()
		this.validate()
	}

	/**
	 * Processes command line arguments.
	 */
	protected parse() {
		let parseOptions = true
		this.parsed = [...this.tokens]
		let token: string | undefined = this.parsed.shift()

		while (token !== undefined) {
			// console.log(token)

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
	 * Validates the input.
	 */
	validate() {
		//         $definition = $this -> definition;
		//         $givenArguments = $this -> arguments;
		//         $missingArguments = array_filter(array_keys($definition -> getArguments()), function ($argument) use($definition, $givenArguments) {
		//             return !\array_key_exists($argument, $givenArguments) && $definition -> getArgument($argument) -> isRequired();
		//     });
		//     if(\count($missingArguments) > 0) {
		//     throw new RuntimeException(sprintf('Not enough arguments (missing: "%s").', implode(', ', $missingArguments)));
		// }
	}

	/**
	 * Parses a short option.
	 */
	protected parseShortOption(token: string) {
		console.log('parseShortOption', token)
		const name = token.substr(1)

		// if (name.length > 1) {
		// 	if (this.signature.hasShortcut(name[0]) && this.signature.getOptionForShortcut(name[0]).acceptValue()) {
		// 		// an option with a value (with no space)
		// 		this.addShortOption(name[0], name.substr(1))
		// 	} else {
		// 		this.parseShortOptionSet(name)
		// 	}
		// } else {
		// 	this.addShortOption(name, null)
		// }
	}

	/**
	 * Parses a short option set.
	 */
	protected parseShortOptionSet(name: string) {
		console.log('parseShortOptionSet', name)
		const len = name.length

		for (let i = 0; i < len; i++) {
			// if (!this.signature.hasShortcut(name[i])) {
			//     // $encoding = mb_detect_encoding($name, null, true);
			//     throw new Error('The "-%s" option does not exist.'); // false === $encoding ? $name[$i] : mb_substr($name, $i, 1, $encoding))
			// }
			// const option = this.signature.getOptionForShortcut(name[i])
			// if (option.acceptValue()) {
			// 	this.addLongOption(option.getName(), i === len - 1 ? null : name.substr(i + 1))
			// 	break
			// } else {
			// 	this.addLongOption(option.getName(), null)
			// }
		}
	}

	/**
	 * Parses a long option.
	 */
	protected parseLongOption(token: string) {
		console.log('parseLongOption', token)
		const name = token.substr(2)
		const pos = name.indexOf('=')

		// if (pos !== -1) {
		//     const value = name.substr(pos+1)
		//     if (value.length === 0) {
		//         this.parsed.unshift(value)
		//     }
		//     this.addLongOption(name.substr(0, pos), value)
		// } else {
		//     this.addLongOption(name, null)
		// }
	}

	/**
	 * Parses an argument.
	 */
	protected parseArgument(token: string) {
		console.log('parseArgument', token)
		const c = this.arguments.length

		// if (this.signature.hasArgument(c)) {
		// 	// const arg = this.signature.getArgument(c)
		// 	// this.arguments[arg.getName()] = arg.isArray() ? [token] : token
		// 	// if last argument isArray(), append token to last argument
		// } else if (this.signature.hasArgument(c - 1) && this.signature.getArgument(c - 1).isArray()) {
		//     // const arg = this.signature.getArgument(c - 1);
		//     // this.arguments[arg.getName()][] = token;
		// 	// unexpected argument
		// } else {
		// 	const all = this.signature.getArguments()

		// 	if (all.length) {
		// 		throw new Error(`Too many arguments, expected arguments "%s".`) // implode('" "', array_keys($all))
		// 	}

		// 	throw new Error(`No arguments expected, got "%s".`) // token
		// }
	}

	/**
	 * Returns the first argument from the raw parameters (not parsed).
	 */
	getFirstArgument(): string | undefined {
		// $isOption = false;
		// foreach($this -> tokens as $i => $token) {
		//     if ($token && '-' === $token[0]) {
		//         if (false !== strpos($token, '=') || !isset($this -> tokens[$i + 1])) {
		//             continue;
		//         }
		//         // If it's a long option, consider that everything after "--" is the option name.
		//         // Otherwise, use the last char (if it's a short option set, only the last one can take a value with space separator)
		//         $name = '-' === $token[1] ? substr($token, 2) : substr($token, -1);
		//         if (!isset($this -> options[$name]) && !$this -> definition -> hasShortcut($name)) {
		//             // noop
		//         } elseif((isset($this -> options[$name]) || isset($this -> options[$name = $this -> definition -> shortcutToName($name)])) && $this -> tokens[$i + 1] === $this -> options[$name]) {
		//             $isOption = true;
		//         }
		//         continue;
		//     }
		//     if ($isOption) {
		//         $isOption = false;
		//         continue;
		//     }
		//     return $token;
		// }
		return this.commandName
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
		// $values = (array) $values;
		// foreach($this -> tokens as $token) {
		//     if ($onlyParams && '--' === $token) {
		//         return false;
		//     }
		//     foreach($values as $value) {
		//         // Options with values:
		//         //   For long options, test for '--option=' at beginning
		//         //   For short options, test for '-o' at beginning
		//         $leading = 0 === strpos($value, '--') ? $value.'=' : $value;
		//         if ($token === $value || '' !== $leading && 0 === strpos($token, $leading)) {
		//             return true;
		//         }
		//     }
		// }
		// return false;
		return false
	}

	/**
	 * Check if an option is parsed in by the user.
	 */
	hasOption(option: string): boolean {
		return false
		// return !!this.options[option]
	}

	/**
	 * Check if an argument is parsed in by the user.
	 */
	hasArgument(arg: string): boolean {
		return false
		// return !!this.arguments[arg]
	}
}
