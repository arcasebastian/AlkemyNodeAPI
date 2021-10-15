const path = require("path");
const server = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp);
const user = {
  email: "test@mail.com",
  password: "111111",
};
// TODO Validation errors testing
describe("Movies API endpoint", () => {
  let requester;
  const baseEndpoint = "/movies";
  const newMovie = {
    title: "Tangled",
    releaseDate: "11/11/2010",
    rating: 4,
    genres: [1],
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
  describe("1 - Unauthorized /movies", () => {
    it("should get a 401 unauthorized status code", function () {
      requester.get(baseEndpoint).end((err, res) => {
        res.should.have.status(401);
      });
    });
  });
  describe("2 - OPTIONS /movies", () => {
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
  describe("3 - POST /movies", () => {
    it("should create a new genre", function (done) {
      requester
        .post(baseEndpoint)
        .set("Authorization", access_token)
        .field(newMovie)
        .attach("image", newMovieImg)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have
            .property("status")
            .eq("New movie successfully created");
          done();
        });
    });
    it("should return a validation error", function (done) {
      const invalidMovie = { ...newMovie };
      invalidMovie.title = "Toy Story";
      requester
        .post(`${baseEndpoint}`)
        .field(invalidMovie)
        .set("Authorization", access_token)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
  describe("4 - GET /movies", () => {
    it("should return the posted movie", function (done) {
      requester
        .get(baseEndpoint)
        .set("Authorization", access_token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.greaterThan(0);
          res.body[0].should.have.property("title");
          res.body[0].should.have.property("image");
          done();
        });
    });
    it("should return the posted movie", function (done) {
      requester
        .get(baseEndpoint + `?title=${newMovie.title}`)
        .set("Authorization", access_token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          let url = res.body[0].url.split("/");
          id = url[2];
          res.body.length.should.be.greaterThan(0);
          res.body[0].should.have.property("title");
          res.body[0].should.have.property("image");
          done();
        });
    });
  });
  describe("5 - GET /movies/:id", () => {
    it("should return a single movie", function (done) {
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
  describe("6 - PUT /movies/:id", () => {
    newMovie.title = "Tangled Updated";
    it("should update a movie", function (done) {
      requester
        .put(`${baseEndpoint}/${id}`)
        .set("Authorization", access_token)
        .field(newMovie)
        .attach("image", newMovieImg)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have
            .property("status")
            .eq("Movie successfully updated");
          done();
        });
    });
    it("should return a validation error", function (done) {
      requester
        .put(`${baseEndpoint}/${id}`)
        .field(newMovie)
        .set("Authorization", access_token)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it("should return 404 status code", function (done) {
      newMovie.title = "Not found";
      requester
        .put(`${baseEndpoint}/0`)
        .field(newMovie)
        .attach("image", newMovieImg)
        .set("Authorization", access_token)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
  describe("7 - DELETE /movies/:id", () => {
    it("should delete movie", function (done) {
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
    it("should return 404 status code", function (done) {
      requester
        .delete(`${baseEndpoint}/0`)
        .set("Authorization", access_token)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
  after(() => {
    requester.close();
  });
});
