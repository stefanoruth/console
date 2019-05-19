import { ApplicationStarting } from './ApplicationStarting'
import { ConsoleEvent } from './ConsoleEvent'

type StaticEvent = new () => ConsoleEvent
type Listener = (event: ConsoleEvent) => void

export class EventDispatcher {
	protected listeners: { [eventName: string]: Listener[] } = {}

	/**
	 * Add new listenener
	 */
	addListener(event: StaticEvent, listener: Listener) {
		const eventName = this.formatName(event)

		if (this.listeners[eventName]) {
			this.listeners[eventName] = []
		}

		this.listeners[eventName].push(listener)
	}

	/**
	 * Check if there is any listeners registered.
	 */
	hasListeners(event: StaticEvent | string) {
		const eventName = this.formatName(event)

		return !!(this.listeners[eventName] && this.listeners[eventName].length > 0)
	}

	/**
	 * Dispatch an event.
	 */
	dispatch(event: ConsoleEvent) {
		this.listeners[this.formatName(event)].forEach(listener => {
			listener(event)
		})
	}

	/**
	 * Make sure to format the naming of the event correctly.
	 */
	protected formatName(eventStatic: StaticEvent | ConsoleEvent | string) {
		if (typeof eventStatic === 'string') {
			return eventStatic
		}
		return eventStatic.constructor.name
	}
}

const dispatcher = new EventDispatcher()

dispatcher.addListener(ApplicationStarting, event => {
	//
})

dispatcher.dispatch(new ApplicationStarting())
