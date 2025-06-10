/*
  Warnings:

  - Added the required column `fecha_emision` to the `Orden_Compra` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Orden_Compra" ADD COLUMN     "fecha_emision" TIMESTAMP(3) NOT NULL;
