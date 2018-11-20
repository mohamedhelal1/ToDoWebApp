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
			},
			handler: async (ctx) => {
				
			}
		},
		signup: {
			params:
			{

			},
			handler:  async (ctx) => {
					
			}
		}

	}
};