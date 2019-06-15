import { Command } from 'kodo-console'

export class QuestionCommand extends Command {
	protected name = 'example:question'

	async handle() {
		const result = await this.output.ask('How do you do?')

		this.output.success(`Answer: ${result}`)
	}
}
