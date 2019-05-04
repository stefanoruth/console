import { InputArgument } from './Input/InputArgument'
import { InputOption } from './Input/InputOption'
import { trim } from 'lodash'
import { Signature } from './types'

export class Parser {
	/**
	 * Parse the given console command definition into an array.
	 */
	parse(expression: string): Signature {
		const name = this.name(expression)
		const matches = []

		const reg = new RegExp(/\{\s*(.*?)\s*\}/g)

		let result
		while ((result = reg.exec(expression)) !== null) {
			if (result[1]) {
				matches.push(result[1])
			}
		}

		if (matches.length) {
			const params = this.parameters(matches)

			return {
				name,
				arguments: params.arguments,
				options: params.options,
			}
		}

		return {
			name,
			arguments: {},
			options: {},
		}
	}

	/**
	 * Extract the name of the command from the expression.
	 */
	protected name(expression: string): string {
		if (expression.trim() === '') {
			throw new Error('Console command definition is empty.')
		}

		const matches = expression.match(/[^\s]+/)

		if (!matches) {
			throw new Error('Unable to determine command name from signature.')
		}

		return matches[0]
	}

	/**
	 * Extract all of the parameters from the tokens.
	 */
	protected parameters(
		tokens: string[]
	): { arguments: { [k: string]: InputArgument }; options: { [k: string]: InputOption } } {
		const args: { [k: string]: InputArgument } = {}
		const options: { [k: string]: InputOption } = {}

		for (const token of tokens) {
			const matches = token.match(/-{2,}(.*)/)

			// console.log('TOKEN', token, matches)

			if (matches && matches[1]) {
				const option = this.parseOption(matches[1])

				options[option.getName()] = option
			} else {
				const arg = this.parseArgument(token)

				args[arg.getName()] = arg
			}
		}

		return {
			arguments: args,
			options,
		}
	}

	/**
	 * Parse an argument expression.
	 */
	protected parseArgument(token: string): InputArgument {
		let description: string
		;[token, description] = this.extractDescription(token)

		const matches1 = /(.+)\=\*(.*)/g.exec(token)
		const matches2 = /(.+)\=(.*)/g.exec(token)
		// console.log(token, description)
		// console.log(matches1)
		// console.log(matches2)

		switch (true) {
			case token.endsWith('?*'):
				// console.log('parseArgument', 1)
				return new InputArgument(trim(token, '?*'), InputArgument.IS_ARRAY, description)
			case token.endsWith('*'):
				// console.log('parseArgument', 2)
				return new InputArgument(trim(token, '*'), InputArgument.IS_ARRAY | InputArgument.REQUIRED, description)
			case token.endsWith('?'):
				// console.log('parseArgument', 3)
				return new InputArgument(trim(token, '?'), InputArgument.OPTIONAL, description)
			case !!matches1:
				// console.log('parseArgument', 4)
				return new InputArgument(matches1![1], InputArgument.IS_ARRAY, description, matches1![2].split('/,s?/'))
			case !!matches2:
				// console.log('parseArgument', 5)
				return new InputArgument(matches2![1], InputArgument.OPTIONAL, description, matches2![2])
			default:
				// console.log('parseArgument', 6)
				return new InputArgument(token, InputArgument.REQUIRED, description)
		}
	}

	/**
	 * Parse an option expression.
	 */
	protected parseOption(token: string): InputOption {
		let description: string
		;[token, description] = this.extractDescription(token)

		const matches = token.split(/\s*\|\s*/, 2)
		let shortcut: string = ''

		if (matches.length === 2) {
			shortcut = matches[0]
			token = matches[1]
		}

		const matches1 = token.match(/(.+)\=\*(.*)/)
		const matches2 = token.match(/(.+)\=(.*)/)

		switch (true) {
			case token.endsWith('='):
				return new InputOption(trim(token, '='), shortcut, InputOption.VALUE_OPTIONAL, description)
			case token.endsWith('=*'):
				return new InputOption(
					trim(token, '=*'),
					shortcut,
					InputOption.VALUE_OPTIONAL | InputOption.VALUE_IS_ARRAY,
					description
				)
			case !!matches1:
				return new InputOption(
					matches[1],
					shortcut,
					InputOption.VALUE_OPTIONAL | InputOption.VALUE_IS_ARRAY,
					description,
					matches[2].split('/,s?/')
				)
			case !!matches2:
				return new InputOption(matches2![0], shortcut, InputOption.VALUE_OPTIONAL, description, matches2![1])
			default:
				return new InputOption(token, shortcut, InputOption.VALUE_NONE, description)
		}
	}

	/**
	 * Parse the token into its token and description segments.
	 */
	protected extractDescription(token: string): string[] {
		const parts = token.trim().split(/\s+:\s+/, 2)

		return parts.length === 2 ? parts : [token, '']
	}
}
