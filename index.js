const express = require('express');
const server = express();

server.use(express.json());

let projects = [];

function countReq(req, res, next) {
  console.count('Requisições');
  return next();
}


function checkProjectExist(req, res, next){
  const { id } = !req.body.id ? req.params : req.body;

  const project = projects.find(project => project.id === id );

  if(!project && req.url.toUpperCase() !== '/PROJECTS' ) {
    return res.status(400).json({ error : "Project not found"});
  }
 
  if(project) {
    req.project = project;
  }

  return next();
}

server.use(countReq);

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.post('/projects', checkProjectExist, (req, res) => {
  if(req.project) {
    return res.status(400).json({ error : "Project id already exists"});
  }
  
  const { id, title } = req.body;
  const project = {id, title, tasks: []};

  projects.push(project);

  return res.json(project);
});

server.post('/projects/:id/tasks', checkProjectExist, (req, res) => {
  
  const { title } = req.body;
  const { id } = req.params;

  const project = projects.find(project => project.id === id );
  project.tasks.push( title );

  return res.json(project);
});

server.put('/projects/:id', checkProjectExist, (req, res) => {
  
  const { title } = req.body;
  const { id } = req.params;

  const project = projects.find(project => project.id === id );
  project.title = title;

  return res.json(project);
});

server.delete('/projects/:id', checkProjectExist, (req, res) => {
  
  projects = projects.filter(project => project.id !== req.project.id );

  return res.json();
});

server.listen(3000);