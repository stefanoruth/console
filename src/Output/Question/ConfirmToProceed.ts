import { Output } from '../Output'
import { Input } from '../../Input/Input'

export class ConfirmToProceed {
	constructor(protected input: Input, protected output: Output) {}

	/**
	 * Confirm before proceeding with the action.
	 *
	 * This method only asks for confirmation in production.
	 */
	confirm(warning: string = 'Application In Production!', callback?: (() => boolean) | boolean): boolean {
		callback = !callback ? this.getDefaultConfirmCallback() : callback

		const shouldConfirm = typeof callback === 'function' ? callback() : callback

		if (shouldConfirm) {
			if (this.input.hasOption('force')) {
				return true
			}

			this.output.warning(warning)

			const confirmed = this.output.confirm('Do you really wish to run this command?')

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
			return process.env.NODE_ENV === 'production'
		}
	}
}
