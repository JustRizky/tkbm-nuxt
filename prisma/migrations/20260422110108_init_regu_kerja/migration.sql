/*
  Warnings:

  - You are about to drop the `Regu` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `role` VARCHAR(191) NOT NULL DEFAULT 'admin';

-- DropTable
DROP TABLE `Regu`;

-- CreateTable
CREATE TABLE `regu_kerja` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomor_krk` VARCHAR(191) NOT NULL,
    `nama_krk` VARCHAR(191) NOT NULL,
    `tipe` ENUM('KAPAL', 'DARAT') NOT NULL,
    `jumlah_anggota` INTEGER NOT NULL DEFAULT 8,
    `urutan_terakhir` INTEGER NULL,
    `is_aktif` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `regu_kerja_nomor_krk_key`(`nomor_krk`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jadwal_kerja` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tanggal` DATETIME(3) NOT NULL,
    `shift` INTEGER NOT NULL,
    `regu_id` INTEGER NOT NULL,
    `keterangan` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
