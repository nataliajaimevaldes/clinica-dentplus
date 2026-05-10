/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Affiliate` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Affiliate_email_key" ON "Affiliate"("email");
