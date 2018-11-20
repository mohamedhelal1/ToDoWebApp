"use strict";
var jwt = require('jsonwebtoken'),
	config = require('../moleculer.config'),
	bcrypt = require('bcrypt-promise'),
	passwordValidator = require('password-validator');

module.exports = {
	name: "auth",
	actions: {
		
		login: {
			params: {
                "email":"string",
                "password":"string"
			},
			handler: async (ctx) => {
				
			}
		},
		signup: {
			params:
			{
                "email":"string",
                "password":"string",
                "firstname":"string",
                "lastname":"string"
			},
			handler:  async (ctx) => {
					
			}
		}

	}
};