export class Output {
	static VERBOSITY_QUIET = 16
	static VERBOSITY_NORMAL = 32
	static VERBOSITY_VERBOSE = 64
	static VERBOSITY_VERY_VERBOSE = 128
	static VERBOSITY_DEBUG = 256
	static OUTPUT_NORMAL = 1
	static OUTPUT_RAW = 2
	static OUTPUT_PLAIN = 4

	/**
	 * Writes a message to the output.
	 */
	write(messages: string | string[], newline: boolean = false, options: number = Output.OUTPUT_NORMAL) {
		if (!(messages instanceof Array)) {
			messages = [messages]
		}

		for (const message of messages) {
			// switch (type) {
			// 	case value:
			// 		break
			// 	default:
			// 		break
			// }
			// this.doWrite(message, newline)
			process.stdout.write(message + '\n')
		}
		// $types = self:: OUTPUT_NORMAL | self:: OUTPUT_RAW | self:: OUTPUT_PLAIN;
		// $type = $types & $options ?: self:: OUTPUT_NORMAL;
		// $verbosities = self:: VERBOSITY_QUIET | self:: VERBOSITY_NORMAL | self:: VERBOSITY_VERBOSE | self:: VERBOSITY_VERY_VERBOSE | self:: VERBOSITY_DEBUG;
		// $verbosity = $verbosities & $options ?: self:: VERBOSITY_NORMAL;
		// if ($verbosity > $this -> getVerbosity()) {
		//     return;
		// }
		// foreach($messages as $message) {
		//     switch ($type) {
		//         case OutputInterface:: OUTPUT_NORMAL:
		//             $message = $this -> formatter -> format($message);
		//             break;
		//         case OutputInterface:: OUTPUT_RAW:
		//             break;
		//         case OutputInterface:: OUTPUT_PLAIN:
		//             $message = strip_tags($this -> formatter -> format($message));
		//             break;
		//     }
		//     $this -> doWrite($message, $newline);
		// }
	}

	/**
	 * Writes a message to the output and adds a newline at the end.
	 */
	writeln(messages: string | string[], options: number = Output.OUTPUT_NORMAL) {
		this.write(messages, true, options)
	}
}
