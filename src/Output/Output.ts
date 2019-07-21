import { ColorName, Formatter } from './Style'
import { ProgressBar } from './ProgressBar'
import { Table } from './Table'
import { Writer } from './Writer'
import { Verbosity } from './Verbosity'
import { Terminal } from './Terminal'
import { HiddenQuestion, ConfirmationQuestion, ConfirmToProceed, Question } from './Question'
import { ErrorHandler } from './ErrorHandler'

export class Output {
	protected verbosity: Verbosity = Verbosity.normal

	constructor(
		protected terminal: Terminal,
		protected writer: Writer = new Writer(terminal),
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
		this.writer.setVerbosity(level)

		return this
	}

	/**
	 * Writes a string of text on the current line in console.
	 */
	raw(message: string | string[]) {
		return this.writer.write(message)
	}

	/**
	 * Write a line to the console.
	 */
	line(message: string, newLine: boolean = true, color?: ColorName) {
		if (color) {
			message = this.style.format(message, { text: color })
		}

		return this.writer.write(message, newLine)
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
	 * Format text info.
	 */
	info(message: string) {
		return this.writer.writeln(this.style.info(message))
	}

	/**
	 * Formats a command comment.
	 */
	comment(message: string | string[]) {
		return this.writer.writeln(message)
	}

	/**
	 * Formats a success result bar.
	 */
	success(message: string) {
		return this.writer.writeln(this.style.success(message))
	}

	/**
	 * Formats an error result bar.
	 */
	error(message: string) {
		return this.writer.writeln(this.style.error(message))
	}

	/**
	 * Formats an warning result bar.
	 */
	warning(message: string) {
		return this.writer.writeln(this.style.warning(message))
	}

	/**
	 * Formats a note admonition.
	 */
	note(message: string) {
		return this.writer.writeln(this.style.note(message))
	}

	/**
	 * Formats a caution admonition.
	 */
	caution(message: string) {
		return this.writer.writeln(this.style.caution(message))
	}

	/**
	 * Format exceptions.
	 */
	renderException() {
		return new ErrorHandler(this)
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

		return table.render()
	}

	/**
	 * Display a set of new lines.
	 */
	newLine(count: number = 1) {
		return this.writer.newLine(count)
	}

	/**
	 * Asks a question.
	 */
	async ask(question: string) {
		return new Question(this, this.terminal).ask(question)
	}

	/**
	 * Asks a question with the user input hidden.
	 */
	async askHidden(question: string) {
		return new HiddenQuestion(this, this.terminal).ask(question)
	}

	/**
	 * Asks for confirmation.
	 */
	async confirm(question: string): Promise<boolean> {
		return new ConfirmationQuestion(this, this.terminal).confirm(question)
	}

	/**
	 * Asks for confirmation to proceed.
	 */
	async confirmToProceed(warning?: string) {
		return new ConfirmToProceed(this, this.terminal).confirm(warning)
	}

	/**
	 * Start a new progress bar
	 */
	progressBar(): ProgressBar {
		return new ProgressBar(this, this.terminal)
	}

	/**
	 * Get output formatter.
	 */
	getStyle(): Formatter {
		return this.style
	}
}
