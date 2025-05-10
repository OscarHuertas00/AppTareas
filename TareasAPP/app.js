const express = require('express');
const axios = require('axios');  // Para hacer peticiones HTTP
const app = express();
const port = process.env.PORT || 3000;

// Tu URL de Google Apps Script API (asegúrate de reemplazarla con la tuya)
const googleScriptApiUrl = 'https://script.google.com/macros/s/AKfycbybYdkw1fDJfsJrUV7VHX6MYRe1kzYD9eHI-UUJIeyWUPU33CCQEGD5Ca5JtbvlrzP_/exec';

// Middleware para procesar datos de formulario (si usas POST con formulario)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Ruta para obtener todas las tareas
app.get('/tasks', async (req, res) => {
  try {
    const response = await axios.get(`${googleScriptApiUrl}?action=getTasks`);
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error al obtener tareas');
  }
});

// Ruta para agregar una tarea
app.post('/tasks', async (req, res) => {
  const { task } = req.body;
  if (!task) {
    return res.status(400).send('Se debe proporcionar una tarea');
  }

  try {
    await axios.post(`${googleScriptApiUrl}`, {
      action: 'addTask',
      task: task
    });
    res.status(201).send('Tarea agregada con éxito');
  } catch (error) {
    res.status(500).send('Error al agregar tarea');
  }
});

// Ruta para marcar una tarea como completada
app.post('/complete-task', async (req, res) => {
  const { row } = req.body;
  if (!row) {
    return res.status(400).send('Se debe proporcionar el número de fila');
  }

  try {
    await axios.post(`${googleScriptApiUrl}`, {
      action: 'completeTask',
      row: row
    });
    res.send('Tarea completada');
  } catch (error) {
    res.status(500).send('Error al completar tarea');
  }
});

// Ruta principal para probar
app.get('/', (req, res) => {
  res.send('¡Hola, bienvenido a mi API de tareas!');
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
