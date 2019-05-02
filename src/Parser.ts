import { InputArgument } from './Input/InputArgument'
import { InputOption } from './Input/InputOption'

export class Parser {
	/**
	 * Parse the given console command definition into an array.
	 */
	static parse(expression: string): any[] {}

	/**
	 * Extract the name of the command from the expression.
	 */
	protected static name(expression: string) {}

	/**
	 * Extract all of the parameters from the tokens.
	 */
	protected static parameters(tokens: any[]): any[] {}

	/**
	 * Parse an argument expression.
	 */
	protected static parseArgument(token: string): InputArgument {}

	/**
	 * Parse an option expression.
	 */
	protected static parseOption(token: string): InputOption {}

	/**
	 * Parse the token into its token and description segments.
	 */
	protected static extractDescription(token: string): any[] {}
}
