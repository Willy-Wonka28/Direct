-- CreateEnum
CREATE TYPE "Token" AS ENUM ('SOL', 'USDT', 'BTC', 'ETH', 'BNB', 'BUSD', 'DAI', 'USDC', 'NGN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "token" "Token" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "amountNGN" DOUBLE PRECISION NOT NULL,
    "receiverAccountNo" TEXT NOT NULL,
    "receiverBank" TEXT NOT NULL,
    "receiverName" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);
