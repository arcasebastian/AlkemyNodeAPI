const server = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp);

describe("Authorization API endpoint", () => {
  describe("POST /auth/signup", () => {
    const validRegister = {
      name: "dsadsa",
      email: "someuser@google.com",
      password: "asASqm1!ea1g",
    };
    const invalidRegister = {
      name: "dsadsa",
      email: "someuser_google.com",
      password: "asASqm1!ea1g",
    };
    it("should register a new user", function () {
      chai
        .request(server)
        .put("/auth/register")
        .send(validRegister)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have.property("access_token");
        });
    });
    it("should not register a new user", function () {
      chai
        .request(server)
        .put("/auth/register")
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.a
            .property("error")
            .eq("name, email and password are required");
        });
      chai
        .request(server)
        .put("/auth/register")
        .send(invalidRegister)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.a.property("error").eq("email is invalid");
        });
    });
  });
  describe("GET/PUT/DELETE /auth/signup", () => {
    it("should return a 405 status response", function () {
      chai
        .request(server)
        .get("/auth/register")
        .end((err, res) => {
          res.should.have.status(405);
          res.body.should.have.a.property("error").eq("Method not allowed");
        });
    });
  });
});
