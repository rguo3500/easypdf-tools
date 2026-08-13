CREATE TABLE `conversion_jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`providerJobId` varchar(128) NOT NULL,
	`tool` varchar(32) NOT NULL,
	`status` enum('waiting','processing','finished','error','expired') NOT NULL DEFAULT 'waiting',
	`inputKeys` text NOT NULL,
	`resultUrls` text,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`expiresAt` timestamp,
	CONSTRAINT `conversion_jobs_id` PRIMARY KEY(`id`),
	CONSTRAINT `conversion_jobs_providerJobId_unique` UNIQUE(`providerJobId`)
);
