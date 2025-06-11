/*
  Warnings:

  - You are about to drop the column `area_trabajoId` on the `Usuario` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_area_trabajoId_fkey";

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "area_trabajoId";

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_area_trabajo_id_fkey" FOREIGN KEY ("area_trabajo_id") REFERENCES "Area_trabajo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
