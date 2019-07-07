import { Output } from './Output'
import { Argument } from '../Input/Argument'
import { Application } from '../Application'
import { Command } from '../Commands/Command'
import { Option } from '../Input/Option'
import { Signature } from '../Input/Signature'
import { ColorName } from './Style/Color'
import { OutputFormatter } from './OutputFormatter'
import { extractNamespace } from '../helpers'
import { Formatter } from './Style/Formatter'

export interface DescriptorOptions {
	totalWidth?: number
	isArray?: boolean
}

export class Descriptor {
	constructor(protected output: Output, protected style: Formatter = new Formatter()) {}

	/**
	 * Describes an object if supported.
	 */
	describe(object: any, options: DescriptorOptions = {}) {
		switch (true) {
			case object instanceof Argument:
				this.describeArgument(object, options)
				break
			case object instanceof Option:
				this.describeOption(object, options)
				break
			case object instanceof Signature:
				this.describeSignature(object, options)
				break
			case object instanceof Command:
				this.describeCommand(object, options)
				break
			case object instanceof Application:
				this.describeApplication(object, options)
				break
			default:
				throw new Error(`Object of type "${object.constructor.name}" is not describable.`)
		}

		return this
	}

	/**
	 * Writes content to output.
	 */
	protected write(content: string, color?: ColorName) {
		this.output.line(content, false, color)
	}

	/**
	 * Describes an Argument instance.
	 */
	protected describeArgument(argument: Argument, options: DescriptorOptions = {}): void {
		let defaultValue = ''
		const argumentDefault = argument.getDefault()
		if (argumentDefault && (!(argumentDefault instanceof Array) || argumentDefault.length)) {
			defaultValue = this.style.comment(` [default: ${this.formatDefaultValue(argumentDefault)}]`)
		}

		const totalWidth = options.totalWidth || argument.getName().length
		let spacingWidth = totalWidth - argument.getName().length

		if (spacingWidth === 0) {
			spacingWidth = 1
		}

		const line: string[] = []
		line.push('  ' + this.style.success(argument.getName()))
		line.push(' '.repeat(spacingWidth))
		// + 4 = 2 spaces before <info>, 2 spaces after </info>
		line.push(argument.getDescription().replace(/\s*[\r\n]\s*/g, '\n' + ' '.repeat(totalWidth + 4)))
		line.push(defaultValue)
		this.write(line.join('').trimRight())
	}

	/**
	 * Describes an Option instance.
	 */
	protected describeOption(option: Option, options: DescriptorOptions = {}): void {
		let defaultValue = ''

		const optionValue = option.getDefault()
		if (
			(option.acceptValue() && optionValue && !(optionValue instanceof Array)) ||
			(optionValue && optionValue.length)
		) {
			defaultValue = this.style.comment(`[default: ${this.formatDefaultValue(optionValue)}]`)
		}

		let value = ''
		if (option.acceptValue()) {
			value = '=' + option.getName().toUpperCase()
			if (option.isValueOptional()) {
				value = '[' + value + ']'
			}
		}

		const totalWidth = options.totalWidth || this.calculateTotalWidthForOptions([option])

		const shortcut = option.getShortcut() ? `-${option.getShortcut()}, ` : '    '
		const name = `--${option.getName()}${value}`

		const synopsis = shortcut + name

		const spacingWidth = totalWidth - synopsis.length

		const line: string[] = []
		line.push('  ' + this.style.success(synopsis))
		line.push(' '.repeat(spacingWidth + 2))
		// + 4 = 2 spaces before <info>, 2 spaces after </info>
		line.push(option.getDescription().replace(/\s*[\r\n]\s*/g, '\n' + ' '.repeat(totalWidth + 4)))
		line.push(defaultValue)
		line.push(options.isArray ? this.style.comment(' (multiple values allowed)') : '')

		this.write(line.join('').trimRight())
	}

	/**
	 * Describes an Signature instance.
	 */
	protected describeSignature(signature: Signature, options: DescriptorOptions = {}): void {
		let totalWidth = this.calculateTotalWidthForOptions(signature.getOptions())

		signature.getArguments().forEach(argument => {
			totalWidth = Math.max.apply(null, [totalWidth, argument.getName().length])
		})

		if (signature.getArguments().length) {
			this.write('Arguments:\n', 'yellow')

			signature.getArguments().forEach(argument => {
				this.describeArgument(argument, { totalWidth })
				this.write('\n')
			})
		}

		if (signature.getArguments().length && signature.getOptions().length) {
			this.write('\n')
		}

		if (signature.getOptions().length) {
			const laterOptions: Option[] = []
			this.write(this.style.info('Options:'))

			signature.getOptions().forEach(option => {
				const shortcut = option.getShortcut()

				if (shortcut && shortcut.length > 1) {
					laterOptions.push(option)
					return
				}
				this.write('\n')
				this.describeOption(option, { totalWidth })
			})

			laterOptions.forEach(option => {
				this.write('\n')
				this.describeOption(option, { totalWidth })
			})
		}
	}

	/**
	 * Describes a Command instance.
	 */
	protected describeCommand(command: Command, options: DescriptorOptions = {}): void {
		const getSynopsis = (short: boolean = false) => {
			const key = short ? 'short' : 'long'

			return `${command.getName()} ${command.getSignature().getSynopsis(short)}`.trim()
		}

		const synopsis = {
			short: getSynopsis(true),
			long: getSynopsis(false),
		}

		command.getSignature().addOptions(
			command
				.getApplication()
				.getSignature()
				.getOptions()
		)

		const description = command.getDescription()
		if (description) {
			this.write('Description:\n', 'yellow')
			this.write('  ' + description + '\n\n')
		}

		this.write('Usage:', 'yellow')
		const usages: string[] = [synopsis.short]
		usages.forEach(usage => {
			this.write('\n  ' + OutputFormatter.escape(usage))
		})

		this.write('\n')
		const signature: Signature = command.getSignature()
		if (signature.getOptions().length || signature.getArguments().length) {
			this.write('\n')
			this.describeSignature(signature, options)
			this.write('\n')
		}

		const help = command.getHelp().length ? command.getHelp() : command.getDescription()
		if (help && help !== description) {
			this.write('\nHelp:\n', 'yellow')
			this.write('  ' + help.replace(/\n/g, '\n  '))
			this.write('\n')
		}
	}

	/**
	 * Describes an Application instance.
	 */
	protected describeApplication(application: Application, options: DescriptorOptions = {}): void {
		const commands = application.getCommands()
		const columnWidth = this.getColumnWidth(commands)
		const namespaces: Array<{ namespace: string; commands: Command[] }> = []

		commands.forEach(command => {
			const namespace: string = extractNamespace(command.getName())

			const space = namespaces.find(value => value.namespace === namespace)

			if (space === undefined) {
				namespaces.push({
					namespace,
					commands: [command],
				})
			} else {
				space.commands.push(command)
			}
		})

		namespaces.sort((a, b) => (a.namespace > b.namespace ? 1 : -1))

		this.write(`${application.getName()} ${this.style.success(application.getVersion() || '0.1.0')}\n`)

		this.write(this.style.info('\nUsage:\n'))
		this.write(`  command [options] [arguments]\n\n`)

		this.describeSignature(new Signature(application.getSignature().getOptions()))

		this.write('\n\n')

		this.write(this.style.info('Available commands:\n'))

		for (const item of namespaces) {
			if (item.namespace.length > 0) {
				this.write(` ${this.style.info(item.namespace)}\n`)
			}

			item.commands.sort((a, b) => (a.getName() > b.getName() ? 1 : -1))

			for (const command of item.commands) {
				const spacingWidth = columnWidth - command.getName().length

				this.write(
					'  ' + this.style.success(command.getName()) + ' '.repeat(spacingWidth) + command.getDescription() + '\n'
				)
			}
		}
	}

	/**
	 * Formats input option/argument default value.
	 */
	protected formatDefaultValue(defaultValue: any): string {
		if (defaultValue === Infinity) {
			return 'Infinity'
		}

		if (typeof defaultValue === 'string') {
			defaultValue = OutputFormatter.escape(defaultValue)
		} else if (defaultValue instanceof Array) {
			defaultValue.forEach((value, key) => {
				if (typeof value === 'string') {
					defaultValue[key] = OutputFormatter.escape(value)
				}
			})
		}

		defaultValue = JSON.stringify(defaultValue)

		// return str_replace('\\\\', '\\', json_encode($default, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
		return defaultValue
	}

	/**
	 * Calculate max column width
	 */
	protected getColumnWidth(commands: Command[]): number {
		const widths: number[] = [0]

		commands.forEach(command => {
			widths.push(command.getName().length)
		})

		return Math.max.apply(null, widths) + 2
	}

	/**
	 * Calculate total width for options.
	 */
	protected calculateTotalWidthForOptions(options: Option[] = []): number {
		let totalWidth = 0

		options.forEach(option => {
			// "-" + shortcut + ", --" + name

			const shortcut = option.getShortcut() || ''

			let nameLength = 1 + Math.max.apply(null, [shortcut.length]) + 4 + option.getName().length

			if (option.acceptValue()) {
				let valueLength = 1 + option.getName().length // = + value
				valueLength += option.isValueOptional() ? 2 : 0 // [ + ]
				nameLength += valueLength
			}

			totalWidth = Math.max.apply(null, [totalWidth, nameLength])
		})

		return totalWidth
	}
}
