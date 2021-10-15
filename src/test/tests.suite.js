const bcrypt = require("bcryptjs");
const sequelize = require("../models/sequelize");
const { where } = require("sequelize");
const {
  user: User,
  genre: Genre,
  movie: Movie,
  character: Character,
} = sequelize.models;

before((done) => {
  sequelize
    .sync({ force: true })
    .then(async () => {
      return preloadTestData();
    })
    .then(() => {
      done();
    });
});

describe("Test API", () => {
  require("./authorization");
  require("./genres");
  require("./movies");
  require("./characters");
});
after(async () => {
  await removeTestData();
});
async function preloadTestData() {
  const testUser = {
    name: "Test User",
    email: "test@mail.com",
    password: await bcrypt.hash("111111", 12),
    status: 1,
  };
  const testGenre = {
    name: "Test Genre",
    image: "/images/test.jpg",
  };
  const testMovie = {
    title: "Test Movie",
    rating: "5",
    releaseDate: "1995-11-09T03:00:00.000Z",
    image: "/images/test.jpg",
  };
  const testCharacter = {
    name: "Test Character",
    age: 16,
    weight: 55,
    history: "lorem ipsum",
    image: "/images/test.jpg",
  };

  await User.create(testUser);
  const genre = await Genre.create(testGenre);
  const movie = await Movie.create(testMovie);
  await movie.addGenres([genre]);
  const character = await Character.create(testCharacter);
  await character.addMovies([movie]);
  return Promise.resolve();
}

async function removeTestData() {
  await Promise.all([
    (
      await User.findOne({
        where: {
          email: "test@mail.com",
        },
      })
    ).destroy(),
    (
      await Genre.findOne({
        where: {
          name: "Test Genre",
        },
      })
    ).destroy(),
    (
      await Movie.findOne({
        where: {
          title: "Test Movie",
        },
      })
    ).destroy(),
    (
      await Character.findOne({
        where: {
          name: "Test Character",
        },
      })
    ).destroy(),
  ]);

  return Promise.resolve();
}
