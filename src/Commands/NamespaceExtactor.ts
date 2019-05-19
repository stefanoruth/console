export class NamespaceExtactor {
	extract(commandName: string): string {
		const parts = commandName.split(':')

		if (parts.length < 2) {
			return ''
		}

		parts.pop()

		return parts.join(':')
	}
}
