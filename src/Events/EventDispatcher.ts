import * as EventCollection from './EventCollection'

export type EventName = keyof typeof EventCollection | '*'
export type EventListener = (event: object) => void

export class EventDispatcher {
	/**
	 * Registered listeners.
	 */
	protected listeners: { [event: string]: EventListener[] } = {}

	/**
	 * Add new listenener
	 */
	addListener(event: EventName, listener: EventListener) {
		if (!this.listeners[event]) {
			this.listeners[event] = []
		}

		this.listeners[event].push(listener)
	}

	/**
	 * Dispatch an event.
	 */
	dispatch(event: object): boolean {
		const eventName = event.constructor.name
		let listeners: EventListener[] = []

		if (this.listeners[eventName]) {
			listeners = listeners.concat(this.listeners[eventName])
		}

		if (this.listeners['*']) {
			listeners = listeners.concat(this.listeners['*'])
		}

		if (listeners.length === 0) {
			// In case no listerners has been registered, dont fire.
			return false
		}

		listeners.forEach(listener => {
			listener(event)
		})

		return true
	}
}
