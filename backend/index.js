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
  const { canchaId, canchaNombre, fecha, hora, nombreUsuario } = req.body;

  // Validación simple de los datos recibidos
  if (!canchaId || !canchaNombre || !fecha || !hora || !nombreUsuario) {
    return res.status(400).json({ message: 'Todos los campos son requeridos.' });
  }

  try {
    // 1. VERIFICAR SI EL HORARIO YA ESTÁ OCUPADO
    const fechaReserva = new Date(`${fecha}T00:00:00.000Z`);
    const reservaExistente = await prisma.reserva.findFirst({
      where: {
        fecha: fechaReserva,
        hora: hora,
        canchaId: canchaId,
      },
    });

    if (reservaExistente) {
      // Si ya existe, enviamos un error de "Conflicto"
      return res.status(409).json({ message: 'Este horario ya está reservado.' });
    }

    // 2. CREAR LA NUEVA RESERVA si el horario está libre
    const nuevaReserva = await prisma.reserva.create({
      data: {
        canchaId,
        canchaNombre,
        fecha: fechaReserva,
        hora,
        nombreUsuario,
      },
    });

    // Enviamos una respuesta de "Creado" con los datos de la nueva reserva
    res.status(201).json(nuevaReserva);
  } catch (error) {
    console.error('Error al crear la reserva:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});


// --- FIN DE RUTAS DE LA API ---


app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});