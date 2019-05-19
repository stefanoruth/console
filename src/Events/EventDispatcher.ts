export class EventDispatcher {
	protected listeners: any[] = []

	addListener(listener: (event: object) => void) {
		this.listeners.push(listener)
	}

	dispatch(event: object) {
		this.listeners.forEach(listener => {
			listener(event)
		})
	}
}
