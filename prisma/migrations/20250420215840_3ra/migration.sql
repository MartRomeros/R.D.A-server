/*
  Warnings:

  - You are about to drop the `Alumno` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Alumno`;

-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `run` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `apellido_paterno` VARCHAR(191) NOT NULL,
    `apellido_materno` VARCHAR(191) NOT NULL,
    `fono` INTEGER NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `tipo_usuario` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Usuario_run_key`(`run`),
    UNIQUE INDEX `Usuario_fono_key`(`fono`),
    UNIQUE INDEX `Usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Actividad` (
    `id_actividad` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha_actividad` VARCHAR(191) NOT NULL,
    `hora_inic_activdad` VARCHAR(191) NOT NULL,
    `hora_term_actividad` VARCHAR(191) NOT NULL,
    `area_trabajo` VARCHAR(191) NOT NULL,
    `run_alumno` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Actividad_run_alumno_key`(`run_alumno`),
    PRIMARY KEY (`id_actividad`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
