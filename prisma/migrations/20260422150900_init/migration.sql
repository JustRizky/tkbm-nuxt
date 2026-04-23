/*
  Warnings:

  - You are about to drop the column `nomorRegu` on the `Regu` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nomorKRK]` on the table `Regu` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nomorKRK` to the `Regu` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Regu_nomorRegu_key` ON `Regu`;

-- AlterTable
ALTER TABLE `Regu` DROP COLUMN `nomorRegu`,
    ADD COLUMN `nomorKRK` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Regu_nomorKRK_key` ON `Regu`(`nomorKRK`);
