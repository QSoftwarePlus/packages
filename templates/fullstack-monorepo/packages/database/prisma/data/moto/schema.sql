DROP TABLE IF EXISTS `motos`;

CREATE TABLE `motos` (
    id int NOT NULL AUTO_INCREMENT,
    `version` varchar(255) NOT NULL,
    `make` varchar(255) NOT NULL,
    `model` varchar(255) NOT NULL,
    `locale` varchar(6) NOT NULL,
    `tenant` varchar(24),
    PRIMARY KEY (id)
);