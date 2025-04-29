-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "run" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido_paterno" TEXT NOT NULL,
    "apellido_materno" TEXT NOT NULL,
    "fono" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "tipo_usuario" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Actividad" (
    "id_actividad" SERIAL NOT NULL,
    "fecha_actividad" TEXT NOT NULL,
    "hora_inic_activdad" TEXT NOT NULL,
    "hora_term_actividad" TEXT NOT NULL,
    "area_trabajo" TEXT NOT NULL,
    "run_alumno" TEXT NOT NULL,

    CONSTRAINT "Actividad_pkey" PRIMARY KEY ("id_actividad")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_run_key" ON "Usuario"("run");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_fono_key" ON "Usuario"("fono");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Actividad_run_alumno_key" ON "Actividad"("run_alumno");
