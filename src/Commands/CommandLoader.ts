import fs from 'fs'
import path from 'path'
import { Command } from './Command'
import { CommandNotFoundException } from '../Exceptions'

export class CommandLoader {
	/**
	 * AutoLoaded Commands.
	 */
	protected commands: Command[] = []

	/**
	 * Format input path
	 */
	protected formatPath(dir: string): string {
		// Relative
		if (dir.startsWith('.')) {
			return path.join(process.cwd(), dir)
		}

		return dir
	}

	/**
	 * List all files in a dir recursively.
	 */
	protected listFilesInDir(dir: string): string[] {
		const files: string[] = []
		const dirFiles = fs.readdirSync(dir).map(file => path.join(dir, file))

		for (const file of dirFiles) {
			if (file.includes('.d.ts') || file.includes('.js.map')) {
				continue
			}

			if (fs.statSync(file).isDirectory()) {
				files.push(...this.listFilesInDir(file))
			} else {
				files.push(file)
			}
		}

		return files
	}

	/**
	 * Loads a directory of commands.
	 */
	async load(dir: string) {
		dir = this.formatPath(dir)
		const files = this.listFilesInDir(dir)

		for (const file of files) {
			const importedModules = await import(file)

			Object.values(importedModules).forEach((m: any) => {
				if (!(m.prototype instanceof Command)) {
					return // If module is not a command don't register it.
				}

				this.commands.push(new m())
			})
		}

		return this.commands
	}

	/**
	 * All registered command names
	 */
	getNames(): string[] {
		return this.commands.map(c => c.getName())
	}
}
