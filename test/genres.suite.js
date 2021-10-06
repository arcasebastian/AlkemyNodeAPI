const path = require("path");
const server = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp);

describe("Genres API endpoint", () => {
  const baseEndpoint = "/genres";
  const newGenreName = "Animation";
  const updateGenreName = "Updated Name";

  const newGenreImg = path.join(__dirname, "test_files", "test_img.png");
  let access_token = "";
  let id = "/1";
  before(() => {
    chai.request(server).post("/auth/login", (err, res) => {
      if (!err) {
        access_token = res.body.access_token;
      }
    });
  });
  describe("Unauthorized /genres", () => {
    it("should get a 405 unauthorized status code", function () {
      chai
        .request(server)
        .get(baseEndpoint)
        .end((err, res) => {
          res.should.have.status(405);
        });
    });
  });
  describe("OPTIONS /genres", () => {
    it("should get a valid preflight response", function (done) {
      chai
        .request(server)
        .options(baseEndpoint)
        .end((err, res) => {
          res.should.have.status(204);
          res.should.have.header("Access-Control-Allow-Origin", "*");
          res.should.have.header(
            "Access-Control-Allow-Methods",
            "OPTIONS, GET, PUT, POST, DELETE"
          );
          res.should.have.header(
            "Access-Control-Allow-Headers",
            "Authorization,Cache-Control,Content-Type"
          );
          done();
        });
    });
  });
  describe("POST /genres", () => {
    console.log(__dirname);
    it("should create a new genre", function (done) {
      chai
        .request(server)
        .post(baseEndpoint)
        .set("Authorization", access_token)
        .field({ name: newGenreName })
        .attach("image", newGenreImg)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have
            .property("status")
            .eq("New genre successfully created");
          done();
        });
    });
  });
  describe("GET /genres", () => {
    it("should return a list of genres", function (done) {
      chai
        .request(server)
        .get(baseEndpoint)
        .set("Authorization", access_token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.greaterThan(0);
          res.body[0].should.have.property("name");
          res.body[0].should.have.property("image");
          done();
        });
    });
  });
  describe("GET /genres/:id", () => {
    it("should return a single genre", function (done) {
      chai
        .request(server)
        .get(baseEndpoint + id)
        .set("Authorization", access_token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("name").eq(newGenreName);
          done();
        });
    });
  });
  describe("PUT /genres/:id", () => {
    it("should update a genre", function (done) {
      chai
        .request(server)
        .put(baseEndpoint + id)
        .set("Authorization", access_token)
        .send({ name: updateGenreName })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have
            .property("status")
            .eq("Genre successfully updated");
          done();
        });
    });
  });
  describe("DELETE /genres/:id", () => {
    it("should delete genre", function (done) {
      chai
        .request(server)
        .delete(baseEndpoint + id)
        .set("Authorization", access_token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have
            .property("status")
            .eq("Genre was successfully deleted");
          done();
        });
    });
  });
});
