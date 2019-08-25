#!/usr/bin/env node

import { Application } from 'valon'
import { ErrorCommand } from './ErrorCommand'
import { ProgressBarCommand } from './ProgressBarCommand'
import { TableCommand } from './TableCommand'
import { TextCommand } from './TextCommand'
import { InputCommand } from './InputCommand'
import { QuestionCommand } from './QuestionCommand'

new Application()
	.register([
		new ErrorCommand(),
		new ProgressBarCommand(),
		new TableCommand(),
		new TextCommand(),
		new InputCommand(),
		new QuestionCommand(),
	])
	.run()
