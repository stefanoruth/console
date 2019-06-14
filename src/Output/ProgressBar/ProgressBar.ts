import { Output } from '../Output'
import { Verbosity } from '../Verbosity'
import { Terminal } from '../Terminal'
import { formatTime } from '../../helpers'
import { ProgressStyle } from './ProgressStyle'

export class ProgressBar {
	protected barWidth: number = 28
	protected barChar?: string
	protected emptyBarChar: string = '-'
	protected progressChar: string = '>'
	protected format?: string
	protected internalFormat?: string
	protected redrawFreq: number = 1
	protected step: number = 0
	protected startTime?: number
	protected stepWidth: number = 4
	protected percent: number = 0.0
	protected formatLineCount?: number
	protected messages: string[] = []
	protected firstRun: boolean = true
	protected max: number = 0
	protected style: ProgressStyle

	/**
	 * Build new progress bar.
	 */
	constructor(protected output: Output, protected terminal: Terminal, styleFormatter?: typeof ProgressStyle) {
		if (styleFormatter) {
			this.style = new styleFormatter(output, this)
		} else {
			this.style = new ProgressStyle(output, this)
		}
	}

	/**
	 * Starts the progress output.
	 */
	start(max?: number) {
		this.startTime = new Date().getTime()
		this.step = 0
		this.percent = 0.0

		if (max !== undefined) {
			this.setMaxSteps(max)
		}

		this.display()

		return this
	}

	/**
	 * Advances the progress output X steps.
	 */
	advance(step: number = 1) {
		this.setProgress(this.step + step)
	}

	/**
	 * Set the progress output X steps.
	 */
	setProgress(step: number) {
		if (this.startTime === undefined) {
			throw new Error('Progress bar need to be started first.')
		}

		if (this.max && step > this.max) {
			this.max = step
		} else if (step < 0) {
			step = 0
		}

		// Ensure we dont redraw to often.
		const prevPeriod = this.step / this.redrawFreq
		const currPeriod = step / this.redrawFreq
		// Change step
		this.step = step
		this.percent = this.max ? this.step / this.max : 0

		if (prevPeriod !== currPeriod || this.max === step) {
			this.display()
		}
	}

	/**
	 * Set max steps.
	 */
	setMaxSteps(max: number) {
		this.format = undefined
		this.max = Math.max.apply(null, [0, max])
		this.stepWidth = this.max ? this.max.toString().length : 4
	}

	/**
	 * Finishes the progress output.
	 */
	finish() {
		if (this.startTime === undefined) {
			throw new Error('Progress bar need to be started first.')
		}

		if (!this.max) {
			this.max = this.step
		}

		if (this.step === this.max && !this.overwrite) {
			// prevent double 100% output
			return
		}

		this.setProgress(this.max)
	}

	/**
	 * Outputs the current progress string.
	 */
	protected display(): void {
		if (this.output.getVerbosity() === Verbosity.quiet) {
			return
		}

		if (this.format === null) {
			this.setRealFormat(this.internalFormat || this.style.determineBestFormat())
		}

		this.overwrite(this.buildLine())
	}

	/**
	 * Removes the progress bar from the current line.
	 *
	 * This is useful if you wish to write some output
	 * while a progress bar is running.
	 * Call display() to show the progress bar again.
	 */
	protected clear() {
		this.terminal.clearLine()
		this.terminal.cursorReset()

		if (this.format === null) {
			this.setRealFormat(this.internalFormat || this.style.determineBestFormat())
		}

		this.overwrite('')
	}

	getMaxSteps() {
		return this.max
	}

	getProgress() {
		return this.step
	}

	getProgressPercent() {
		return this.percent
	}

	getStepWidth() {
		return this.stepWidth
	}

	getStartTime() {
		if (this.startTime === undefined) {
			throw new Error('Progress bar need to be started first.')
		}

		return this.startTime
	}

	protected getBarCharacter(): string {
		if (this.barChar === undefined) {
			return this.max ? '=' : this.emptyBarChar
		}
		return this.barChar
	}

	protected setRealFormat(format: string) {
		// try to use the _nomax variant if available
		if (!this.max) {
			//
		}
		// if (!$this -> max && null !== self:: getFormatDefinition($format.'_nomax')) {
		//     $this -> format = self:: getFormatDefinition($format.'_nomax');
		// } elseif(null !== self:: getFormatDefinition($format)) {
		//     $this -> format = self:: getFormatDefinition($format);
		// } else {
		//     $this -> format = $format;
		// }
		// $this -> formatLineCount = substr_count($this -> format, "\n");
	}

	/**
	 * Overwrites a previous message to the output.
	 */
	protected overwrite(message: string) {
		// if ($this -> overwrite) {
		//     if (!$this -> firstRun) {
		//         if ($this -> output instanceof ConsoleSectionOutput) {
		//             $lines = floor(Helper:: strlen($message) / $this -> terminal -> getWidth()) + $this -> formatLineCount + 1;
		//             $this -> output -> clear($lines);
		//         } else {
		//             // Erase previous lines
		//             if ($this -> formatLineCount > 0) {
		//                 $message = str_repeat("\x1B[1A\x1B[2K", $this -> formatLineCount).$message;
		//             }
		//             // Move the cursor to the beginning of the line and erase the line
		//             $message = "\x0D\x1B[2K$message";
		//         }
		//     }
		// } elseif($this -> step > 0) {
		//     $message = PHP_EOL.$message;
		// }
		// $this -> firstRun = false;
		// $this -> output -> write($message);
	}

	protected getFormatters() {
		return {
			bar: (): string => {
				const completeBars = Math.floor(
					this.getMaxSteps() > 0 ? this.getProgress() * this.barWidth : this.getProgress() % this.barWidth
				)
				let display = this.getBarCharacter().repeat(completeBars)

				if (completeBars < this.barWidth) {
					const emptyBar = this.barWidth - completeBars - this.progressChar.length
					display += this.progressChar + this.emptyBarChar.repeat(emptyBar)
				}

				return display
			},
			elapsed: (): string => {
				return `${new Date().getTime() - this.getStartTime()} secs`
			},
			remaining: (): string => {
				if (!this.max) {
					throw new Error('Unable to display the remaining time if the maximum number of steps is not set.')
				}

				let remaining = 0

				if (this.getProgress()) {
					remaining = Math.round(
						(new Date().getTime() / this.getProgress()) * (this.getMaxSteps() - this.getProgress())
					)
				}

				return formatTime(remaining)
			},
			estimated: (): string => {
				if (!this.getMaxSteps()) {
					throw new Error('Unable to display the estimated time if the maximum number of steps is not set.')
				}

				let estimated = 0

				if (this.getProgress()) {
					estimated = Math.round(new Date().getTime() - (this.getStartTime() / this.getProgress()) * this.getMaxSteps())
				}

				return formatTime(estimated)
			},
			memory: (): string => {
				return 'memory'
				// return Helper:: formatMemory(memory_get_usage(true));
			},
			current: (): string => {
				return this.getProgress()
					.toString()
					.padStart(this.getStepWidth(), ' ')
			},
			max: (): string => {
				return this.getMaxSteps().toString()
			},
			percent: (): string => {
				return Math.floor(this.getProgressPercent() * 100).toString()
			},
		}
	}

	protected buildLine(): string {
		return ''
		// $regex = "{%([a-z\-_]+)(?:\:([^%]+))?%}i";
		// $callback = function ($matches) {
		//     if ($formatter = $this:: getPlaceholderFormatterDefinition($matches[1])) {
		//         $text = $formatter($this, $this -> output);
		//     } elseif(isset($this -> messages[$matches[1]])) {
		//         $text = $this -> messages[$matches[1]];
		//     } else {
		//         return $matches[0];
		//     }
		//     if (isset($matches[2])) {
		//         $text = sprintf('%'.$matches[2], $text);
		//     }
		//     return $text;
		// };
		// $line = preg_replace_callback($regex, $callback, $this -> format);
		// // gets string length for each sub line with multiline format
		// $linesLength = array_map(function ($subLine) {
		//     return Helper:: strlenWithoutDecoration($this -> output -> getFormatter(), rtrim($subLine, "\r"));
		// }, explode("\n", $line));
		// $linesWidth = max($linesLength);
		// $terminalWidth = $this -> terminal -> getWidth();
		// if ($linesWidth <= $terminalWidth) {
		//     return $line;
		// }
		// $this -> setBarWidth($this -> barWidth - $linesWidth + $terminalWidth);
		// return preg_replace_callback($regex, $callback, $this -> format);
	}
}
