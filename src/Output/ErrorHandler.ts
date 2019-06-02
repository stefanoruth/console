import { Output } from './Output'

export class ErrorHandler {
	constructor(protected output: Output) {}

	render(e: Error) {
		const message = e.message.trim()

		this.output.error(message)

		console.log(e.constructor.name)
		console.log(message)
		console.log('ErrorRender')
		console.log(e.stack)
	}
}
