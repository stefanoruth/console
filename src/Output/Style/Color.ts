export type ColorName = 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'meganta' | 'cyan' | 'white'

export interface ColorDefinition {
	set: string
	unset: string
}

// https://en.wikipedia.org/wiki/ANSI_escape_code#Colors
function colorFn(set: number, unset: number = 0): ColorDefinition {
	return {
		set: `\x1b[${set}m`,
		unset: `\x1b[${unset}m`,
	}
}

export class Color {
	protected foregroundColors: { [c: string]: ColorDefinition } = {
		black: colorFn(30),
		red: colorFn(31),
		green: colorFn(32),
		yellow: colorFn(33),
		blue: colorFn(34),
		magenta: colorFn(35),
		cyan: colorFn(36),
		white: colorFn(37),
	}

	protected backgroundColors: { [c: string]: ColorDefinition } = {
		black: colorFn(40),
		red: colorFn(41),
		green: colorFn(42),
		yellow: colorFn(43),
		blue: colorFn(44),
		magenta: colorFn(45),
		cyan: colorFn(46),
		white: colorFn(47),
	}

	getTextColorSet(color: ColorName) {
		return this.foregroundColors[color]
	}

	getBgColorSet(color: ColorName) {
		return this.backgroundColors[color]
	}

	/**
	 * Apply a set of color codes to the text string
	 */
	apply(text: string, color?: { text?: ColorName; bg?: ColorName }) {
		if (!color) {
			return text
		}

		const setCodes: string[] = []
		const unsetCodes: string[] = []

		if (color.text) {
			const foreground = this.foregroundColors[color.text]

			setCodes.push(foreground.set)
			unsetCodes.push(foreground.unset)
		}

		if (color.bg) {
			const background = this.backgroundColors[color.bg]

			setCodes.push(background.set)
			unsetCodes.push(background.unset)
		}

		return setCodes.join('') + text + unsetCodes.join('')
	}
}
