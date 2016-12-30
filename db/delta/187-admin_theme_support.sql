--

ALTER TABLE `administrators` ADD COLUMN `theme` VARCHAR(45) NOT NULL DEFAULT '';

--//@UNDO

ALTER TABLE `administrators` DROP COLUMN `theme`;

--