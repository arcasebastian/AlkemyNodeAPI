const server = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp);

describe("Genres API endpoint", () => {
  const baseEndpoint = "/genres";
  const newGenreName = "Animation";
  const updateGenreName = "Updated Name";

  const newGenreImg = "./test_files/test_img.png";
  let access_token = "";
  let id = "";
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
    it("should get a valid preflight response", function () {
      chai
        .request(server)
        .options(baseEndpoint)
        .end((err, res) => {
          res.should.have.status(204);
          res.should.have.header("Access-Control-Allow-Origin", "*");
          res.should.have.header(
            "Access-Control-Allow-Methods",
            "GET, PUT, POST, DELETE"
          );
          res.should.have.header(
            "Access-Control-Allow-Headers",
            "Authorization,Cache-Control,Content-Type"
          );
        });
    });
  });
  describe("POST /genres", () => {
    it("should create a new genre", function () {
      chai
        .request(server)
        .post(baseEndpoint)
        .send({ name: newGenreName })
        .attach("image", newGenreImg)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have
            .property("status")
            .eq("New genre successfully created");
        });
    });
  });
  describe("GET /genres", () => {
    it("should return a list of genres", function () {
      chai
        .request(server)
        .get(baseEndpoint)
        .set("access_token", access_token)
        .end((err, res) => {
          res.should.have.status(200);
          const genres = res.body;
          genres.should.be.a("array");
          genres.length.should.be.greaterThan(0);
          genres[0].should.have.property("name");
          genres[0].should.have.property("image");
        });
    });
  });
  describe("GET /genres/:id", () => {
    it("should return a single genre", function () {
      chai
        .request(server)
        .get(baseEndpoint + id)
        .send(validRegister)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("name").eq(newGenreName);
        });
    });
  });
  describe("PUT /genres/:id", () => {
    it("should update a genre", function () {
      chai
        .request(server)
        .put(baseEndpoint + id)
        .send({ name: updateGenreName })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have
            .property("status")
            .eq("Genre successfully updated");
        });
    });
  });
  describe("DELETE /genres/:id", () => {
    it("should delete genre", function () {
      chai
        .request(server)
        .delete(baseEndpoint + id)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have
            .property("status")
            .eq("Genre was successfully deleted");
        });
    });
  });
});
