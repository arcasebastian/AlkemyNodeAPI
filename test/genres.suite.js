const path = require("path");
const server = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp);
const user = {
  email: "someuser@google.com",
  password: "asASqm1!ea1g",
};
// TODO Validation errors testing
describe("Genres API endpoint", () => {
  let requester;
  const baseEndpoint = "/genres";
  const newGenreName = "Animation";
  const updateGenreName = "Updated Name";

  const newGenreImg = path.join(__dirname, "test_files", "test_img.png");
  let access_token = "";
  let id = "";
  before((done) => {
    requester = chai.request(server).keepOpen();
    requester
      .post("/auth/login")
      .field(user)
      .end((err, res) => {
        if (!err) {
          access_token = `Bearer ${res.body.access_token}`;
        } else {
          throw err;
        }
        done();
      });
  });
  describe("Unauthorized /genres", () => {
    it("should get a 401 unauthorized status code", function () {
      requester.get(baseEndpoint).end((err, res) => {
        res.should.have.status(401);
      });
    });
  });
  describe("OPTIONS /genres", () => {
    it("should get a valid preflight response", function (done) {
      requester.options(baseEndpoint).end((err, res) => {
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
      requester
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
      requester
        .get(baseEndpoint)
        .set("Authorization", access_token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          id = res.body[0].id;
          res.body.length.should.be.greaterThan(0);
          res.body[0].should.have.property("name");
          res.body[0].should.have.property("image");
          done();
        });
    });
  });
  describe("GET /genres/:id", () => {
    it("should return a single genre", function (done) {
      requester
        .get(`${baseEndpoint}/${id}`)
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
      requester
        .put(`${baseEndpoint}/${id}`)
        .set("Authorization", access_token)
        .field({ name: updateGenreName })
        .attach("image", newGenreImg)
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
      requester
        .delete(`${baseEndpoint}/${id}`)
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
  after(() => {
    requester.close();
  });
});
