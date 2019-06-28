import { Question } from './Question'

export class HiddenQuestion extends Question {
	/**
	 * Asks a question with the user input hidden.
	 */
	async ask(question: string) {
		return this.terminal.hiddenQuestion(question).then(res => this.formatAnswer(res))
	}
}
