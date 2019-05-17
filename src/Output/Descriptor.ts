import { Output } from './Output'
import { Argument } from '../Input/Argument'
import { Application } from '../Application'
import { Command } from '../Command/Command'
import { Option } from '../Input/Option'
import { Signature } from '../Input/Signature'
import { CliColor } from './CliColor'
import { OutputFormatter } from './OutputFormatter'

export interface DescriptorOptions {
	totalWidth?: number
	isArray?: boolean
}

export class Descriptor {
	protected output?: Output
	protected color: CliColor = new CliColor()

	/**
	 * Describes an object if supported.
	 */
	describe(output: Output, object: any, options: DescriptorOptions = {}) {
		this.output = output

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
	}

	/**
	 * Writes content to output.
	 */
	protected write(content: string) {
		if (!this.output) {
			throw new Error('Output has not yet been set.')
		}
		this.output.writer.write(content, false)
	}

	/**
	 * Describes an Argument instance.
	 */
	protected describeArgument(argument: Argument, options: DescriptorOptions = {}): void {
		const defaultValue = ''
		//         if (null !== argument.getDefault() && (!\is_array(argument.getDefault()) || \count(argument.getDefault()))) {
		//             defaultValue = sprintf('<comment> [default: %s]</comment>', this.formatDefaultValue(argument.getDefault()));
		// }

		const totalWidth = options.totalWidth || argument.getName().length
		const spacingWidth = totalWidth - argument.getName().length

		const line: string[] = []
		line.push('  ' + this.color.apply(argument.getName(), { text: 'green' }))
		line.push(' '.repeat(spacingWidth))
		// + 4 = 2 spaces before <info>, 2 spaces after </info>
		line.push(argument.getDescription().replace(/\s*[\r\n]\s*/g, '\n' + ' '.repeat(totalWidth + 4)))
		line.push(defaultValue)
		this.write(line.join(''))
	}

	/**
	 * Describes an Option instance.
	 */
	protected describeOption(option: Option, options: DescriptorOptions = {}): void {
		const defaultValue = ''
		//     if (option.acceptValue() && null !== option.getDefault() && (!\is_array(option.getDefault()) || \count(option.getDefault()))) {
		//         default = sprintf('<comment> [default: %s]</comment>', this.formatDefaultValue(option.getDefault()));
		// }

		const value = ''
		// if (option.acceptValue()) {
		//     value = '='.strtoupper(option.getName());
		//     if (option.isValueOptional()) {
		//         value = '['.value.']';
		//     }
		// }

		const totalWidth = options.totalWidth || this.calculateTotalWidthForOptions([option])

		const shortcut = option.getShortcut() ? `-${option.getShortcut()}, ` : '    '
		const name = `--${option.getName()}${value}`

		const synopsis = shortcut + name

		const spacingWidth = totalWidth - synopsis.length

		const line: string[] = []
		line.push('  ' + this.color.apply(synopsis, { text: 'green' }))
		line.push(' '.repeat(spacingWidth + 2))
		// + 4 = 2 spaces before <info>, 2 spaces after </info>
		line.push(option.getDescription().replace(/\s*[\r\n]\s*/g, '\n' + ' '.repeat(totalWidth + 4)))
		line.push(defaultValue)
		line.push(options.isArray ? '<comment> (multiple values allowed)</comment>' : '')

		this.write(line.join(''))
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
			this.write(this.color.apply('Arguments:\n', { text: 'yellow' }))

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
			this.write(this.color.apply('Options:', { text: 'yellow' }))

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
		// command.getSynopsis(true);
		// command.getSynopsis(false);
		// command.mergeApplicationDefinition(false);

		const description = command.getDescription()
		if (description) {
			this.write('<comment>Description:</comment>\n')
			this.write('  ' + description + '\n\n')
		}

		this.write('<comment>Usage:</comment>')
		// [command.getUsages()].forEach(usage => {
		//     this.write('\n  ' + OutputFormatter.escape(usage))
		// });
		// foreach(array_merge([command.getSynopsis(true)], command.getAliases(), command.getUsages()) as usage) {

		// }
		this.write('\n')
		// const definition = command.getNativeDefinition();
		// if (definition.getOptions() || definition.getArguments()) {
		//     this.writeText("\n");
		//     this.describeInputDefinition(definition, options);
		//     this.writeText("\n");
		// }
		// help = command.getProcessedHelp();
		// if (help && help !== description) {
		//     this.writeText("\n");
		//     this.writeText('<comment>Help:</comment>', options);
		//     this.writeText("\n");
		//     this.writeText('  '.str_replace("\n", "\n  ", help), options);
		//     this.writeText("\n");
		// }
	}

	/**
	 * Describes an Application instance.
	 */
	protected describeApplication(application: Application, options: DescriptorOptions = {}): void {
		const commands = application.getCommands()
		const columnWidth = this.getColumnWidth(commands)
		const namespaces: Array<{ namespace: string; commands: Command[] }> = []

		commands.forEach(command => {
			const namespace: string = command.getNamespace()

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

		this.write(`${application.getName()} ${this.color.apply(application.getVersion() || '0.1.0', { text: 'green' })}\n`)

		this.write(this.color.apply('\nUsage:\n', { text: 'yellow' }))
		this.write(`  command [options] [arguments]\n\n`)

		this.describeSignature(new Signature(application.getSignature().getOptions()))

		this.write('\n\n')

		this.write(this.color.apply('Available commands:\n', { text: 'yellow' }))

		for (const item of namespaces) {
			if (item.namespace.length > 0) {
				this.write(` ${this.color.apply(item.namespace, { text: 'yellow' })}\n`)
			}

			for (const command of item.commands) {
				const spacingWidth = columnWidth - command.getName().length

				this.write(
					'  ' +
						this.color.apply(command.getName(), { text: 'green' }) +
						' '.repeat(spacingWidth) +
						command.getDescription() +
						'\n'
				)
			}
		}
	}

	/**
	 * Calculate max column width
	 */
	protected getColumnWidth(commands: Array<Command | string>): number {
		const widths: number[] = [0]

		commands.forEach(command => {
			if (command instanceof Command) {
				widths.push(command.getName().length)
			} else {
				widths.push(command.length)
			}
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

			const nameLength = 1 + Math.max.apply(null, [option.getShortcut().length]) + 4 + option.getName().length

			// if (option.acceptValue()) {
			//     let valueLength = 1 + option.getName().length // = + value
			//     valueLength += option.isValueOptional() ? 2 : 0 // [ + ]
			//     nameLength += valueLength
			// }

			totalWidth = Math.max.apply(null, [totalWidth, nameLength])
		})

		return totalWidth
	}
}
