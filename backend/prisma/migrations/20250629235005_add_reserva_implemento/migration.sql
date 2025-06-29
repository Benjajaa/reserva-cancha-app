-- CreateTable
CREATE TABLE "ReservaImplemento" (
    "id" TEXT NOT NULL,
    "implementoId" INTEGER NOT NULL,
    "implementoNombre" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "nombreUsuario" TEXT NOT NULL,
    "hora" TEXT NOT NULL,
    "creadaEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReservaImplemento_pkey" PRIMARY KEY ("id")
);
