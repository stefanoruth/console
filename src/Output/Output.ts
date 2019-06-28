import { ColorName, Formatter } from './Style'
import { ProgressBar } from './ProgressBar'
import { Table } from './Table'
import { Writer } from './Writer'
import { Verbosity } from './Verbosity'
import { Terminal } from './Terminal'
import { HiddenQuestion, ConfirmationQuestion, ChoiceQuestion, ConfirmToProceed, Question } from './Question'

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
	 * Asks a choice question.
	 */
	async choice(question: string, choices: string[]) {
		return new ChoiceQuestion(this, this.terminal).choose(question, choices)
	}

	async confirmToProceed(warning?: string) {
		return new ConfirmToProceed(this, this.terminal).confirm(warning)
	}

	/**
	 * Start a new progress bar
	 */
	progressBar(): ProgressBar {
		return new ProgressBar(this, this.terminal)
	}
}
