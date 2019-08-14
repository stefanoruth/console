import fs from 'fs'
import path from 'path'
import { Command } from './Command'
import { CommandNotFoundException } from '../Exceptions'

export class CommandLoader {
	protected commands: { [k: string]: Command } = {}

	/**
	 * Loads a directory of commands.
	 */
	async load(dir: string) {
		const files = fs.readdirSync(dir).map(file => path.join(dir, file))

		for (const file of files) {
			const imports = await import(file)

			for (const module of Object.values(imports)) {
				if (module.prototype instanceof Command) {
					console.log('RENDER ME')

					const command: Command = new f()
					const commandName = command.getName()

					if (this.has(commandName)) {
						throw new Error(`Command with name is allready loaded: ${commandName}`)
					}

					this.commands[commandName] = command
					loaded[commandName] = command
				}
			}
		}

		console.log(this.commands)

		return loaded
	}

	/**
	 * Fetches a command.
	 */
	get(name: string): Command {
		if (!this.has(name)) {
			throw new CommandNotFoundException(`Command "${name}" is not defined.`)
		}

		return this.commands[name]
	}

	/**
	 * Checks if a command exists.
	 */
	has(name: string): boolean {
		if (typeof this.commands[name] !== 'undefined') {
			return true
		}

		return false
	}

	/**
	 * All registered command names
	 */
	getNames(): string[] {
		return Object.keys(this.commands)
	}
}
