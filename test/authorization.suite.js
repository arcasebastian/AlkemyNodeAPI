const server = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
const User = require("../models/User");
chai.should();
chai.use(chaiHttp);

describe("Authorization API endpoint", () => {
  const registerEndpoint = "/auth/register";
  const loginEndpoint = "/auth/login";

  describe("PUT /auth/signup", () => {
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
        .put(registerEndpoint)
        .send(validRegister)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have
            .property("status")
            .eq("User registered successfully");
        });
    });
    it("should return a validation error when the user is already registered", function () {
      chai
        .request(server)
        .put(registerEndpoint)
        .send(validRegister)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.be.a("object");
          res.body.should.have.property("httpCode").eq(409);
        });
    });
    it("should not register a new user", function () {
      chai
        .request(server)
        .put(registerEndpoint)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.a
            .property("error")
            .eq("name, email and password are required");
          res.body.should.have.property("httpCode").eq(400);
        });
      chai
        .request(server)
        .put(registerEndpoint)
        .send(invalidRegister)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("httpCode").eq(400);
          res.body.should.have.a.property("error").eq("email is invalid");
        });
    });
    after(() => {
      User.findOne({
        where: { email: validRegister.email, name: validRegister.name },
      })
        .then((user) => {
          user.delete();
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
  describe("GET/PUT/DELETE /auth/signup", () => {
    it("should return a 405 status response", function () {
      chai
        .request(server)
        .get(registerEndpoint)
        .end((err, res) => {
          res.should.have.status(405);
          res.body.should.have.property("httpCode").eq(405);
          res.body.should.have.a.property("error").eq("Method not allowed");
        });
    });
  });
  describe("POST /auth/login", () => {
    const validLogin = {
      email: "someuser@google.com",
      password: "asASqm1!ea1g",
    };
    const invalidLogin = {
      email: "someuser_google.com",
      password: "asASqm1!ea1g",
    };
    it("should login a valid user and get a access_token", function () {
      chai
        .request(server)
        .post(loginEndpoint)
        .send(validLogin)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("access_token");
          should.not.equal(res.body.access_token, null);
        });
    });
    it("should get a login error validation", function () {
      chai
        .request(server)
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
