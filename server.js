// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Base de datos en memoria (para demostración)
let registros = [
    { id: 1, nombre: 'Juan Pérez', email: 'juan@email.com', edad: 25, profesion: 'Desarrollador' },
    { id: 2, nombre: 'María García', email: 'maria@email.com', edad: 30, profesion: 'Diseñadora' },
    { id: 3, nombre: 'Carlos López', email: 'carlos@email.com', edad: 28, profesion: 'Contador' }
];

let nextId = 4;

// Rutas para servir la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes

// GET - Obtener todos los registros
app.get('/api/registros', (req, res) => {
    res.json(registros);
});

// GET - Obtener un registro por ID
app.get('/api/registros/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const registro = registros.find(r => r.id === id);
    
    if (!registro) {
        return res.status(404).json({ error: 'Registro no encontrado' });
    }
    
    res.json(registro);
});

// POST - Crear un nuevo registro
app.post('/api/registros', (req, res) => {
    const { nombre, email, edad, profesion } = req.body;
    
    // Validación básica
    if (!nombre || !email || !edad || !profesion) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    
    const nuevoRegistro = {
        id: nextId++,
        nombre,
        email,
        edad: parseInt(edad),
        profesion
    };
    
    registros.push(nuevoRegistro);
    res.status(201).json(nuevoRegistro);
});

// PUT - Actualizar un registro
app.put('/api/registros/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nombre, email, edad, profesion } = req.body;
    
    const index = registros.findIndex(r => r.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Registro no encontrado' });
    }
    
    // Validación básica
    if (!nombre || !email || !edad || !profesion) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    
    registros[index] = {
        id,
        nombre,
        email,
        edad: parseInt(edad),
        profesion
    };
    
    res.json(registros[index]);
});

// DELETE - Eliminar un registro
app.delete('/api/registros/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = registros.findIndex(r => r.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Registro no encontrado' });
    }
    
    const registroEliminado = registros.splice(index, 1)[0];
    res.json({ message: 'Registro eliminado', registro: registroEliminado });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Ruta para manejar 404
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});