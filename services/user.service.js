"use strict";
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const Sequelize = require("sequelize");
const DbService = require("moleculer-db");

module.exports = {
    name: "user",
    mixins: [DbService],
    adapter: new SqlAdapter("postgres://postgres:password@localhost:5432/ToDo-DB"),// connects to local DB  (use  {user}:{password}@localhost:{portnumber}/{DB_name})
    model: {
        name: "user",
        define: {// schema for user table
            "email": {  type: Sequelize.STRING, allowNull: false ,unique: true},
            "password": { type: Sequelize.STRING, allowNull: false },
            "firstname":{ type: Sequelize.STRING, allowNull: false },
            "lastname":{ type: Sequelize.STRING, allowNull: false }
        },
    },
};