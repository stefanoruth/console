import rl from 'readline'
import { Color, CliColor } from './CliColor'
import { ProgressBar } from './ProgressBar'
import { Table } from './Table'

export class Output {
	static VERBOSITY_QUIET = 16
	static VERBOSITY_NORMAL = 32
	static VERBOSITY_VERBOSE = 64
	static VERBOSITY_VERY_VERBOSE = 128
	static VERBOSITY_DEBUG = 256

	static OUTPUT_NORMAL = 1
	static OUTPUT_RAW = 2
	static OUTPUT_PLAIN = 4

	protected progressBar?: ProgressBar

	constructor(protected color: CliColor = new CliColor()) {}

	/**
	 * Writes a message to the output.
	 */
	write(messages: string | string[], newline: boolean = false) {
		if (!(messages instanceof Array)) {
			messages = [messages]
		}

		for (const message of messages) {
			process.stdout.write(message)

			if (newline) {
				process.stdout.write('\n')
			}
		}
	}

	/**
	 * Writes a message to the output and adds a newline at the end.
	 */
	writeln(messages: string | string[]) {
		this.write(messages, true)
	}

	/**
	 * Write a line to the console.
	 */
	line(message: string, newLine: boolean = true, color?: Color) {
		this.write(this.color.apply(message, { text: color }), newLine)
	}

	/**
	 * Formats a message as a block of text.
	 *
	 * messages The message to write in the block
	 * type     The block type (added in [] on first line)
	 * style    The style to apply to the whole block
	 * prefix   The prefix for the block
	 * padding  Whether to add vertical padding
	 * escape   Whether to escape the message
	 */
	block(
		messages: string | string[],
		type?: string,
		style?: string,
		prefix: string = ' ',
		padding: boolean = false,
		escape: boolean = true
	) {
		// $messages = \is_array($messages) ? array_values($messages) : [$messages];
		// $this -> autoPrependBlock();
		// $this -> writeln($this -> createBlock($messages, $type, $style, $prefix, $padding, $escape));
		// $this -> newLine();

		// this.writeln
		this.newLine()
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
		this.block(message, undefined, undefined, '<fg=default;bg=default> // </>', false, false)
	}

	/**
	 * Formats a success result bar.
	 */
	success(message: string) {
		this.writeln(this.color.apply(message, { text: 'green' }))
	}

	/**
	 * Formats an error result bar.
	 */
	error(message: string) {
		this.writeln(this.color.apply(message, { text: 'white', bg: 'red' }))
		// this.block(message, 'ERROR', 'fg=white;bg=red', ' ', true)
	}

	/**
	 * Formats an warning result bar.
	 */
	warning(message: string) {
		this.writeln(this.color.apply(message, { text: 'black', bg: 'yellow' }))
		// this.block(message, 'WARNING', 'fg=black;bg=yellow', ' ', true)
	}

	/**
	 * Formats a note admonition.
	 */
	note(message: string) {
		this.writeln(this.color.apply(message, { text: 'yellow' }))
		// this.block(message, 'NOTE', 'fg=yellow', ' ! ')
	}

	/**
	 * Formats a caution admonition.
	 */
	caution(message: string) {
		this.writeln(this.color.apply(message, { text: 'white', bg: 'red' }))
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
		this.write('\n'.repeat(count))
	}

	/**
	 * Ask the user for a question.
	 */
	ask(question: string): Promise<string> {
		return new Promise(resolve => {
			const r = rl.createInterface({
				input: process.stdin,
				output: process.stdout,
			})

			r.question(question + '\n', (answer: string) => {
				r.close()
				resolve(answer)
			})
		})
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
	progressStart(max: number = 0) {
		if (typeof this.progressBar !== 'undefined') {
			throw new Error('There is already a progressbar running.')
		}

		this.progressBar = new ProgressBar(this, max)
		this.progressBar.start()
	}

	/**
	 * Advance progress.
	 */
	progressAdvance(step: number = 1) {
		this.getProgressBar().advance(step)
	}

	/**
	 * Finish the progressbar.
	 */
	progressFinish() {
		this.getProgressBar().finish()
		this.newLine(2)
		this.progressBar = undefined
	}

	/**
	 * Fetch the current running progressbar.
	 */
	protected getProgressBar(): ProgressBar {
		if (typeof this.progressBar === 'undefined') {
			throw new Error('The ProgressBar is not started.')
		}
		return this.progressBar
	}
}
