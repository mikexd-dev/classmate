/*
  Warnings:

  - You are about to drop the column `fileKey` on the `Chats` table. All the data in the column will be lost.
  - You are about to drop the column `pdfName` on the `Chats` table. All the data in the column will be lost.
  - You are about to drop the column `pdfUrl` on the `Chats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chats" DROP COLUMN "fileKey",
DROP COLUMN "pdfName",
DROP COLUMN "pdfUrl";
