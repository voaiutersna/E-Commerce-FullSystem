-- DropForeignKey
ALTER TABLE `Cart` DROP FOREIGN KEY `Cart_orderbyid_fkey`;

-- DropForeignKey
ALTER TABLE `ProductOnCart` DROP FOREIGN KEY `ProductOnCart_productId_fkey`;

-- DropIndex
DROP INDEX `Cart_orderbyid_fkey` ON `Cart`;

-- DropIndex
DROP INDEX `ProductOnCart_productId_fkey` ON `ProductOnCart`;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_orderbyid_fkey` FOREIGN KEY (`orderbyid`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductOnCart` ADD CONSTRAINT `ProductOnCart_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
