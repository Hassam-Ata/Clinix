/*
  Warnings:

  - You are about to drop the column `doctorFee` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `isPaid` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `platformFee` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSessionId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `totalFee` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `availability` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `document` on the `Doctor` table. All the data in the column will be lost.
  - Added the required column `endTime` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `documentUrl` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `specialization` on the `Doctor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DoctorSpecialization" AS ENUM ('CARDIOLOGIST', 'DERMATOLOGIST', 'NEUROLOGIST', 'ORTHOPEDIC', 'PEDIATRICIAN', 'PSYCHIATRIST', 'GYNECOLOGIST', 'GENERAL_PHYSICIAN');

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "doctorFee",
DROP COLUMN "isPaid",
DROP COLUMN "platformFee",
DROP COLUMN "stripeSessionId",
DROP COLUMN "totalFee",
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "availability",
DROP COLUMN "document",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "documentUrl" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "specialization",
ADD COLUMN     "specialization" "DoctorSpecialization" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Availability" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
