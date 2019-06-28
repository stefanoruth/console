import { Output, Terminal } from '../src'
import { Mock } from 'ts-mockery'

const t = Mock.of<Terminal>()

describe('Question', () => {
	test('Simple question', () => {
		// const action = jest.spyOn(readline)

		// const o = new Output(t)
		expect(true).toBe(true)
	})
})
