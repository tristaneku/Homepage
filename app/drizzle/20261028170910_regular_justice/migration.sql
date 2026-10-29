CREATE TABLE `scores` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`score` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `highscore` ON `scores` (`score`);