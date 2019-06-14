import { Color, ApplyColor } from './Color'

export class Formatter {
	constructor(protected color: Color = new Color()) {}

	/**
	 * Fetch the coloring implamentation
	 */
	getColor(): Color {
		return this.color
	}

	/**
	 * Format a string with a custom color.
	 */
	format(text: string, color: ApplyColor) {
		return this.color.apply(text, color)
	}

	/**
	 * Format text info.
	 */
	info(text: string) {
		return this.color.apply(text, { text: 'yellow' })
	}

	/**
	 * Format text error.
	 */
	error(text: string) {
		return this.color.apply(text, { text: 'white', bg: 'red' })
	}

	/**
	 * Format text comment.
	 */
	comment(text: string) {
		return this.color.apply(text, { text: 'default', bg: 'default' })
	}

	/**
	 * Format text warning.
	 */
	warning(text: string) {
		return this.color.apply(text, { text: 'black', bg: 'yellow' })
	}

	/**
	 * Format text note.
	 */
	note(text: string) {
		return this.color.apply(text, { text: 'yellow' })
	}

	/**
	 * Format text caution.
	 */
	caution(text: string) {
		return this.color.apply(text, { text: 'white', bg: 'red' })
	}

	/**
	 * Format text message.
	 */
	question(text: string) {
		return this.color.apply(text, { text: 'white' })
	}

	/**
	 * Format text success.
	 */
	success(text: string) {
		return this.color.apply(text, { text: 'green' })
	}
}
