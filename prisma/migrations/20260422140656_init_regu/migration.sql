/*
  Warnings:

  - You are about to drop the `jadwal_kerja` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `regu_kerja` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `reguId` INTEGER NULL;

-- DropTable
DROP TABLE `jadwal_kerja`;

-- DropTable
DROP TABLE `regu_kerja`;

-- CreateTable
CREATE TABLE `Regu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomorRegu` VARCHAR(191) NOT NULL,
    `jenis` ENUM('KAPAL', 'DARAT') NOT NULL DEFAULT 'KAPAL',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Regu_nomorRegu_key`(`nomorRegu`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Jadwal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tanggal` DATETIME(3) NOT NULL,
    `shift` INTEGER NOT NULL,
    `reguId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_reguId_fkey` FOREIGN KEY (`reguId`) REFERENCES `Regu`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Jadwal` ADD CONSTRAINT `Jadwal_reguId_fkey` FOREIGN KEY (`reguId`) REFERENCES `Regu`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
