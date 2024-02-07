import { randomUUID } from 'node:crypto';
import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const data = database.select('tasks');

      return res.end(JSON.stringify(data));  
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title) {
        return res.writeHead(400).end(JSON.stringify({ message: 'Title is required' }))
      }

      if (!description) {
        return res.writeHead(400).end(JSON.stringify({ message: 'Description is required' }))
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: null
      }

      database.insert('tasks', task);

      return res.writeHead(201).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;

      database.delete('tasks', id);

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      const data = database.select('tasks');
      const task = data.find((task) => task.id === id);

      if (!task) {
        return res.writeHead(404).end(JSON.stringify({ message: 'Task not found' }))
      }

     
      database.update('tasks', id, {
        ...task,
        title: title ? title : task.title,
        description: description ? description : task.description,
        updated_at: new Date().toISOString(),
      });

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params;

      const data = database.select('tasks');
      const task = data.find((task) => task.id === id);

      if (!task) {
        return res.writeHead(404).end(JSON.stringify({ message: 'Task not found' }))
      }

     
      database.update('tasks', id, {
        ...task,
        updated_at: new Date().toISOString(),
        completed_at: !task.completed_at ? true : !task.completed_at,
      });

      return res.writeHead(204).end()
    }
  }
]