#!/usr/bin/env node

import { Application } from './Application'
import * as path from 'path'
import { InspireCommand } from './Commands/InpireCommand'

const packageJson = require(path.resolve(__dirname, '../package.json'))

new Application(packageJson.name, packageJson.version).register([new InspireCommand()]).run()
