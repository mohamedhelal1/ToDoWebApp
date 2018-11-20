"use strict";
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const Sequelize = require("sequelize");
const DbService = require("moleculer-db");


module.exports = {
	name: "ToDo",
	mixins: [DbService],
	adapter: new SqlAdapter("postgres://postgres:password@localhost:5432/ToDo-DB"),// connects to local DB  (use  {user}:{password}@localhost:{portnumber}/{DB_name})
	model: {
		name: "ToDo",
		define: {
            // schema for todo table
            "subject": {  type: Sequelize.STRING, allowNull: false },
            "comment": { type: Sequelize.STRING, allowNull: false },
            "time":{ type: Sequelize.DATE, allowNull: true },
            "userId":{ type: Sequelize.INTEGER, allowNull: false },// the todo owner
            "reminded":{type : Sequelize.BOOLEAN,allowNull:false}// to check if the user is notified by an email
		},
		
	},
	actions: {
		
		addToDo: {
			params: {
			"subject": "string",
            "comment": "string",
            "time": "string",
			},
			handler: async (ctx) => {
            }
        },
        getToDo: {
			params: {
                "id":"string"
			},

			handler: async (ctx) => {
			}
		},
        updateToDo: {
			params: {
                "id":"string",
                "subject": "string",
                "comment": "string",
                "time": "string",
			},
			handler: async (ctx) => {
			}
		},
		deleteToDo: {
			params: {
				"id":"string",
			},
			handler: async (ctx) => {
            
            }
		},
		getToDos: {
			params: {
                "offset": "number",
				"limit": "number"
			},
			handler: async (ctx) => {
			}
		},
	}
};