import { Application } from '../Application'
import { Signature } from '../Input/Signature'
import { Output } from '../Output/Output'
import { Input } from '../Input/Input'
import { extractNamespace } from '../helpers'

export abstract class Command {
	protected abstract name: string
	protected description: string = ''
	protected help: string = ''
	protected signature: Signature = new Signature()
	protected application?: Application
	protected synopsis: { short?: string; long?: string } = {}
	protected applicationSignatureMerged: boolean = false
	private _input?: Input
	private _output?: Output

	/**
	 * Start running the command from inside the Console.
	 */
	async execute(input: Input, output: Output) {
		this._input = input
		this._output = output

		return this.handle()
	}

	/**
	 * Fetch application.
	 */
	protected getApplication(): Application {
		if (!this.application) {
			throw new Error('Application has not been set for the Command')
		}
		return this.application
	}

	/**
	 * Set the application.
	 */
	setApplication(application?: Application) {
		this.application = application

		return this
	}

	/**
	 * Returns the command name.
	 */
	getName() {
		return this.name
	}

	/**
	 * Returns the command description.
	 */
	getDescription() {
		return this.description
	}

	/**
	 * Returns the help for the command.
	 */
	getHelp(): string {
		return this.help
	}

	/**
	 * Returns the processed help for the command
	 */
	getProcessedHelp(): string {
		if (this.getHelp().length) {
			return this.getHelp()
		}

		return this.getDescription()
	}

	/**
	 * Fetch the output from the Application.
	 */
	get output() {
		if (!this._output) {
			throw new Error('Output has not yet been set')
		}

		return this._output
	}

	/**
	 * Fetch the input from the Application.
	 */
	get input() {
		if (!this._input) {
			throw new Error('Input has not yet been set')
		}

		return this._input
	}

	/**
	 * Extract namespace from command name.
	 */
	getNamespace() {
		return extractNamespace(this.getName())
	}

	/**
	 * Handle what ever the command is suppose to do.
	 */
	abstract async handle(): Promise<void>

	/**
	 * Gets the InputDefinition attached to this Command.
	 */
	getSignature(): Signature {
		return this.signature
	}

	/**
	 * Returns the synopsis for the command.
	 */
	getSynopsis(short: boolean = false): string {
		const key = short ? 'short' : 'long'

		if (typeof this.synopsis[key] === 'undefined') {
			this.synopsis[key] = `${this.getName()} ${this.signature.getSynopsis(short)}`.trim()
		}

		return this.synopsis[key]!
	}

	/**
	 * Merges the application signature with the command signature.
	 */
	mergeApplicationSignature(mergeArgs: boolean = true) {
		if (!this.application || this.applicationSignatureMerged) {
			return
		}

		this.signature.addOptions(this.application.getSignature().getOptions())
		// this.signature.addArguments(this.application.getSignature().getArguments())

		this.applicationSignatureMerged = true
	}
}
