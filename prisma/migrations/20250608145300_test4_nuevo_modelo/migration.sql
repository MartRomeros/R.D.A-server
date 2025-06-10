/*
  Warnings:

  - You are about to drop the column `solicitud_id` on the `Actividad` table. All the data in the column will be lost.
  - Added the required column `id_actividad` to the `Solicitud` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Actividad" DROP CONSTRAINT "Actividad_solicitud_id_fkey";

-- DropIndex
DROP INDEX "Actividad_solicitud_id_key";

-- AlterTable
ALTER TABLE "Actividad" DROP COLUMN "solicitud_id";

-- AlterTable
ALTER TABLE "Solicitud" ADD COLUMN     "id_actividad" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_id_actividad_fkey" FOREIGN KEY ("id_actividad") REFERENCES "Actividad"("id_actividad") ON DELETE RESTRICT ON UPDATE CASCADE;
