-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "area_trabajoId" INTEGER,
ADD COLUMN     "area_trabajo_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_area_trabajoId_fkey" FOREIGN KEY ("area_trabajoId") REFERENCES "Area_trabajo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
