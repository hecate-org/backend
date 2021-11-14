/*
  Warnings:

  - You are about to drop the `SocketConnection` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `Channel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SocketConnection" DROP CONSTRAINT "SocketConnection_userId_fkey";

-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "type" SET DEFAULT E'message';

-- DropTable
DROP TABLE "SocketConnection";
