/*
  Warnings:

  - The primary key for the `Alumno` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `Alumno` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Alumno` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[run_alumno]` on the table `Alumno` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[fono_alumno]` on the table `Alumno` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email_alumno]` on the table `Alumno` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `apellido_materno_alumno` to the `Alumno` table without a default value. This is not possible if the table is not empty.
  - Added the required column `apellido_paterno_alumno` to the `Alumno` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email_alumno` to the `Alumno` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fono_alumno` to the `Alumno` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_alumno` to the `Alumno` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre_alumno` to the `Alumno` table without a default value. This is not possible if the table is not empty.
  - Added the required column `run_alumno` to the `Alumno` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Alumno_email_key` ON `Alumno`;

-- AlterTable
ALTER TABLE `Alumno` DROP PRIMARY KEY,
    DROP COLUMN `email`,
    DROP COLUMN `id`,
    ADD COLUMN `apellido_materno_alumno` VARCHAR(191) NOT NULL,
    ADD COLUMN `apellido_paterno_alumno` VARCHAR(191) NOT NULL,
    ADD COLUMN `email_alumno` VARCHAR(191) NOT NULL,
    ADD COLUMN `fono_alumno` INTEGER NOT NULL,
    ADD COLUMN `id_alumno` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `nombre_alumno` VARCHAR(191) NOT NULL,
    ADD COLUMN `run_alumno` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id_alumno`);

-- CreateIndex
CREATE UNIQUE INDEX `Alumno_run_alumno_key` ON `Alumno`(`run_alumno`);

-- CreateIndex
CREATE UNIQUE INDEX `Alumno_fono_alumno_key` ON `Alumno`(`fono_alumno`);

-- CreateIndex
CREATE UNIQUE INDEX `Alumno_email_alumno_key` ON `Alumno`(`email_alumno`);
