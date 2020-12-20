# Guide

## Install `DataMonger`

```bash
npm install --save data-monger
```

```bash
yarn add data-monger
```

## DataMonger

`DataMonger` utilizes external drivers. The following drivers are supported:

- pg
- mysql
- mongodb
- sqlite

```js
const DataMonger = require('data-monger');

const sqlite = require('sqlite');

let db = new DataMonger({
  dbType: 'SQLite',
  driver: sqlite,
  driverConstructor: 'data.db',
  options: {
    verbose: true,
  },
});
```

### `DataMonger` methods

#### `getSchema()` - Gets schema for entire DB

Usage:

```js
db.getSchema()
  .then((tables) => console.log(tables))
  .catch((err) => console.error(err));
```

## Collection / Table

Both the `collection()` and `table()` methods return the same thing, the choice of terminology is up to you.

```js
let users = db.collection('users');

// eq

let users = db.table('users');
```

### Collection Methods

#### `getSchema()` - Gets schema for entire Table

Usage:

```js
db.collection('users')
  .getSchema()
  .then((userTable) => console.log(userTable))
  .catch((err) => console.error(err));
```

#### `findOne()` - Finds first matching element in collection

Parameters:

```js
{
  query: QueryElement[],
}
```

Usage:

```js
db.collection('employees')
  .findOne({
    query: [
      {
        name: 'EmployeeId',
        operator: '==',
        value: '1',
      },
    ],
  })
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
```

#### `find()` - Finds all matching elements in collection

Parameters:

```js
{
  query: QueryElement[],
}
```

Usage:

```js
db.collection('employees')
  .find({
    query: [
      {
        name: 'EmployeeId',
        operator: '==',
        value: '1',
      },
    ],
  })
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
```

#### `setOne()`

#### `set()`

## Types

### `DataMonger Constructor`:

```js
{
  dbType: string,
  driver: object,
  driverConstructor: string | object, // Constructor info for driver.
  options: {
    verbose: boolean,
  },
}
```

### `QueryElement`:

```js
{
  name: 'EmployeeId',
  operator: '==',
  value: '1',
},
```
