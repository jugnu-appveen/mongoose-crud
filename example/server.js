"use strict"
const express = require("express")
const port = process.env.PORT || 8080

var Mongoose = require("mongoose")
var MongooseCRUD = require("../")

var definition = {
    "_id": { "type": String },
    "name": { "type": String },
    "description": { "type": String },
    "age": { "type": Number }
}

var schema = Mongoose.Schema(definition)
var modelName = "foobar"
var options = {
    collectionName: "foobar",
    defaultFilter: {
        "age": { "$gte": 10 }
    }
}

var fooCrud = new MongooseCRUD(modelName, schema, options)

Mongoose.connect("mongodb://localhost:27017/mongoose-crudder-test", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if (err) {
        console.error(err)
    } else {
        console.log(`Connected to mongoose-crudder-testDB`)
        init()
    }
})

function init() {
    var app = express()
    app.use(express.json())

    app.post("/foo", fooCrud.create)
    app.get("/foo", fooCrud.index)
    app.get("/foo/bulkShow", fooCrud.bulkShow)
    app.put("/foo/bulkUpdate", fooCrud.bulkUpdate)
    app.delete("/foo/bulkDelete", fooCrud.bulkDestroy)
    app.get("/foo/:id", fooCrud.show)
    app.put("/foo/:id", fooCrud.update)
    app.delete("/foo/:id", fooCrud.destroy)

    app.listen(port, (err) => {
        if (!err) {
            console.log("Server started on port " + port)
        } else
            console.error(err)
    })
}