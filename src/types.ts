import { InputArgument } from './Input/InputArgument'
import { InputOption } from './Input/InputOption'

export type ExitCode = 0 | 1

export interface Signature {
	name: string
	arguments: { [k: string]: InputArgument }
	options: { [k: string]: InputOption }
}
