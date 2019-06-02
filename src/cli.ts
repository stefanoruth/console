#!/usr/bin/env node

import * as path from 'path'
import { Application, Command, CommandStarting, CommandFinished } from './index'
import * as Commands from './Commands/test'

const testCommands: Command[] = Object.values(Commands).map(ExampleCommand => new ExampleCommand())
const packageJson = require(path.resolve(__dirname, '../package.json'))

Application.starting(app => {
	app.listen('*', event => {
		console.log('Event:', event.constructor.name)
	})
})

new Application('Kodo Console', packageJson.version).register(testCommands).run()
