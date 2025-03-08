const axios = require("axios");
const fs = require("fs");
const path = require("path");

async function getAvailableTokens() {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/list"
    );
    const tokens = response.data.map((coin) => ({
      id: coin.id, // Coin ID (used in API requests)
      symbol: coin.symbol.toUpperCase(), // Symbol (e.g., BTC, SOL)
      name: coin.name, // Full name (e.g., Bitcoin)
    }));

    console.log("Available Tokens:", tokens.slice(0, 10)); // Show first 10 tokens

    // Write tokens to tokens.json file
    const filePath = path.join(__dirname, "tokens.json");
    fs.writeFileSync(filePath, JSON.stringify(tokens, null, 2));

    return tokens;
  } catch (error) {
    console.error("Error fetching tokens:", error.message);
    return [];
  }
}

// Call the function
getAvailableTokens();
