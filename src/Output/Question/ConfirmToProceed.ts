import { Question } from './Question'

export class ConfirmToProceed extends Question {
	/**
	 * Confirm before proceeding with the action.
	 *
	 * This method only asks for confirmation in production.
	 */
	async confirm(warning: string = 'Application In Production!', callback?: () => boolean) {
		if (!callback) {
			callback = this.getDefaultConfirmCallback()
		}

		const shouldConfirm = callback()

		if (shouldConfirm) {
			// if (this.input.hasOption('force')) {
			// 	return true
			// }

			this.output.warning(warning)

			const confirmed = await this.output.confirm('Do you really wish to run this command?')

			if (!confirmed) {
				this.output.comment('Command Cancelled!')
				return false
			}
		}

		return true
	}

	/**
	 * Get the default confirmation callback.
	 */
	protected getDefaultConfirmCallback(): () => boolean {
		return () => {
			const mode = this.terminal.mode()

			if (!mode) {
				return false
			}

			return mode.toLowerCase() === 'production'
		}
	}
}
