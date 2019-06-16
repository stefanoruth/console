import { Formatter } from '../src/Output/Style/Formatter'
import { Color, ApplyColor } from '../src/Output/Style/Color'

function format() {
	return new Formatter(
		new (class extends Color {
			apply(text: string, color: ApplyColor): string {
				return `[${color.text || ''}|${color.bg || ''}]${text}`
			}
		})()
	)
}

describe('StyleFormatter', () => {
	test('Built in formats', () => {
		expect(format().info('foo')).toBe('[yellow|]foo')
		expect(format().error('foo')).toBe('[white|red]foo')
		expect(format().comment('foo')).toBe('[default|default]foo')
		expect(format().warning('foo')).toBe('[black|yellow]foo')
		expect(format().note('foo')).toBe('[yellow|]foo')
		expect(format().caution('foo')).toBe('[white|red]foo')
		expect(format().question('foo')).toBe('[white|]foo')
		expect(format().success('foo')).toBe('[green|]foo')
	})

	test('Custom formats', () => {
		expect(format().format('foo', { text: 'yellow' })).toBe('[yellow|]foo')
		expect(format().format('foo', { bg: 'yellow' })).toBe('[|yellow]foo')
		expect(format().format('foo', { text: 'yellow', bg: 'green' })).toBe('[yellow|green]foo')
	})

	test('Exposes the color generator', () => {
		expect(new Formatter().getColor()).toBeInstanceOf(Color)
	})

	test('Color Mapper', () => {
		const c = new (class extends Color {
			protected foregroundColors: any = {
				black: {
					set: '#',
					unset: '#',
				},
			}

			protected backgroundColors: any = {
				black: {
					set: '$',
					unset: '$',
				},
			}
		})()

		expect(c.apply('foo', { text: 'black' })).toBe('#foo#')
		expect(c.apply('foo', { bg: 'black' })).toBe('$foo$')
		expect(c.apply('foo', { text: 'black', bg: 'black' })).toBe('#$foo#$')
	})
})
