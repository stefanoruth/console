#!/usr/bin/env node

import { Application } from './Application'
import { ListCommand } from './Commands/ListCommand'
import * as path from 'path'

const version = process.env.npm_package_version || require(path.resolve(__dirname, '../package.json')).version

console.log(process.env)

new Application('Kodo', version).run()
