/*
  Warnings:

  - You are about to drop the column `area_trabajo` on the `Actividad` table. All the data in the column will be lost.
  - You are about to drop the column `tipo_usuario` on the `Usuario` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[solicitud_id]` on the table `Actividad` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `area_trabajo_id` to the `Actividad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `solicitud_id` to the `Actividad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orden_compra_id` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo_usuario_id` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Actividad" DROP COLUMN "area_trabajo",
ADD COLUMN     "area_trabajo_id" INTEGER NOT NULL,
ADD COLUMN     "solicitud_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "tipo_usuario",
ADD COLUMN     "orden_compra_id" INTEGER NOT NULL,
ADD COLUMN     "tipo_usuario_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Tipo_usuario" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "Tipo_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orden_Compra" (
    "id" SERIAL NOT NULL,
    "numero_oc" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,

    CONSTRAINT "Orden_Compra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Solicitud" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT,
    "estado" BOOLEAN NOT NULL,
    "id_alumno" INTEGER NOT NULL,

    CONSTRAINT "Solicitud_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Area_trabajo" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Area_trabajo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tipo_usuario_descripcion_key" ON "Tipo_usuario"("descripcion");

-- CreateIndex
CREATE UNIQUE INDEX "Orden_Compra_numero_oc_key" ON "Orden_Compra"("numero_oc");

-- CreateIndex
CREATE UNIQUE INDEX "Area_trabajo_nombre_key" ON "Area_trabajo"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Actividad_solicitud_id_key" ON "Actividad"("solicitud_id");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_tipo_usuario_id_fkey" FOREIGN KEY ("tipo_usuario_id") REFERENCES "Tipo_usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orden_Compra" ADD CONSTRAINT "Orden_Compra_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_id_alumno_fkey" FOREIGN KEY ("id_alumno") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actividad" ADD CONSTRAINT "Actividad_area_trabajo_id_fkey" FOREIGN KEY ("area_trabajo_id") REFERENCES "Area_trabajo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actividad" ADD CONSTRAINT "Actividad_solicitud_id_fkey" FOREIGN KEY ("solicitud_id") REFERENCES "Solicitud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
