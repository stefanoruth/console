import rl from 'readline'
import { Color, CliColor } from './CliColor'
import { ProgressBar } from './ProgressBar'
import { Table } from './Table'
import { Question } from './Question/Question'
import { Writer } from './Writer'

export class Output {
	constructor(public writer: Writer = new Writer(), protected color: CliColor = new CliColor()) {}

	/**
	 * Write a line to the console.
	 */
	line(message: string, newLine: boolean = true, color?: Color) {
		this.writer.write(this.color.apply(message, { text: color }), newLine)
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
		this.writer.writeln(this.color.apply(message, { text: 'green' }))
	}

	/**
	 * Formats an error result bar.
	 */
	error(message: string) {
		this.writer.writeln(this.color.apply(message, { text: 'white', bg: 'red' }))
		// this.block(message, 'ERROR', 'fg=white;bg=red', ' ', true)
	}

	/**
	 * Formats an warning result bar.
	 */
	warning(message: string) {
		this.writer.writeln(this.color.apply(message, { text: 'black', bg: 'yellow' }))
		// this.block(message, 'WARNING', 'fg=black;bg=yellow', ' ', true)
	}

	/**
	 * Formats a note admonition.
	 */
	note(message: string) {
		this.writer.writeln(this.color.apply(message, { text: 'yellow' }))
		// this.block(message, 'NOTE', 'fg=yellow', ' ! ')
	}

	/**
	 * Formats a caution admonition.
	 */
	caution(message: string) {
		this.writer.writeln(this.color.apply(message, { text: 'white', bg: 'red' }))
		// this.block(message, 'CAUTION', 'fg=white;bg=red', ' ! ', true)
	}

	/**
	 * Display a table on the console.
	 */
	table(rows: object[], columns?: object) {
		const table = new Table(this)
		table.setHeaders(columns)
		table.setRows(rows)

		table.render()
		this.newLine()
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
	ask(question: string) {
		return new Question().ask(question)
	}

	askQuestion(question: Question) {
		//
	}

	/**
	 * Ask the user if they really wanna do it.
	 */
	confirm(question: string, defaultValue: boolean = true): Promise<boolean> {
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

	/**
	 * Start a new progress bar
	 */
	progressBar(max: number = 0): ProgressBar {
		const progressBar = new ProgressBar(this, max)

		progressBar.start()

		return progressBar
	}
}
