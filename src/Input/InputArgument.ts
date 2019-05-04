export class InputArgument {
	static readonly REQUIRED = 1
	static readonly OPTIONAL = 2
	static readonly IS_ARRAY = 4

	protected name: string
	protected mode: number
	protected defaultValue: any
	protected description: string

	constructor(name: string, mode?: number, description: string = '', defaultValue?: any) {
		if (!mode) {
			mode = InputArgument.OPTIONAL
		} else if (mode > 7 || mode < 1) {
			throw new Error(`Argument mode "${mode}" is not valid.`)
		}

		this.name = name
		this.mode = mode
		this.description = description

		this.setDefault(defaultValue)
	}

	/**
	 * Returns the argument name.
	 */
	getName(): string {
		return this.name
	}

	/**
	 * Sets the default value.
	 */
	setDefault(defaultValue?: any) {
		if (typeof defaultValue === 'string' && defaultValue.length === 0) {
			defaultValue = undefined
		}

		// if (self:: REQUIRED === $this -> mode && null !== $default) {
		//     throw new LogicException('Cannot set a default value except for InputArgument::OPTIONAL mode.');
		// }
		// if ($this -> isArray()) {
		//     if (null === $default) {
		//         $default = [];
		//     } elseif(!\is_array($default)) {
		//         throw new LogicException('A default value for an array argument must be an array.');
		//     }
		// }
		this.defaultValue = defaultValue
	}

	/**
	 * Returns the default value.
	 */
	getDefault() {
		return this.defaultValue
	}

	/**
	 * Returns the description text.
	 */
	getDescription() {
		return this.description
	}
}
