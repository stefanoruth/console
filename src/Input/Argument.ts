import { LogicException, InvalidArgumentException } from '../Exceptions'

export enum ArgumentMode {
	required = 1,
	optional = 2,
	isArray = 4,
}

type Mode = keyof typeof ArgumentMode

export class Argument<T = any> {
	protected mode: ArgumentMode

	constructor(
		protected name: string,
		mode?: ArgumentMode | Mode,
		protected description?: string,
		protected defaultValue?: T
	) {
		if (typeof mode === 'undefined') {
			mode = ArgumentMode.optional
		} else if (typeof mode === 'string') {
			mode = ArgumentMode[mode]
		} else if (mode > 7 || mode < 1) {
			throw new InvalidArgumentException(`Argument mode "${mode}" is not valid.`)
		}

		this.mode = mode
	}

	/**
	 * Get name.
	 */
	getName() {
		return this.name
	}

	/**
	 * Returns true if the argument is required.
	 */
	isRequired(): boolean {
		return ArgumentMode.required === (ArgumentMode.required & this.mode)
	}

	/**
	 * Returns true if the argument can take multiple values.
	 */
	isArray(): boolean {
		return ArgumentMode.isArray === (ArgumentMode.isArray & this.mode)
	}

	/**
	 * Sets the default value.
	 */
	setDefault(defaultValue: T) {
		if (ArgumentMode.required === this.mode && defaultValue) {
			throw new LogicException('Cannot set a default value except for ArgumentMode.optional mode.')
		}

		if (this.isArray()) {
			if (!defaultValue) {
				;(defaultValue as any) = []
			} else if (!(defaultValue instanceof Array)) {
				throw new LogicException('A default value for an array argument must be an array.')
			}
		}

		this.defaultValue = defaultValue
	}

	/**
	 * Returns the default value.
	 */
	getDefault(): T | undefined {
		return this.defaultValue
	}

	/**
	 * Returns the description text.
	 */
	getDescription(): string {
		return this.description || ''
	}
}
