export type Colors = 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'meganta' | 'cyan' | 'white'

interface ColorDefinition {
	set: string
	unset: string
}

// https://en.wikipedia.org/wiki/ANSI_escape_code#Colors
function color(set: number, unset: number = 0): ColorDefinition {
	return {
		set: `\x1b[${set}m`,
		unset: `\x1b[${unset}m`,
	}
}

export class CliColor {
	protected foregroundColors: { [c: string]: ColorDefinition } = {
		black: color(30),
		red: color(31),
		green: color(32),
		yellow: color(33),
		blue: color(34),
		magenta: color(35),
		cyan: color(36),
		white: color(37),
	}

	protected backgroundColors: { [c: string]: ColorDefinition } = {
		black: color(40),
		red: color(41),
		green: color(42),
		yellow: color(43),
		blue: color(44),
		magenta: color(45),
		cyan: color(46),
		white: color(47),
	}
}
