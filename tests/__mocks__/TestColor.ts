import { Color, ApplyColor } from '../../src/Output/Style'

export class TestColor extends Color {
	apply(text: string, color: ApplyColor): string {
		return `[${color.text || ''}|${color.bg || ''}]${text}`
	}
}

export class NullColor extends Color {
	apply(text: string, color: ApplyColor): string {
		return text
	}
}
