#!/usr/bin/env node

import * as path from 'path'
import { Application } from './Application'
import { DemoCommand } from './Commands/DemoCommand'
import { ErrorCommand } from './Commands/ErrorCommand'

const packageJson = require(path.resolve(__dirname, '../package.json'))

new Application('Kodo Console', packageJson.version).register([new DemoCommand(), new ErrorCommand()]).run()
