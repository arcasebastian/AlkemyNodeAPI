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
describe("Characters API endpoint", () => {
  let requester;
  const baseEndpoint = "/characters";
  const newCharacter = {
    name: "Rapunzel",
    age: 21,
    weight: 52,
    history:
      "Rapunzel may have lived her entire life locked inside a hidden tower. Rapunzel is full of curiosity about the outside world, and she can't help but feel that her true destiny lies outside the lonely tower walls.",
    movies: "1",
  };
  const newCharacterImage = path.join(__dirname, "test_files", "rapunzel.jpg");

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
          done();
        } else {
          throw err;
        }
      });
  });

  describe("0 - Unauthorized /characters", () => {
    it("should get a 401 unauthorized status code", function () {
      requester.get(baseEndpoint).end((err, res) => {
        res.should.have.status(401);
      });
    });
  });
  describe("1 - OPTIONS /characters", () => {
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
  describe("2 - POST /characters", () => {
    it("should create a new character", function (done) {
      requester
        .post(baseEndpoint)
        .set("Authorization", access_token)
        .field(newCharacter)
        .attach("image", newCharacterImage)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have
            .property("status")
            .eq("New character successfully created");
          done();
        });
    });
    it("should return a validation error", function (done) {
      const invalidCharacter = { ...newCharacter };
      invalidCharacter.name = "";
      requester
        .post(baseEndpoint)
        .set("Authorization", access_token)
        .field(invalidCharacter)
        .attach("image", newCharacterImage)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.to.include.all.keys("error", "httpCode");
          done();
        });
    });
  });
  describe("3 - GET /characters", () => {
    it("should return a list of characters", function (done) {
      requester
        .get(baseEndpoint + `?name=${newCharacter.name}`)
        .set("Authorization", access_token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          let url = res.body[0].url.split("/");
          id = url[2];
          res.body.length.should.be.greaterThan(0);
          res.body[0].should.to.include.all.keys("url", "name", "image");
          done();
        });
    });
  });
  describe("4 - GET /characters/:id", () => {
    it("should return a single character", function (done) {
      requester
        .get(`${baseEndpoint}/${id}`)
        .set("Authorization", access_token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.to.include.all.keys(
            "name",
            "age",
            "weight",
            "image",
            "history",
            "movies"
          );
          done();
        });
    });
    it("should return 404 status code", function (done) {
      requester
        .get(`${baseEndpoint}/0`)
        .set("Authorization", access_token)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
  describe("5 - PUT /characters/:id", () => {
    it("should update a character", function (done) {
      newCharacter.age = 30;
      requester
        .put(`${baseEndpoint}/${id}`)
        .set("Authorization", access_token)
        .field(newCharacter)
        .attach("image", newCharacterImage)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have
            .property("status")
            .eq("Character successfully updated");
          done();
        });
    });
  });
  describe("6 - DELETE /characters/:id", () => {
    it("should delete character", function (done) {
      requester
        .delete(`${baseEndpoint}/${id}`)
        .set("Authorization", access_token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have
            .property("status")
            .eq("Character was successfully deleted");
          done();
        });
    });
  });
  after(() => {
    requester.close();
  });
});
