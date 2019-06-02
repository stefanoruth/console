import { Application } from '../src/index'

describe('Application', () => {
	test('Bootstrapping', () => {
		let app: Application | undefined

		const appFn = jest.fn(original => {
			app = original
		})

		Application.starting(appFn)

		const application = new Application()

		expect(appFn).toBeCalled()
		expect(application).toBe(app)
	})
})
