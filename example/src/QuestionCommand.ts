import { Command, Option } from 'kodo-console'

export class QuestionCommand extends Command {
	protected name = 'example:question'
	protected signature = [new Option('hidden', 'p')]

	async handle() {
		let result

		if (1) {
			result = await this.output.confirm('Are you there?')
		} else if (1) {
			result = await this.output.askHidden('Password')
		} else {
			result = await this.output.ask('How do you do?')
		}

		this.output.success(`Answer: ${result}`)
	}
}
