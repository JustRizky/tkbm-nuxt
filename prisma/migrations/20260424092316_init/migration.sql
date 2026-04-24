/*
  Warnings:

  - You are about to drop the column `shift` on the `Jadwal` table. All the data in the column will be lost.
  - Added the required column `jenis` to the `Jadwal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shiftId` to the `Jadwal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Jadwal` DROP COLUMN `shift`,
    ADD COLUMN `jenis` VARCHAR(191) NOT NULL,
    ADD COLUMN `namaKapal` VARCHAR(191) NULL,
    ADD COLUMN `shiftId` INTEGER NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'Aanvraag',
    MODIFY `tanggal` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `Jadwal` ADD CONSTRAINT `Jadwal_shiftId_fkey` FOREIGN KEY (`shiftId`) REFERENCES `Shift`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
