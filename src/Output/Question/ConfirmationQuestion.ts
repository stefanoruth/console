import { Question } from './Question'

export class ConfirmationQuestion extends Question {
	protected trueAnswerRegex = /^y/i

	/**
	 * Asks for confirmation.
	 */
	async confirm(question: string): Promise<boolean> {
		return super.ask(question).then(answer => {
			if (answer === null) {
				return false
			}

			return this.trueAnswerRegex.test(answer)
		})
	}
}
