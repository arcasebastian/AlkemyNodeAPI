const server = "http://localhost:3000";
const chai = require("chai");
const chaiHttp = require("chai-http");
const sequelize = require("../models/sequelize");
const User = sequelize.models.user;
chai.should();
chai.use(chaiHttp);
const requester = chai.request(server).keepOpen();
const registerEndpoint = "/auth/register";
const loginEndpoint = "/auth/login";
const validRegister = {
  name: "validUser",
  email: "validMail@google.com",
  password: "asASqm1ea1g",
};
const invalidRegister = {
  name: "invalidUser",
  email: "invalidmail__google.com",
  password: "asASqm1!ea1g",
};
describe("Authorization API endpoint", () => {
  describe("1 - PUT /auth/signup", () => {
    it("should register a new user", function (done) {
      requester
        .put(registerEndpoint)
        .send(validRegister)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have
            .property("status")
            .eq("User registered successfully");
          done();
        });
    });
    it("should return a validation error when the user is already registered", function (done) {
      requester
        .put(registerEndpoint)
        .send(validRegister)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.be.a("object");
          res.body.should.have.property("httpCode").eq(409);
          done();
        });
    });
    it("should not register a new user", function (done) {
      requester.put(registerEndpoint).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.a
          .property("error")
          .eq("name, email and password are required");
        res.body.should.have.property("httpCode").eq(400);
      });
      requester
        .put(registerEndpoint)
        .send(invalidRegister)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("httpCode").eq(400);
          res.body.should.have.a.property("error").eq("Email is invalid");
          done();
        });
    });
  });
  describe("2 - GET/POST/DELETE /auth/signup", () => {
    it("should return a 405 status response", function (done) {
      requester.get(registerEndpoint).end((err, res) => {
        res.should.have.status(405);
        res.body.should.have.property("httpCode").eq(405);
        res.body.should.have.a.property("error").eq("Method not allowed");
        done();
      });
    });
  });

  describe("3 - POST /auth/login", () => {
    const validLogin = {
      email: validRegister.email,
      password: validRegister.password,
    };
    const invalidLogin = {
      email: "test@mail.com",
      password: "aaaaaaaaaa",
    };
    it("should login a valid user and get a access_token", function (done) {
      requester
        .post(loginEndpoint)
        .send(validLogin)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("access_token");
          should.not.equal(res.body.access_token, null);
          done();
        });
    });
    it("should get a login error validation", function (done) {
      requester
        .post(loginEndpoint)
        .send(invalidLogin)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a("object");
          res.body.should.not.have.property("access_token");
          res.body.should.have.property("httpCode").eq(401);
          res.body.should.have
            .property("error")
            .eq("Invalid email or password");
          done();
        });
    });
  });
  describe("4 - GET/PUT/DELETE /auth/register", () => {
    it("should return a 405 status response", function (done) {
      requester.get(registerEndpoint).end((err, res) => {
        res.should.have.status(405);
        res.body.should.have.a.property("error").eq("Method not allowed");
        done();
      });
    });
  });
  after(() => {
    requester.close();
    User.findByEmail(validRegister.email).then((user) => {
      if (user) return user.destroy();
    });
  });
});
