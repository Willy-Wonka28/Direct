-- CreateEnum
CREATE TYPE "Token" AS ENUM ('SOL', 'USDT', 'BTC', 'ETH', 'BNB', 'BUSD', 'DAI', 'USDC');

-- CreateEnum
CREATE TYPE "ReceiverCurrency" AS ENUM ('USD', 'EUR', 'GBP', 'NGN', 'JPY', 'CAD', 'AUD', 'CNY', 'INR', 'RUB', 'BRL', 'IDR', 'MXN', 'ZAR', 'CHF', 'HKD', 'KRW', 'SGD', 'THB', 'AED', 'ARS', 'CZK', 'DKK', 'HUF', 'ILS', 'MYR', 'NOK', 'NZD', 'PHP', 'PLN', 'RON', 'SEK', 'TRY', 'TWD', 'UAH', 'VND', 'BHD', 'BGN', 'CLP', 'COP', 'EGP', 'HRK', 'ISK', 'JOD', 'KES', 'KWD', 'LKR', 'MAD', 'OMR', 'PKR', 'QAR', 'SAR', 'BDT');

-- CreateEnum
CREATE TYPE "Bank" AS ENUM ('ACCESS_BANK', 'GTBANK_PLC', 'ZENITH_BANK_PLC', 'UNITED_BANK_FOR_AFRICA', 'FIRST_BANK_OF_NIGERIA', 'STERLING_BANK', 'ECOBANK_BANK', 'POLARIS_BANK', 'WEMA_BANK', 'UNITY_BANK', 'FIDELITY_BANK', 'PROVIDUS_BANK', 'KUDA_MICROFINANCE_BANK', 'PALMPAY', 'OPAY');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "senderToken" "Token" NOT NULL,
    "senderAmount" DOUBLE PRECISION NOT NULL,
    "receiverAmount" DOUBLE PRECISION NOT NULL,
    "receiverCurrency" "ReceiverCurrency" NOT NULL DEFAULT 'NGN',
    "receiverAccountNo" TEXT NOT NULL,
    "receiverBank" "Bank" NOT NULL,
    "receiverName" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);
