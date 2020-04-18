const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const repositoryId = repositories.findIndex(repository => repository.id == id);

  if (repositoryId < 0) {
    response.status(400).json({ error: "Repository not found."})
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryId].likes
  };

  repositories[repositoryId] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (req, res) => {
  const {id} = req.params;

  const repositoryId = repositories.findIndex(repository => repository.id == id);

  if (repositoryId < 0) {
    res.status(400).json({ error: "Repository not found."})
  }

  repositories.splice(repositoryId, 1);

  return res.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const repositoryId = repositories.findIndex(repository => repository.id == id);

  if (repositoryId < 0) {
    response.status(400).json({ error: "Repository not found."})
  }

  repositories[repositoryId].likes++;
  return response.json(repositories[repositoryId]);

  /*
  const repository = repositories[repositoryId];
  repository.likes = ++repository.likes;

  repositories[repositoryId] = repository;

  return response.json(repository);
  */
});

module.exports = app;
