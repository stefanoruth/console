#!/usr/bin/env node

import * as path from 'path'
import { Application } from './Application'
import * as Commands from './Commands/test'
import { Command } from './Commands'

const testCommands: Command[] = Object.values(Commands).map(ExampleCommand => new ExampleCommand())
const packageJson = require(path.resolve(__dirname, '../package.json'))

new Application('Kodo Console', packageJson.version).register(testCommands).run()
