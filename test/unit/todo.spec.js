require("dotenv").config();
const chakram = require("chakram");
const expect = chakram.expect;
var faker = require('faker');
var token;
var id;
var id2;

/// because I did not deploy a db, I did not find the need to test in another db so testing is done in the same db
describe("Todo", () => {
    before(async () => {
        token = await chakram.post("http://localhost:3000/api"+ "/auth/signup", {//sends request
            email: faker.internet.email(),
            password: "Pp123456",
            firstname: faker.name.firstName(),
            lastname: faker.name.lastName()
        });
        expect(token).to.have.status(200);//checks if response status 200
        token = token.body.token;
        var res = await chakram.post("http://localhost:3000/api"+ "/todo", {//sends request
            subject: faker.lorem.sentence(),
            comment: faker.lorem.sentences(),
            time: faker.date.recent(2)
        },{headers:{authorization:token}});
        expect(res).to.have.status(200);
        id=res.body.id;
        var res2 = await chakram.post("http://localhost:3000/api"+ "/todo", {//sends request
            subject: faker.lorem.sentence(),
            comment: faker.lorem.sentences(),
            time: faker.date.recent(2)
        },{headers:{authorization:token}});
        expect(res2).to.have.status(200);
        id2=res2.body.id;
    });
    /// create a todo
    it("should create a todo", async () => {
        var res = await chakram.post("http://localhost:3000/api"+ "/todo", {//sends request
            subject: faker.lorem.sentence(),
            comment: faker.lorem.sentences(),
            time: faker.date.recent(2),
        },{headers:{authorization:token}});
        expect(res).to.have.status(200);
        expect(res.body.subject).to.exist;//check if res params exists 
        expect(res.body.comment).to.exist;
        expect(res.body.id).to.exist;
        expect(res.body.userId).to.exist;
    }); 
   
    it("should fail to create a todo because user is not logged in", async () => {
        var res = await chakram.post("http://localhost:3000/api"+ "/todo", {//sends request
            subject: faker.lorem.sentence(),
            comment: faker.lorem.sentences(),
            time: faker.date.recent(2),
        });
        expect(res).to.have.status(401);
        expect(res.body.err).to.be.equal("unauthorized");
    });  
    // get
    it("should get a todo", async () => {
        var res = await chakram.get("http://localhost:3000/api"+ "/todo/"+id, {//sends request
            headers:{'Authorization':token}
        });
        expect(res).to.have.status(200);
        expect(res.body.subject).to.exist;//check if res params exists 
        expect(res.body.comment).to.exist;
        expect(res.body.id).to.exist;
        expect(res.body.userId).to.exist;
    }); 
   
    it("should fail to get a todo because user is not logged in", async () => {

        var res = await chakram.get("http://localhost:3000/api"+ "/todo/"+id, {//sends request
    
        });
        expect(res).to.have.status(401);
        expect(res.body.err).to.be.equal("unauthorized");
    });  

    it("should fail to get a todo because item does not exist", async () => {

        var res = await chakram.get("http://localhost:3000/api"+ "/todo/24234", {//sends request
        headers:{'Authorization':token},
        });
        expect(res).to.have.status(404);
        expect(res.body.err).to.be.equal("not found");
    });  

   // update 
    it("should update a todo", async () => {
        var res = await chakram.put("http://localhost:3000/api"+ "/todo/"+id, {//sends request
            subject: faker.lorem.sentence(),
            comment: faker.lorem.sentences(),
            time: faker.date.recent(2),
        },{headers:{authorization:token}});
        expect(res).to.have.status(200);
        expect(res.body.subject).to.exist;//check if res params exists 
        expect(res.body.comment).to.exist;
        expect(res.body.id).to.exist;
        expect(res.body.userId).to.exist;
    }); 
   
    it("should fail to update a todo because user is not logged in", async () => {

        var res = await chakram.put("http://localhost:3000/api"+ "/todo/"+id, {//sends request
            subject: faker.lorem.sentence(),
            comment: faker.lorem.sentences(),
            time: faker.date.recent(2),
        });
        expect(res).to.have.status(401);
        expect(res.body.err).to.be.equal("unauthorized");
    });  

    it("should fail to update a todo because item does not exist", async () => {

        var res = await chakram.put("http://localhost:3000/api"+ "/todo/24234", {//sends request
            subject: faker.lorem.sentence(),
            comment: faker.lorem.sentences(),
            time: faker.date.recent(2),
        },{headers:{authorization:token}});
        expect(res).to.have.status(404);
        expect(res.body.err).to.be.equal("not found");
    }); 

   
    it("should get user todos with a limit", async () => {
        var res = await chakram.get("http://localhost:3000/api"+ "/todos/0/5", {//sends request
            headers:{'Authorization':token},
        });
        expect(res).to.have.status(200);
    }); 
    it("should fail get user todos because user is not logged in", async () => {
        var res = await chakram.get("http://localhost:3000/api"+ "/todos/0/5");// send requests
        expect(res).to.have.status(401);
        expect(res.body.err).to.be.equal("unauthorized");
    }); 
});