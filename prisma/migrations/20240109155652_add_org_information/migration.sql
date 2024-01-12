-- CreateEnum
CREATE TYPE "BoardName" AS ENUM ('CBSE', 'CISCE', 'IB', 'NIOS', 'CAMBRIDGE', 'STATE_BOARD', 'OTHER');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('ENGLISH', 'HINDI');

-- CreateEnum
CREATE TYPE "IndianStates" AS ENUM ('Andhra_Pradesh', 'Arunachal_Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal_Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya_Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil_Nadu', 'Telangana', 'Tripura', 'Uttar_Pradesh', 'Uttarakhand', 'West_Bengal', 'Andaman_And_Nicobar_Islands', 'Chandigarh', 'Dadra_And_Nagar_Haveli_And_Daman_And_Diu', 'Lakshadweep', 'Delhi', 'Puducherry', 'Jammu_And_Kashmir', 'Ladakh');

-- AlterTable
ALTER TABLE "Org" ADD COLUMN     "brandName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "city" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "language_medium" "Language" NOT NULL DEFAULT 'ENGLISH',
ADD COLUMN     "language_native" TEXT,
ADD COLUMN     "pincode" INTEGER,
ADD COLUMN     "state" "IndianStates" NOT NULL DEFAULT 'Andhra_Pradesh',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Board" (
    "id" TEXT NOT NULL,
    "name" "BoardName" NOT NULL,
    "other" TEXT,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BoardToOrg" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BoardToOrg_AB_unique" ON "_BoardToOrg"("A", "B");

-- CreateIndex
CREATE INDEX "_BoardToOrg_B_index" ON "_BoardToOrg"("B");

-- AddForeignKey
ALTER TABLE "_BoardToOrg" ADD CONSTRAINT "_BoardToOrg_A_fkey" FOREIGN KEY ("A") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BoardToOrg" ADD CONSTRAINT "_BoardToOrg_B_fkey" FOREIGN KEY ("B") REFERENCES "Org"("id") ON DELETE CASCADE ON UPDATE CASCADE;
