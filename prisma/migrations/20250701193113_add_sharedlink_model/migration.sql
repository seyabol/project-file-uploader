/*
  Warnings:

  - The primary key for the `SharedLink` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uuid` on the `SharedLink` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "SharedLink_uuid_key";

-- AlterTable
ALTER TABLE "SharedLink" DROP CONSTRAINT "SharedLink_pkey",
DROP COLUMN "uuid",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "SharedLink_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "SharedLink_id_seq";
