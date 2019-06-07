import { Color, ColorDefinition, ColorName } from './Color'

type StyleTags = 'info' | 'error' | 'comment' | 'question' | 'success' | 'warning' | 'note' | 'caution'

const tags: { [k in StyleTags]: { text: ColorName; bg?: ColorName } } = {
	info: { text: 'yellow' },
	error: { text: 'white', bg: 'red' },
	comment: { text: 'default', bg: 'default' },
	warning: { text: 'black', bg: 'yellow' },
	note: { text: 'yellow' },
	caution: { text: 'white', bg: 'red' },
	question: { text: 'white' },
	success: { text: 'green' },
}

export class Formatter {
	constructor(protected color: Color = new Color()) {}

	/**
	 * Fetch the coloring implamentation
	 */
	getColor(): Color {
		return this.color
	}

	/**
	 * Fetch the color codes for a specific type of text.
	 */
	protected getCodes(tag: StyleTags): { text: ColorDefinition; bg?: ColorDefinition } {
		const color = tags[tag]

		return {
			text: this.color.getTextColorSet(color.text),
			bg: color.bg ? this.color.getBgColorSet(color.bg) : undefined,
		}
	}

	format(text: string) {
		return text
	}
}
