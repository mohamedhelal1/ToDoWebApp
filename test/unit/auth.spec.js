require("dotenv").config();
const chakram = require("chakram");
const expect = chakram.expect;
var faker = require('faker');
var token;
var email;
var firstname;
var lastname;

/// because I did not deploy a db, I did not find the need to test in another db so testing is done in the same db
describe("Auth", () => {
    before(async () => {
        email=faker.internet.email();///fakes an email
        firstname= faker.name.firstName();// fakes firstname
        lastname = faker.name.lastName();// fakes flast name
        token = await chakram.post("http://localhost:3000/api"+ "/auth/signup", {//sends request
            email: email,
            password: "Pp123456",
            firstname: firstname,
            lastname: lastname,
        });
        expect(token).to.have.status(200);//checks if response status 200
        token = token.body.token;
    });
    /// sign up
    it("should sign up a user", async () => {
        var res = await chakram.post("http://localhost:3000/api" + "/auth/signup", {//sends request
            email: faker.internet.email(),
            password: "Pp123456",
            firstname: faker.name.firstName(),
            lastname: faker.name.lastName(),
        });
        expect(res).to.have.status(200);
        expect(res.body.token).to.exist;//check if token exists 
        expect(res.body.msg).to.be.equal("signed up successfully");
    }); 
   
    it("should fail to sign up because of invalid password", async () => {
        var res = await chakram.post("http://localhost:3000/api" + "/auth/signup", {//sends request
            email: faker.internet.email(),
            password: "P1256",
            firstname: faker.name.firstName(),
            lastname: faker.name.lastName(),
        });
        expect(res).to.have.status(422);// checks on status code for invalid
        expect(res.body.err).to.be.equal("Password must be at least 8 letters long, contain a capital letter, contain a number.");
    }); 
    it("should fail to sign up same email twice", async () => {
        var res = await chakram.post("http://localhost:3000/api"+ "/auth/signup", {
            email: email,
            password: "Pp123456",
            firstname: faker.name.firstName(),
            lastname: faker.name.lastName(),
        });
        expect(res).to.have.status(401);// checks on status code for unauthorized
        expect(res.body.err).to.be.equal("this email already exist");
    }); 
    it("should login a user", async () => {
        var res = await chakram.post("http://localhost:3000/api"+ "/auth/login", {
            email: email,
            password: "Pp123456",
        });
        expect(res).to.have.status(200);// checks on status code for ok
        expect(res.body.token).to.exist;// checks if token exist
        expect(res.body.msg).to.be.equal("logged in successfully");
    }); 
    it("should fail to login an unknown email", async () => {
        var res = await chakram.post("http://localhost:3000/api" + "/auth/login", {
            email: "ggg.gmail.com",
            password: "Pp123456",
        });
        expect(res).to.have.status(404);// checks on status code for notfound
        expect(res.body.err).to.be.equal("email is not found");
    }); 
    it("should fail to login with wrong password", async () => {
        var res = await chakram.post("http://localhost:3000/api" + "/auth/login", {
            email: email,
            password: "Pp12345678",
        });
        expect(res).to.have.status(401);//check on status code for unauthorized
        expect(res.body.err).to.be.equal("wrong password");
    });
});