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
			
		},
		options: {
		}
	},
	actions: {
		
		addToDo: {
			params: {
				
			},
			handler: async (ctx) => {
            }
        },
        getToDo: {
			params: {
			},

			handler: async (ctx) => {
			}
		},
        updateToDo: {
			params: {
				
			},
			handler: async (ctx) => {
			}
		},
		deleteToDo: {
			params: {
				
			},
			handler: async (ctx) => {
            
            }
		},
		getToDos: {
			params: {
			},
			handler: async (ctx) => {
			}
		},
	}
};