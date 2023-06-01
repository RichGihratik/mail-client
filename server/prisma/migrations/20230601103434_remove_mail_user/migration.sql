/*
  Warnings:

  - You are about to drop the column `fromName` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `toName` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `MailUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `from` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_fromName_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_toName_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "fromName",
DROP COLUMN "toName",
ADD COLUMN     "from" TEXT NOT NULL,
ADD COLUMN     "to" TEXT NOT NULL;

-- DropTable
DROP TABLE "MailUser";
