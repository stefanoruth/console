import { Question } from './Question'

export class ChoiceQuestion extends Question {
	/**
	 * Asks a choice question.
	 */
	async choose(question: string, choices: string[]): Promise<string> {
		throw new Error('Not yet implemented.')
	}
}
