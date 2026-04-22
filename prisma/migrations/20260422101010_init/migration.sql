-- CreateTable
CREATE TABLE `Regu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_regu` VARCHAR(191) NOT NULL,
    `tipe` VARCHAR(191) NOT NULL,
    `jumlah_tkbm` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
