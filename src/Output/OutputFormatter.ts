interface OutputStyles {
	info: () => void
	error: () => void
}

type da = keyof OutputStyles

export class OutputFormatter {
	/**
	 * Escapes "<" special char in given text.
	 */
	static escape(text: string): string {
		text = text.replace(/([^\\\\]?)</, '$1\\<')

		return this.escapeTrailingBackslash(text)
	}

	/**
	 * Escapes trailing "\" in given text.
	 */
	static escapeTrailingBackslash(text: string): string {
		if (text.substr(-1)) {
			const len = text.length
			text.replace(/\/\/$/, '').replace(/\0/g, '')
			text += '\0'.repeat(len - text.length)
		}

		return text
	}
}
