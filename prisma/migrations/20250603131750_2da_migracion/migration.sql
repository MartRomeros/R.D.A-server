/*
  Warnings:

  - Changed the type of `fecha_actividad` on the `Actividad` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `hora_inic_activdad` on the `Actividad` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `hora_term_actividad` on the `Actividad` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Actividad" DROP COLUMN "fecha_actividad",
ADD COLUMN     "fecha_actividad" TIMESTAMP(3) NOT NULL,
DROP COLUMN "hora_inic_activdad",
ADD COLUMN     "hora_inic_activdad" TIMESTAMP(3) NOT NULL,
DROP COLUMN "hora_term_actividad",
ADD COLUMN     "hora_term_actividad" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Actividad" ADD CONSTRAINT "Actividad_run_alumno_fkey" FOREIGN KEY ("run_alumno") REFERENCES "Usuario"("run") ON DELETE RESTRICT ON UPDATE CASCADE;
