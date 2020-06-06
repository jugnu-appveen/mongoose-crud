# mongoose-crud
Express CRUD middleware for mongoose model


# Quickstart

Install 

```sh
npm install mongoose-crud
```

Use your mongoose model and create a new mongoose-crud

```js
const mongoose = require('mongoose');
const MongooseCRUD = require('mongoose-crud');

const model = mongoose.model('modelName',schema);

var crud = new MongooseCRUD(model);
```

Add the middleware to express

```js
var app = express()
app.use(express.json())

app.post("/foo", crud.create)
app.get("/foo", crud.index)
app.get("/foo/bulkShow", crud.bulkShow)
app.put("/foo/bulkUpdate", crud.bulkUpdate)
app.delete("/foo/bulkDelete", crud.bulkDestroy)
app.get("/foo/:id", crud.show)
app.put("/foo/:id", crud.update)
app.delete("/foo/:id", crud.destroy)

app.listen(8080)
```

# Table of contents

1. [Quickstart](#Quickstart)
2. [Constructor](#Constructor)
3. [Methods](#Methods)
	* [create(`req`, `res`)](#MongooseCRUD.create(`req`,-`res`))
	* [update(`req`, `res`)](#MongooseCRUD.update(`req`,-`res`))
	* [index(`req`, `res`)](#MongooseCRUD.index(`req`,-`res`))
	* [show(`req`, `res`)](#MongooseCRUD.show(`req`,-`res`))
	* [destroy(`req`, `res`)](#MongooseCRUD.destroy(`req`,-`res`))
	* [bulkShow(`req`, `res`)](#MongooseCRUD.bulkShow(`req`,-`res`))
	* [bulkUpdate(`req`, `res`)](#MongooseCRUD.bulkUpdate(`req`,-`res`))
	* [bulkDestroy(`req`, `res`)](#MongooseCRUD.bulkDestroy(`req`,-`res`))


# Constructor

`var fooCrud = new MongooseCRUD(model)`

The constructor takes 2 params, 

* **model**(_Required_): The mongoose model.
* **options*(_Optional_): An optional options object. This has two properties.
	* _defaultFilter_: A default filter to be applied to all `GET` calls.
	* _logger_: A logger object. By default this will use [log4js](https://www.npmjs.com/package/log4js)

# Methods

> All methods in two parameters. An express request object and an express response object

## MongooseCRUD.create(`req`, `res`)

Create a new document using the data in `req.body`.

E.g. `app.post("/foo", fooCrud.create)`

| Request | Response | Status Code | Condition |
|--|--|--|--|
| JSON | JSON | `200 OK` | Success
| JSON | JSON | `400 Bad Request` | Error in payload
| Array of JSON | Array of JSON | `200 OK` | Success
| Array of JSON | Array of JSON | `207 Multi-Status` | Some of the documents where inserted, some had errors. The response array has the same order of input array.
| Array of JSON | Array of JSON | `400 Bad Request` | All documents in the array had errors.


## MongooseCRUD.update(`req`, `res`)

Update a single document where the `:id` matches the `_id` of the document

E.g. `app.put("/foo/:id", fooCrud.update)`

## MongooseCRUD.index(`req`, `res`)

Displays the documents in the collection. URL parameters are used to influence the output generated.

E.g. `app.get("/foo", fooCrud.index)`

The following are URL params are available.

| Param | Type | Description |
|--|--|--|
| `filter` | JSON | Filter condition for the documents. This filter gets merged with _defaultFilter_ if one was defined when the MongooseCRUD object was instantiated.
| `count` | Boolean | Returns the count of the documents after applying the filter. When `count` is enabled only `filter` paramerter takes effect.
| `page` | Number | Specify the page number of the paginated data. Default _1_.
| `limit` | Number | Specify the number for documents per page. Default _10_.
| `select` | String | List of comma-separated attributes of the document to display. If the attribute is preceded by a "-", then the attribute is omitted.
| `sort` | String | The attributes on which the results have to be sorted. By default, the documents are sorted in ascending order. If the attribute is preceded by a "-", then the sorting is done in descending order.


## MongooseCRUD.show(`req`, `res`)

Display a single document where the `:id` matches the `_id` of the document.

E.g. `app.get("/foo/:id", fooCrud.show)`

| Param | Type | Description |
|--|--|--|
| `select` | String | List of comma-separated attributes of the document to display. If the attribute is preceded by a "-", then the attribute is omitted.

## MongooseCRUD.destroy(`req`, `res`)

Deletes a single document where the `:id` matches the `_id` of the document.

E.g. `app.delete("/foo/:id", fooCrud.destroy)`

If the document is found and deleted, then `200 OK` is returned. If no document gets deleted, then `204 No Content` is returned.

## MongooseCRUD.bulkShow(`req`, `res`)

Display multiple documents for the given set of _ids. This is a convenience function over `MongooseCRUD.index()` with `filter`.

E.g. `app.get("/foo/bulkShow", fooCrud.bulkShow)`

| Param | Type | Description |
|--|--|--|
| `id` | String | List of comma-separated ids of the document to display
| `select` | String | List of comma-separated attributes of the document to display. If the attribute is preceded by a "-", then the attribute is omitted.
| `sort` | String | The attributes on which the results have to be sorted. By default, the documents are sorted in ascending order. If the attribute is preceded by a "-", then the sorting is done in descending order.

## MongooseCRUD.bulkUpdate(`req`, `res`)

Update multiple documents in a single request. The request has to be an array, with each document having an `_id`. 

E.g. `app.put("/foo/bulkUpdate", fooCrud.bulkUpdate)`

The response is an array of updated documents in the same order of input request. If an `_id` can't be located, then the response would be `null` for that document

## MongooseCRUD.bulkDestroy(`req`, `res`)

Delete multiple documents for the given set of _ids. 

E.g. `app.delete("/foo/bulkDelete", fooCrud.bulkDestroy)`

| Param | Type | Description |
|--|--|--|
| `id` | String | List of comma-separated ids of the document to delete

If all the document were found and deleted, then `200 OK` is returned. If no documents get deleted, then `204 No Content` is returned.