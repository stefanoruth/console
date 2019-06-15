#!/usr/bin/env node

import { Application } from 'kodo-console'
import { ErrorCommand } from './ErrorCommand'
import { ProgressBarCommand } from './ProgressBarCommand'
import { TableCommand } from './TableCommand'
import { TextCommand } from './TextCommand'

new Application('Kodo Console')
	.register([new ErrorCommand(), new ProgressBarCommand(), new TableCommand(), new TextCommand()])
	.run()
