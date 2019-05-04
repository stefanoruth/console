#!/usr/bin/env node

import { Application } from './Application'
import { ListCommand } from './Commands/ListCommand'

new Application().register([new ListCommand()]).run()
