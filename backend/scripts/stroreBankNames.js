const banks = require("../src/constants/banks-paystack.json");
const fs = require("fs");
const path = require("path");

bankNames = banks.map((bank) => bank.name);
const filePath = path.join(__dirname, "bankNames-paystack.json");
fs.writeFileSync(filePath, JSON.stringify(bankNames, null, 2));
