import { Color, ApplyColor } from './Color'

export class NullColor extends Color {
	apply(text: string, color: ApplyColor) {
		return text
	}
}
