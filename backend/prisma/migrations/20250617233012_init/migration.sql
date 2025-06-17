-- CreateTable
CREATE TABLE "Reserva" (
    "id" TEXT NOT NULL,
    "canchaId" INTEGER NOT NULL,
    "canchaNombre" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "nombreUsuario" TEXT NOT NULL,
    "hora" TEXT NOT NULL,
    "creadaEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reserva_pkey" PRIMARY KEY ("id")
);
