import { ColorName, Color } from './Style/Color'
import { ProgressBar } from './ProgressBar/ProgressBar'
import { Table } from './Table/Table'
import { Question } from './Question/Question'
import { Writer } from './Writer'
import { Verbosity } from './Verbosity'
import { Formatter } from './Style/Formatter'

export class Output {
	constructor(
		protected verbosity: Verbosity = Verbosity.normal,
		protected writer: Writer = new Writer(),
		protected style: Formatter = new Formatter()
	) {}

	/**
	 * Gets the current verbosity of the output.
	 */
	getVerbosity(): Verbosity {
		return this.verbosity
	}

	/**
	 * Sets the verbosity of the output.
	 */
	setVerbosity(level: Verbosity) {
		this.verbosity = level

		return this
	}

	/**
	 * Writes a string of text on the current line in console.
	 */
	raw(message: string | string[]) {
		this.writer.write(message)
	}

	/**
	 * Write a line to the console.
	 */
	line(message: string, newLine: boolean = true, color?: ColorName) {
		this.writer.write(this.style.format(message, { text: color }), newLine)
	}

	/**
	 * Formats a command title.
	 */
	title(message: string) {
		//
	}

	/**
	 * Formats a section title.
	 */
	section(message: string) {
		//
	}

	/**
	 * Formats a list.
	 */
	listing(elements: any[]) {
		//
	}

	/**
	 * Formats a command comment.
	 */
	comment(message: string | string[]) {
		this.writer.block(message, undefined, undefined, '<fg=default;bg=default> // </>', false, false)
	}

	/**
	 * Formats a success result bar.
	 */
	success(message: string) {
		this.writer.writeln(this.style.success(message))
	}

	/**
	 * Formats an error result bar.
	 */
	error(message: string) {
		this.writer.block(this.style.error(message), 'ERROR', undefined, ' ', true)
	}

	/**
	 * Formats an warning result bar.
	 */
	warning(message: string) {
		this.writer.writeln(this.style.warning(message))
		// this.block(message, 'WARNING', 'fg=black;bg=yellow', ' ', true)
	}

	/**
	 * Formats a note admonition.
	 */
	note(message: string) {
		this.writer.writeln(this.style.note(message))
		// this.block(message, 'NOTE', 'fg=yellow', ' ! ')
	}

	/**
	 * Formats a caution admonition.
	 */
	caution(message: string) {
		this.writer.writeln(this.style.caution(message))
		// this.block(message, 'CAUTION', 'fg=white;bg=red', ' ! ', true)
	}

	/**
	 * Display a table on the console.
	 */
	table(rows: object[], columns?: string[], configure?: (table: Table) => void) {
		const table = new Table(this, this.style.getColor())
		table.setHeaders(columns)
		table.setRows(rows)

		if (configure) {
			configure(table)
		}

		table.render()
	}

	/**
	 * Display a set of new lines.
	 */
	newLine(count: number = 1) {
		this.writer.newLine(count)
	}

	/**
	 * Ask the user for a question.
	 */
	async ask(question: string) {
		return new Question().ask(question)
	}

	/**
	 * Ask a user for a question.
	 */
	async askQuestion(question: Question) {
		throw new Error('Not yet implemented.')
	}

	/**
	 * Ask the user if they really wanna do it.
	 */
	async confirm(question: string, defaultValue: boolean = true): Promise<boolean> {
		throw new Error('Not yet implemented.')
	}

	/**
	 * Start a new progress bar
	 */
	progressBar(): ProgressBar {
		return new ProgressBar(this, this.writer.getTerminal())
	}
}
