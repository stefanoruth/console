import { Output, Terminal } from '../src'
import { Mock } from 'ts-mockery'
import { Writer } from '../src/Output/Writer'
import { Color, Formatter, ApplyColor } from '../src/Output/Style'

describe('Output', () => {
	const t = Mock.all<Terminal>()
	const w = new class extends Writer {
		write(msg: string) {
			return msg
		}
	}(t)
	const s = new class extends Color {
		apply(text: string, color: ApplyColor) {
			return `[${color.text || ''},${color.bg || ''}]${text}`
		}
	}()
	const f = new Formatter(s)
	const o = new Output(t, w, f)

	test('Text Colors', () => {
		expect(o.raw('foo')).toBe('foo')
		expect(o.line('foo')).toBe('foo')
		expect(o.comment('foo')).toBe('foo')
		expect(o.info('foo')).toBe('[yellow,]foo')
		expect(o.success('foo')).toBe('[green,]foo')
		expect(o.error('foo')).toBe('[white,red]foo')
		expect(o.warning('foo')).toBe('[black,yellow]foo')
		expect(o.note('foo')).toBe('[yellow,]foo')
		expect(o.caution('foo')).toBe('[white,red]foo')
		expect(o.newLine()).toBe('\n')
	})

	test('Table', () => {
		expect(o.table([{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }])).toEqual([
			'+-----+',
			'|[blue,] name |',
			'+-----+',
			'| foo |',
			'| bar |',
			'| baz |',
			'+-----+',
		])

		expect(
			o.table([{ name: 'foobar' }], ['OldName'], table => {
				table.setHeaders(['NyName'])
			})
		).toEqual(['+--------+', '|[blue,] NyName |', '+--------+', '| foobar |', '+--------+'])
	})

	test('ProgresBar', () => {
		expect(
			o
				.progressBar()
				.start(100)
				.finish()
		).toBe('100/100 [============================] 100%')
	})
})
