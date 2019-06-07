import { Color, ColorDefinition } from './Color'

type StyleTags = 'info' | 'error' | 'comment' | 'question' | 'success' | 'warning' | 'note' | 'caution'

export class Formatter {
	constructor(protected color: Color = new Color()) {}

	/**
	 * Fetch the coloring implamentation
	 */
	getColor(): Color {
		return this.color
	}

	getCodes(tag: StyleTags): { text?: ColorDefinition; bg?: ColorDefinition } {
		switch (tag) {
			case 'info':
				return {
					text: this.color.getTextColorSet('yellow'),
				}

			default:
				return {}
		}
	}
}
