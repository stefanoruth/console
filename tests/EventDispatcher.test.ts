import { EventDispatcher, ApplicationStarting, CommandStarting, CommandFinished } from '../src/Events'

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

	test('CommandStarting', () => {
		const event = new CommandStarting('foo', {} as any, {} as any)

		expect(event).toBeInstanceOf(Object)
	})

	test('CommandFinished', () => {
		const event = new CommandFinished('foo', {} as any, {} as any, 0)

		expect(event).toBeInstanceOf(Object)
	})
})
