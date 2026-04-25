-- AlterTable
ALTER TABLE `IzinKerja` ADD COLUMN `isProcessed` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Regu` MODIFY `totalAnggota` INTEGER NOT NULL DEFAULT 8;
