import { Terminal } from '../Terminal'
import { Output } from '../Output'

export class Question {
	constructor(protected output: Output, protected terminal: Terminal) {}

	/**
	 * Asks a question.
	 */
	async ask(question: string) {
		return this.terminal.question(question).then(res => this.formatAnswer(res))
	}

	/**
	 * Format the user's answer.
	 */
	protected formatAnswer(answer: string): string | null {
		answer = answer.trim()

		return answer.length > 0 ? answer : null
	}
}
