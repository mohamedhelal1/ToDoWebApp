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
				var user = await ctx.call("user.find", { query: { email: ctx.params.email } });
				if(!user[0]){ 
					ctx.meta.$statusCode = 404;
					return{err:"email is not found"};
				}
				if(await bcrypt.compare(ctx.params.password, user[0].password)){
                    var data = {
                        "id":user[0].id,
                        "email":user[0].email
                    };
					var token= jwt.sign({data:data},config.secret,{expiresIn: '24h'});
					
					
					return  {
						"msg": "logged in successfully",
						"token": token
					};
				}
				else {
					ctx.meta.$statusCode = 401;
					return{err:"wrong password"};
				}
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
                var restriction = new passwordValidator();// validate a format for password
                restriction.is().min(8)                                 
                        .is().max(100)                                  
                        .has().uppercase()                              
                        .has().lowercase() 	                            
                        .has().digits()                                 
                        .has().not().spaces();          
                        
                if(!restriction.validate(ctx.params.password)){// check if password in the right format
                    ctx.meta.$statusCode = 422;
                    return{err:"Password must be at least 8 letters long, contain a capital letter, contain a number."};
                }
                var hash = await bcrypt.hash(ctx.params.password, 10);// hashing password
                var user= await ctx.call("user.create", { // create user
                    email: ctx.params.email,
                    password: hash,
                    firstname:ctx.params.firstname,
                    lastname:ctx.params.lastname
                }
                 ).catch(err => {
                    err.err = err.name
                    console.log(err.err);
                    return err
                });
                if(user.err=='SequelizeUniqueConstraintError'){// signing up twice
                    ctx.meta.$statusCode = 401;
                    return {err:"this email already exist"};
                }
                var data = {// the data in the token
                    "id":user.id,
                    "email":user.email
                };
                var token= jwt.sign({data:data},config.secret,{expiresIn: '24h'});// use jwt to make a token
            

                return {
                    "msg":"signed up successfully",
                    "token":token
                };
			}
		}
	}
};