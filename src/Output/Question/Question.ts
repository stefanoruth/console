import rl from 'readline'

export class Question {
	ask(question: string, defaultValue: boolean = true): Promise<boolean> {
		return new Promise(resolve => {
			const r = rl.createInterface({
				input: process.stdin,
				output: process.stdout,
			})

			r.question(question + '\n', (answer: string) => {
				r.close()
				resolve(answer.toUpperCase() === 'Y')
			})
		})
	}
}
