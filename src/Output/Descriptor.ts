import { Output } from './Output'
import { Argument } from '../Command/Argument'
import { Application } from '../Application'
import { Command } from '../Command/Command'
import { Option } from '../Command/Option'
import { Signature } from '../Command/Signature'
import { groupBy, Dictionary } from 'lodash'
import { CliColor } from './CliColor'

// tslint:disable-next-line:no-empty-interface
export interface DescriptorOptions {
	//
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
				this.describeInputArgument(object, options)
				break
			case object instanceof Option:
				this.describeInputOption(object, options)
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
	 * Describes an InputArgument instance.
	 */
	protected describeInputArgument(argument: Argument, options: DescriptorOptions = {}): string {
		return 'argument'
	}

	/**
	 * Describes an InputOption instance.
	 */
	protected describeInputOption(option: Option, options: DescriptorOptions = {}): string {
		//
		return 'option'
	}

	/**
	 * Describes an Signature instance.
	 */
	protected describeSignature(signature: Signature, options: DescriptorOptions = {}): void {
		let totalWidth = this.calculateTotalWidthForOptions(signature.getOptions())

		signature.getArguments().forEach(argument => {
			totalWidth = Math.max.apply(null, totalWidth, argument.getName().length)
		})

		// if (signature.getArguments().length) {
		//     $this -> writeText('<comment>Arguments:</comment>', $options);
		//     $this -> writeText("\n");
		//     foreach($definition -> getArguments() as $argument) {
		//         $this -> describeInputArgument($argument, array_merge($options, ['total_width' => $totalWidth]));
		//         $this -> writeText("\n");
		//     }
		// }
		return 'signature'
	}

	/**
	 * Describes a Command instance.
	 */
	protected describeCommand(command: Command, options: DescriptorOptions = {}): string {
		//
		return 'command'
	}

	/**
	 * Describes an Application instance.
	 */
	protected describeApplication(application: Application, options: DescriptorOptions = {}): string {
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
		this.write(`  command [options] [arguments]\n`)

		this.write(this.color.apply('\nOptions:\n', { text: 'yellow' }))

		this.write(this.color.apply('\nAvailable commands:\n', { text: 'yellow' }))

		for (const item of namespaces) {
			if (item.namespace.length > 0) {
				this.write(` ${this.color.apply(item.namespace, { text: 'yellow' })}\n`)
			}

			for (const command of item.commands) {
				const spacing = columnWidth - command.getName().length

				this.write(
					`  ${this.color.apply(command.getName(), { text: 'green' })}${' '.repeat(
						spacing
					)}  ${command.getDescription()}\n`
				)
			}
		}

		return 'application'
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

		return Math.max.apply(null, widths)
	}

	/**
	 * Calculate total width for options.
	 */
	protected calculateTotalWidthForOptions(options: Option[] = []): number {
		let totalWidth = 0

		for (const key in options) {
			if (options.hasOwnProperty(key)) {
				const option = (options as any)[key]
				// "-" + shortcut + ", --" + name

				let nameLength = 1 + Math.max.apply(null, option.getShortcut()) + 4 + option.getName()

				if (option.acceptValue()) {
					let valueLength = 1 + option.getName().length // = + value
					valueLength += option.isValueOptional() ? 2 : 0 // [ + ]
					nameLength += valueLength
				}

				totalWidth = Math.max.apply(null, nameLength)
			}
		}

		return totalWidth
	}
}
