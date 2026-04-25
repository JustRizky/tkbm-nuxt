-- CreateTable
CREATE TABLE `IzinKerja` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tanggal` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `reguId` INTEGER NOT NULL,
    `alasan` TEXT NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Menunggu Persetujuan',
    `shiftId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `IzinKerja` ADD CONSTRAINT `IzinKerja_reguId_fkey` FOREIGN KEY (`reguId`) REFERENCES `Regu`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
