import { Table, TableStyle, TableDivider, TableHeader, TableRow } from '../src/Output/Table'
import { Color, NullColor } from '../src/Output/Style'
import { Output } from '../src/Output'
import { Mock } from 'ts-mockery'

class TestTable extends Table {
	getWidth() {
		return this.columnWidths
	}

	getStyle() {
		return this.style
	}
}

function getMock() {
	const o = Mock.of<Output>({ raw: jest.fn() })

	return new TestTable(o, new NullColor())
}

describe('Table', () => {
	describe('Style', () => {
		test('Fill column to required space', () => {
			const s = new TableStyle()

			expect(s.pad('foo', 6)).toBe(' foo    ')
			expect(s.pad('foo', 0)).toBe(' foo ')
			expect(s.pad('foo', 6).length).toBe(8)
			expect(s.pad('foo', 0).length).toBe(5)
			expect(s.fillEmpty(0).length).toBe(2)
			expect(s.fillEmpty(2).length).toBe(4)
		})

		test('Can wrap rows in borders', () => {
			const s = new TableStyle()

			expect(s.wrapRow('foo')).toBe('|foo|')
		})

		test('Render a column divider if needed', () => {
			const s = new TableStyle()

			expect(s.columnDivider(false)).toBe('')
			expect(s.columnDivider(true)).toBe('|')
		})

		test('Can be initiated with different styles', () => {
			expect(new TableStyle({}).paddingChar).toBe(' ')
			expect(new TableStyle({ paddingChar: '#' }).paddingChar).toBe('#')
			expect(new TableStyle({ paddingChar: '$' }).paddingChar).toBe('$')
		})
	})

	describe('Divider', () => {
		test('Render a dividing line', () => {
			expect(new TableDivider('headerTop', [1, 2, 3], new TableStyle()).render()).toBe('+---+----+-----+')
		})
	})

	describe('Header', () => {
		test('Show a basic header', () => {
			expect(new TableHeader(['foo', 'bar'], [], new TableStyle(), new NullColor()).render()).toEqual([
				'+-----+-----+',
				'| foo | bar |',
				'+-----+-----+',
			])
		})

		test('Fill empty spaces', () => {
			expect(new TableHeader(['foo'], [3, 3], new TableStyle(), new NullColor()).render()).toEqual([
				'+-----+-----+',
				'| foo |     |',
				'+-----+-----+',
			])
		})
	})

	describe('Row', () => {
		test('Can wrap a row in a outer set', () => {
			expect(new TableRow({ foo: 'bar', a: 2 }, [], new TableStyle()).render()).toBe('| bar | 2 |')
			expect(new TableRow({ foo: 'bar' }, [3, 1], new TableStyle()).render()).toBe('| bar |   |')
		})
	})

	test('Table with no data', () => {
		const t = getMock()

		expect(t.render()).toEqual(['++', '||', '++', '++'])
	})

	test('Table with no headers', () => {
		const t = getMock()
		t.setRows([{ a: 'foo', b: 'bar' }])

		expect(t.render()).toEqual(['+-----+-----+', '| a   | b   |', '+-----+-----+', '| foo | bar |', '+-----+-----+'])
	})

	test('Table with headers', () => {
		const t = getMock()
		t.setRows([{ a: 'foo', b: 'bar' }])
		t.setHeaders(['A', 'B'])

		expect(t.render()).toEqual(['+-----+-----+', '| A   | B   |', '+-----+-----+', '| foo | bar |', '+-----+-----+'])
	})

	describe('Table Styles', () => {
		test('default style', () => {
			const t = getMock()

			t.setStyle('default')

			expect(t.getStyle().horizontalInsideBorderChar).toBe('-')
			expect(t.getStyle().verticalInsideBorderChar).toBe('|')
		})

		test('slim style', () => {
			const t = getMock()

			t.setStyle('slim')

			expect(t.getStyle().horizontalInsideBorderChar).toBe('─')
			expect(t.getStyle().verticalInsideBorderChar).toBe('│')
		})

		test('custom style', () => {
			const t = getMock()

			const s = new TableStyle({
				horizontalInsideBorderChar: 'a',
				verticalInsideBorderChar: 'b',
			})

			t.setStyle(s)

			expect(t.getStyle().horizontalInsideBorderChar).toBe('a')
			expect(t.getStyle().verticalInsideBorderChar).toBe('b')
		})
	})
})
