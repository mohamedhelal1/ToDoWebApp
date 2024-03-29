"use strict";

const ApiGateway = require("moleculer-web");

module.exports = {
	name: "api",
	mixins: [ApiGateway],
	settings: {
		cors: {
			// Configures the Access-Control-Allow-Origin CORS header.
			origin: "*",
			// Configures the Access-Control-Allow-Methods CORS header. 
			methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE", "PATCH"],
			// Configures the Access-Control-Allow-Headers CORS header.
			allowedHeaders: ["Authorization", "Content-Type"],
			// Configures the Access-Control-Expose-Headers CORS header.
			exposedHeaders: [],
			// Configures the Access-Control-Allow-Credentials CORS header.
			credentials: false,
			// Configures the Access-Control-Max-Age CORS header.
			maxAge: 3600
		},
		port: process.env.PORT || 3000,

		routes: [{
			path: "/api",
			onBeforeCall(ctx, route, req, res) {
				ctx.meta.token = req.headers.authorization;// to access user's token easily
			},
			whitelist: [
				// Access to any actions in all services under "/api" URL
				"**"
			],
			mergeParams: true,
			aliases: {// declare routes
				// auth
				"POST auth/login": "auth.login",
				"POST auth/googlelogin": "auth.googleLogin",
				"POST auth/signup": "auth.signup",
				//ToDo
				"POST todo": "ToDo.addToDo",
				"GET todo/:id": "ToDo.getToDo",
				"DELETE todo/:id": "ToDo.deleteToDo",
				"PUT todo/:id": "ToDo.updateToDo",
				"GET todos/:offset/:limit": "ToDo.getToDos",
			},
			bodyParsers: {
				json: { limit: "50mb", extended: true },
				urlencoded: { limit: "50mb", extended: true }
			},
			
		}],
		assets: {
			folder: "public"
		}
	}
};
