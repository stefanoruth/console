import { EventDispatcher, ApplicationStarting } from '../src/Events'

describe('EventDispatcher', () => {
	test('Events are registered and dispatched', () => {
		const handler = new EventDispatcher()
		const listener = jest.fn()
		const listener2 = jest.fn()

		handler.addListener('ApplicationStarting', listener)
		handler.addListener('CommandStarting', listener)
		handler.addListener('*', listener)

		handler.dispatch(new ApplicationStarting())

		expect(listener).toBeCalledTimes(2)
		expect(listener2).toBeCalledTimes(0)
	})
})
