#!/usr/bin/env node

import { Application } from './Application'
import * as path from 'path'

const packageJson = require(path.resolve(__dirname, '../package.json'))

new Application(packageJson.name, packageJson.version).run()
