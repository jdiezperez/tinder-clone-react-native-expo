/*
  Warnings:

  - A unique constraint covering the columns `[fromId,toId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userAId,userBId]` on the table `Match` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userAId,userBId]` on the table `Swipe` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE `Message` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `matchId` INTEGER NOT NULL,
    `senderId` INTEGER NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Like_fromId_toId_key` ON `Like`(`fromId`, `toId`);

-- CreateIndex
CREATE UNIQUE INDEX `Match_userAId_userBId_key` ON `Match`(`userAId`, `userBId`);

-- CreateIndex
CREATE UNIQUE INDEX `Swipe_userAId_userBId_key` ON `Swipe`(`userAId`, `userBId`);

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_matchId_fkey` FOREIGN KEY (`matchId`) REFERENCES `Match`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
