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
            "comment": { type: Sequelize.TEXT, allowNull: false },
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
				// decode token
				var data = await ctx.call("auth.userData", { token: ctx.meta.token }).catch(err => {
					err.err = err.name
					console.log(err.err);
					return err
				});

				if (data.err) {//check if token is valid
					ctx.meta.$statusCode = 401;
					return { err: "unauthorized" };
				};
				if(ctx.params.time){/// if there is a time field
					return await ctx.call("ToDo.create", {// create in table todo
						"subject": ctx.params.subject,
						"comment": ctx.params.comment,
						"time": ctx.params.time,
						"userId":data.id,
						"reminded":"false"					
					});
				}
				else{
					return await ctx.call("ToDo.create", { // create in table todo without time
						"subject": ctx.params.subject,
						"comment": ctx.params.comment,
						"userId":data.id,
						"reminded":"false"					
					});
				}
            }
        },
        getToDo: {
			params: {
                "id":"string"
			},

			handler: async (ctx) => {
				//decode token
				var data = await ctx.call("auth.userData", { token: ctx.options.parentCtx.params.req.headers.authorization }).catch(err => {
					err.err = err.name
					console.log(err.err);
					return err
				});

				if (data.err) {//check if token is valid
					ctx.meta.$statusCode = 401;
					return { err: "unauthorized" };
				};
				var id = parseInt(ctx.params.id);
				if (typeof id != 'number') {
					ctx.meta.$statusCode = 400;
					return { err: "invaild id" };
				}
				var todo = await ctx.call("ToDo.get", { id: id }).catch(err => {
					err.err = err.name
					return err
				});
				if (todo.err) {//check if todo is found
					ctx.meta.$statusCode = 404;
					return { err: "not found" };
				}
				if (data.id!=todo.userId) {//check if it is the user's todo
					ctx.meta.$statusCode = 401;
					return { err: "unauthorized" };
				};
				return todo;
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
				//decode token
				var data = await ctx.call("auth.userData", { token: ctx.options.parentCtx.params.req.headers.authorization }).catch(err => {
					err.err = err.name
					console.log(err.err);
					return err
				});

				if (data.err) {//check if token is valid
					ctx.meta.$statusCode = 401;
					return { err: "unauthorized" };
				};
				var id = parseInt(ctx.params.id);
				if (typeof id != 'number') {
					ctx.meta.$statusCode = 400;
					return { err: "invaild id" };
				}
				var todo = await ctx.call("ToDo.get", { id: id }).catch(err => {
					err.err = err.name
					return err
				});
				if (todo.err) {//check if todo is found
					ctx.meta.$statusCode = 404;
					return { err: "not found" };
				}
				if (data.id!=todo.userId) {//check if it is the user's todo
					ctx.meta.$statusCode = 401;
					return { err: "unauthorized" };
				};

				if(ctx.params.time){/// if there is a time field
					return await ctx.call("ToDo.update", {// update in table todo
						"id":id,
						"subject": ctx.params.subject,
						"comment": ctx.params.comment,
						"time": ctx.params.time,
						"userId":data.id,
						"reminded":"false"					
					});
				}
				else{
					return await ctx.call("ToDo.update", { // update in table todo without time
						"id":id,
						"subject": ctx.params.subject,
						"comment": ctx.params.comment,
						"userId":data.id,
						"time":null,
						"reminded":"false"					
					});
				}

			}
		},
		deleteToDo: {
			params: {
				"id":"string",
			},
			handler: async (ctx) => {
				//decode token
					var data = await ctx.call("auth.userData", { token: ctx.options.parentCtx.params.req.headers.authorization }).catch(err => {
					err.err = err.name
					console.log(err.err);
					return err
				});

				if (data.err) {//check if token is valid
					ctx.meta.$statusCode = 401;
					return { err: "unauthorized" };
				};
				// parse id to number ,if it is not a number returns invalid id
				var id = parseInt(ctx.params.id);
				if (typeof id != 'number') {
					ctx.meta.$statusCode = 400;
					return { err: "invaild id" };
				}
				var todo = await ctx.call("ToDo.get", { id: id }).catch(err => {
					err.err = err.name
					return err
				});
				if (todo.err) {//check if todo is found
					ctx.meta.$statusCode = 404;
					return { err: "not found" };
				}
				if (data.id!=todo.userId) {//check if it is the user's todo
					ctx.meta.$statusCode = 401;
					return { err: "unauthorized" };
				};
				return await ctx.call("ToDo.remove", { id: id });//delete todo
            }
		},
		getToDos: {
			params: {
                "offset": "string",
				"limit": "string"
			},
			handler: async (ctx) => {
				//decode token
				var data = await ctx.call("auth.userData", { token: ctx.options.parentCtx.params.req.headers.authorization }).catch(err => {
					err.err = err.name
					console.log(err.err);
					return err
				});

				if (data.err) {//check if token is valid
					ctx.meta.$statusCode = 401;
					return { err: "unauthorized" };
				};
				var offset = parseInt(ctx.params.offset);
				var limit = parseInt(ctx.params.limit);
				if (typeof offset != 'number' || typeof limit != 'number')  {
					ctx.meta.$statusCode = 400;
					return { err: "invaild parameters" };
				}
				return await ctx.call("ToDo.find", { query: { userId:data.id} , offset:offset, limit:limit })
			

			}
		},
	}
};