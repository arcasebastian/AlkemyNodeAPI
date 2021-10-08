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
describe("Movies API endpoint", () => {
  let requester;
  const baseEndpoint = "/movies";
  const newMovie = {
    title: "Tangled",
    releaseDate: "11/11/2010",
    rating: 4,
  };
  const newMovieImg = path.join(__dirname, "test_files", "movie.jpg");
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
  describe("Unauthorized /movies", () => {
    it("should get a 405 unauthorized status code", function () {
      requester.get(baseEndpoint).end((err, res) => {
        res.should.have.status(405);
      });
    });
  });
  describe("OPTIONS /movies", () => {
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
  describe("POST /movies", () => {
    console.log(__dirname);
    it("should create a new genre", function (done) {
      requester
        .post(baseEndpoint)
        .set("Authorization", access_token)
        .field(newMovie)
        //.attach("image", newMovieImg)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have
            .property("status")
            .eq("New movie successfully created");
          done();
        });
    });
  });
  describe("GET /movies", () => {
    it("should return a list of movies", function (done) {
      console.log(access_token);
      requester
        .get(baseEndpoint)
        .set("Authorization", access_token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          id = res.body[0].id;
          res.body.length.should.be.greaterThan(0);
          res.body[0].should.have.property("title");
          res.body[0].should.have.property("image");
          done();
        });
    });
  });
  describe("GET /movies/:id", () => {
    it("should return a single genre", function (done) {
      requester
        .get(`${baseEndpoint}/${id}`)
        .set("Authorization", access_token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("title");
          done();
        });
    });
  });
  describe("PUT /movies/:id", () => {
    newMovie.title = "Tangled Updated";
    it("should update a genre", function (done) {
      requester
        .put(`${baseEndpoint}/${id}`)
        .set("Authorization", access_token)
        .field(newMovie)
        //.attach("image", newMovieImg)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have
            .property("status")
            .eq("Movie successfully updated");
          done();
        });
    });
  });
  describe("DELETE /movies/:id", () => {
    it("should delete genre", function (done) {
      requester
        .delete(`${baseEndpoint}/${id}`)
        .set("Authorization", access_token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have
            .property("status")
            .eq("Movie was successfully deleted");
          done();
        });
    });
  });
  after(() => {
    requester.close();
  });
});
