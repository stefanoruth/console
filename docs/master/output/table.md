# Table

[[toc]]

## Examples

### Default Design

```ts
output.table(data, ['id', 'name', 'email'])
```

```sh
+----+----------+-------------+
| id | name     | email       |
+----+----------+-------------+
| 1  | John Doe | john@doe.dk |
| 2  | Jane Doe | jane@doe.dk |
| 3  | Foobar   |             |
+----+----------+-------------+
```

### Slim Design

```ts
output.table(data, ['id', 'name', 'email'], table => {
	table.setStyle('slim')
})
```

```sh
┌────┬──────────┬─────────────┐
│ id │ name     │ email       │
├────┼──────────┼─────────────┤
│ 1  │ John Doe │ john@doe.dk │
│ 2  │ Jane Doe │ jane@doe.dk │
│ 3  │ Foobar   │             │
└────┴──────────┴─────────────┘
```

### Custom Design

```ts
output.table(data, ['id', 'name', 'email'], table => {
	table.setStyle(
		new TableStyle({
			horizontalInsideBorderChar: '.',
			verticalInsideBorderChar: ':',
		})
	)
})
```

```sh
+....+..........+.............+
| id : name     : email       |
+....+..........+.............+
| 1  : John Doe : john@doe.dk |
| 2  : Jane Doe : jane@doe.dk |
| 3  : Foobar   :             |
+....+..........+.............+
```
