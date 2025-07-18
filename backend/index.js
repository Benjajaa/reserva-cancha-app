// backend/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Cargar variables de entorno del archivo .env
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡El API de Reservas está funcionando correctamente!');
});

// --- INICIO DE RUTAS DE LA API ---

/**
 * @route   GET /api/reservas
 * @desc    Obtener todas las reservas para una fecha específica
 * @access  Public
 * @query   fecha (formato YYYY-MM-DD)
 */
app.get('/api/reservas', async (req, res) => {
  const { fecha } = req.query;

  if (!fecha) {
    return res.status(400).json({ message: 'La fecha es un parámetro requerido.' });
  }

  try {
    const inicioDia = new Date(`${fecha}T00:00:00.000Z`);
    const finDia = new Date(`${fecha}T23:59:59.999Z`);

    const reservas = await prisma.reserva.findMany({
      where: {
        fecha: {
          gte: inicioDia, // gte = Greater than or equal to (mayor o igual que)
          lte: finDia,    // lte = Less than or equal to (menor o igual que)
        },
      },
      orderBy: {
        hora: 'asc', // Ordena las reservas por hora
      },
    });
    res.json(reservas);
  } catch (error) {
    console.error('Error al obtener las reservas:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

/**
 * @route   POST /api/reservas
 * @desc    Crear una nueva reserva
 * @access  Public
 */
app.post('/api/reservas', async (req, res) => {
  const { canchaId, canchaNombre, fecha, hora, usuario } = req.body;

  // Validación simple de los datos recibidos
  if (!canchaId || !canchaNombre || !fecha || !hora || !usuario) {
    return res.status(400).json({ message: 'Todos los campos son requeridos.' });
  }

  try {
    const fechaReserva = new Date(`${fecha}T00:00:00.000Z`);
    const reservaExistente = await prisma.reserva.findFirst({
      where: {
        fecha: fechaReserva,
        hora: hora,
        canchaId: canchaId,
      },
    });

    if (reservaExistente) {
      return res.status(409).json({ message: 'Este horario ya está reservado.' });
    }

    const nuevaReserva = await prisma.reserva.create({
      data: {
        canchaId,
        canchaNombre,
        fecha: fechaReserva,
        hora,
        nombreUsuario: usuario,
      },
    });

    console.log('¡Éxito! Reserva creada:', nuevaReserva);
    res.status(201).json(nuevaReserva);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// --- Rutas para reservas de implementos ---
/**
 * @route   GET /api/reservas-implementos
 * @desc    Obtener reservas de implementos para una fecha específica
 * @query   fecha, implementoId
 */
app.get('/api/reservas-implementos', async (req, res) => {
  const { fecha, implementoId } = req.query;

  if (!fecha || !implementoId) {
    return res.status(400).json({ message: 'Fecha e implementoId son requeridos.' });
  }

  try {
    const inicioDia = new Date(`${fecha}T00:00:00.000Z`);
    const finDia = new Date(`${fecha}T23:59:59.999Z`);

    const reservas = await prisma.reservaImplemento.findMany({
      where: {
        fecha: {
          gte: inicioDia,
          lte: finDia,
        },
        implementoId: parseInt(implementoId),
      },
      orderBy: {
        hora: 'asc',
      },
    });

    res.json(reservas);
  } catch (error) {
    console.error('Error al obtener reservas de implementos:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

/**
 * @route   POST /api/reservas-implementos
 * @desc    Crear una reserva para implemento
 */
app.post('/api/reservas-implementos', async (req, res) => {
  const { implementoId, implementoNombre, fecha, hora, usuario } = req.body;

  if (!implementoId || !implementoNombre || !fecha || !hora || !usuario) {
    return res.status(400).json({ message: 'Todos los campos son requeridos.' });
  }

  try {
    const fechaReserva = new Date(`${fecha}T00:00:00.000Z`);

    const reservaExistente = await prisma.reservaImplemento.findFirst({
      where: {
        fecha: fechaReserva,
        hora: hora,
        implementoId: implementoId,
      },
    });

    if (reservaExistente) {
      return res.status(409).json({ message: 'Este horario ya está reservado para este implemento.' });
    }

    const nuevaReserva = await prisma.reservaImplemento.create({
      data: {
        implementoId,
        implementoNombre,
        fecha: fechaReserva,
        hora,
        nombreUsuario: usuario,
      },
    });

    console.log('Reserva de implemento creada:', nuevaReserva);
    res.status(201).json(nuevaReserva);
  } catch (error) {
    console.error('Error al crear la reserva de implemento:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});
