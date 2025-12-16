# zkFetch Cardano Example

A comprehensive example illustrating how to store Reclaim Protocol proofs' identifiers and responses on the Cardano blockchain. This project demonstrates fetching real-world data (ADA price) and storing it as verifiable metadata in Cardano transactions.

## Features

- **TypeScript Support**: Full TypeScript implementation with proper type definitions
- **Modular Architecture**: Well-organized code structure with separate modules for wallet, proof, and transaction handling
- **Configuration Management**: Environment-based configuration with sensible defaults
- **Comprehensive Testing**: Unit tests for all major components
- **Error Handling**: Robust error handling and validation throughout
- **CLI Interface**: Easy-to-use command-line interface for all operations
- **Code Quality**: ESLint and Prettier configuration for consistent code style

## Prerequisites

- **Node.js** (v18 or higher)
- **Deno** (v1.40 or higher) - [Installation Guide](https://docs.deno.com/runtime/getting_started/installation/)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/reclaimprotocol/zkfetch-cardano-example
cd zkfetch-cardano-example
```

2. Install dependencies and download zk files (this takes some time):
```bash
npm install && npm run download-zk-files
```

3. (Optional) Set up custom environment variables:
```bash
# Only needed if you want to override default settings
export BLOCKFROST_URL="your_custom_url"
export BLOCKFROST_API_KEY="your_custom_key"
export CARDANO_NETWORK="Preprod"
```

## Quick Start

### Option 1: Complete Workflow
Run the entire workflow in one command:
```bash
npm run start
# or
deno run --allow-net --allow-write --allow-read --allow-env src/index.ts
```

### Option 2: Step-by-Step

1. **Create a wallet**:
```bash
npm run create-wallet
# or
deno run --allow-net --allow-write --allow-read --allow-env src/wallet/createWallet.ts
```

2. **Fund with tADA on Preprod**:
   - Visit: https://docs.cardano.org/cardano-testnets/tools/faucet
   - Use the generated address from step 1

3. **Request a proof**:
```bash
# ADA price proof (default)
npm run request-proof
# or
node requestProof.js

# Sports scores proof
npm run request-proof-sports
# or
node requestProof.js sports-proof.json sports

# GDP data proof
npm run request-proof-gdp
# or
node requestProof.js gdp-proof.json gdp

# Forbes billionaires proof
npm run request-proof-forbes
# or
node requestProof.js forbes-proof.json forbes

# Weather data proof
npm run request-proof-weather
# or
node requestProof.js weather-proof.json weather

# Custom usage
node requestProof.js [output-file] [data-source]
```

4. **Send transaction**:
```bash
npm run send-transaction
# or
deno run --allow-net --allow-write --allow-read --allow-env src/transaction/sendTransaction.ts
```

## Project Structure

```
zkfetch-cardano-example/
├── src/                          # Source code
│   ├── wallet/                   # Wallet creation functionality
│   │   └── createWallet.ts
│   ├── transaction/              # Transaction sending functionality
│   │   └── sendTransaction.ts
│   ├── utils/                    # Utility functions
│   │   ├── fileUtils.ts
│   │   └── validation.ts
│   └── index.ts                  # Main entry point
├── requestProof.js               # Proof request functionality (Node.js)
├── config/                       # Configuration management
│   └── index.ts
├── types/                        # TypeScript type definitions
│   └── index.ts
├── tests/                        # Test files
│   ├── wallet.test.ts
│   ├── proof.test.ts
│   └── requestProof.test.js
├── docs/                         # Documentation
├── .eslintrc.json               # ESLint configuration
├── .prettierrc                  # Prettier configuration
├── tsconfig.json                # TypeScript configuration
├── deno.json                    # Deno configuration
└── package.json                 # Node.js configuration
```

## Testing

Run all tests:
```bash
npm run test:all
```

Run specific test suites:
```bash
# Wallet creation tests
npm run test:wallet

# Proof generation tests
npm run test:proof

# Integration tests
npm run test:integration

# Request proof tests (Node.js)
npm run test:request
```

## Development

### Code Quality
```bash
# Lint code
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check
```

### Development Mode
```bash
# Watch mode for development
npm run dev
```

### Build Check
```bash
# Type check without compilation
npm run build
```

## Configuration

The application uses sensible defaults for all public credentials. You can optionally override settings using environment variables:

- `BLOCKFROST_URL`: Cardano network API URL (default: preprod endpoint)
- `BLOCKFROST_API_KEY`: Your Blockfrost API key (default: provided test key)
- `CARDANO_NETWORK`: Network to use (default: Preprod)
- `ADDRESS_DETAILS_PATH`: Path for wallet details file (default: addressDetails.json)
- `PROOF_PATH`: Path for proof data file (default: proof.json)

**Note**: Reclaim Protocol credentials are public and included by default.

## Example Transaction

View a real example transaction with metadata:
https://preprod.cexplorer.io/tx/c36ba27f9124ec345b3a54bde3212aef834f91e203d2c8bf32a2f1f474ac5b4f?tab=metadata

## Further Exploration

### Alternative Data Sources

The `requestProof.js` script now supports multiple data sources:

**ADA Price (Default)**:
```bash
node requestProof.js
```

**Sports Scores from Goal.com** (Note: May require additional setup):
```bash
node requestProof.js sports-proof.json sports
```

**GDP Data from Trading Economics** (Note: May require additional setup):
```bash
node requestProof.js gdp-proof.json gdp
```

**Forbes Billionaires Data**:
```bash
node requestProof.js forbes-proof.json forbes
```

**Weather Data from AccuWeather**:
```bash
node requestProof.js weather-proof.json weather
```

**Custom Usage**:
```bash
node requestProof.js [output-file] [data-source]
```

Available data sources:
- `ada` - Fetch ADA price from CoinGecko (default)
- `sports` - Fetch live sports scores from Goal.com
- `gdp` - Fetch GDP data from Trading Economics
- `forbes` - Fetch Forbes billionaires data
- `weather` - Fetch weather data from AccuWeather

For help and more examples:
```bash
node requestProof.js --help
```

## Additional Data Sources


| Name | Endpoint | Regex | extractedParameterValues Example | Use Case (Data Fetched) |
|:-----------|:-----------------|:--------------|:--------------|:--------------|
| Real-time AQI | https://www.aqi.in/in/dashboard/united-states | `<span[^>]*>(?<aqi>\\d+)\\s*<span` | `{ aqi: '31' }` | United States Air Quality Index |
| Coinmarketcap | https://coinmarketcap.com/ | `<div class="circulating-supply-value">\\s*<span>(?<cap>[0-9]+(?:\\.[0-9]+)?[A-Za-z]?)</span>\\s*<!-- -->BTC` | `{ cap: '19.96M' }` | Bitcoin's Circulating Supply |
| Yahoo Finance | https://finance.yahoo.com/markets/stocks/most-active/ | `<fin-streamer data-test="change" data-symbol="NVDA" data-field="marketCap" data-trend="none" data-value="4261212044021.6064" active="">(?<marketCap>[0-9]+(?:\\.[0-9]+)?[A-Za-z]?)</fin-streamer>` | `{ marketCap: '4.261T' }` | Most Active Stock's Market Cap |
| Github |  'https://github.com/torvalds/linux' | `<span[^>]*class="[^"]*js-social-count[^"]*"[^>]*>\s*(?<stars>[0-9]+(?:\.[0-9]+)?[kKmM]?)\s*</span>` | `{ stars: '211k' }` | Repository Stars |
| Internet Live Stats | https://www.internetlivestats.com/total-number-of-websites/ | `<td class="val">(?<websites>[0-9,]+)</td>` | `{ websites: '1,630,322,579' }` | Total Number of Registered Websites |
| Flightware | https://www.flightaware.com/resources/airport/KJFK/weather | `<td class="alignleft weatherTemperature" style="width: 79px" >(?<temparature>.*?)</td>` | `{ temparature: '21' }` | Airports Weather |
| Social Counts | https://socialcounts.org/youtube-live-subscriber-count/UCX6OQ3DkcsbYNE6H8uQQuVA | `<<div class=\"tracking-tight text-gray-900 dark:text-white text-xl\">(?<count>.*?)</div>` | `{ count: '103,488,793,716' }` | Youtubers Subscription Counts |
| Planet OSM | https://planet.openstreetmap.org/statistics/data_stats.html | `<tr>\s*<td>[^<]+</td>\s*<td>(?<users>[0-9]+)</td>` | `{ users: '10045083' }` | OpenStreetMap User Count |
| Rotten Tomatoes | https://www.rottentomatoes.com/browse/tv_series_browse/sort:popular | `<span class="p--small" data-qa="discovery-media-list-item-title">\s*(?<show>[^\s].*?[^\s])\s*</span>` | `{ show: 'Pluribus' }` | Rotten Tomatoes Top Show |
| Solana | https://status.solana.com/ | `<h2[^>]*class="status[^"]*"[^>]*>\s*(?<status>[^<]+?)\s*</h2>` | `{ status: 'All Systems Operational' }` | Solana Systems Operational Status |
| Speedtest | https://www.speedtest.net/global-index | `<span class="number">(?<mobileSpeed>[0-9.]+)</span>` | `{ mobileSpeed: '179.55' }` | SpeedTest Mobile Speed Metrics |
| ARXIV | https://arxiv.org/abs/2305.17989| `<meta[^>]*property="og:title"[^>]*content="(?<title>[^"]+)"` | `{title: 'On the Minimal Knowledge Required for Solving Stellar Consensus'` | Research Papers Titles |
| NPM Registry | https://www.npmjs.com/package/@stellar/stellar-sdk | `<p class="f2874b88 fw6 mb3 mt2 truncate black-80 f4">(?<version>[0-9.]+)</p>` | `{ version: '14.4.2' }` | Stellar JS SDK Version |
| Unix Timestamp | https://www.unixtimestamp.com/| `<div[^>]*class="value epoch"[^>]*>\\s*(?<timestamp>[0-9]+)\\s*</div>` | `{ timestamp: '1765773231' }` | Unix Timestamps - Seconds |
| Wikipedia | https://en.wikipedia.org/wiki/Special:Statistics | `<td[^>]*class="mw-statistics-numbers"[^>]*>\s*(?<count>[0-9,]+)\s*</td>` | `{ count: '7,105,949' }` | Content Pages Count |
| Worldometers | https://www.worldometers.info/geography/countries-of-the-world/ | `<td[^>]*data-order="\\d+"[^>]*>\\s*(?<population>[0-9,]+)\\s*</td>` | `{ population: '1,463,865,525' }` | Top Country Population |
| Random Number API | https://www.randomnumberapi.com/api/v1.0/random?min=1&max=100&count=1 | `\\[(?<data>\\d+)\\]` | `{ data: '34' }` | RNG Results |
| Github API | https://api.github.com/rate_limit | `\"rate\"\\s*:\\s*\\{[\\s\\S]*?\"limit\"\\s*:\\s*(?<limit>\\d+),[\\s\\S]*?\"remaining\"\\s*:\\s*(?<remaining>\\d+),[\\s\\S]*?\"reset\"\\s*:\\s*(?<reset>\\d+),[\\s\\S]*?\"used\"\\s*:\\s*(?<used>\\d+),[\\s\\S]*?\"resource\"\\s*:\\s*\"(?<resource>[^\"]+)\"` | `{limit: '60', remaining: '60',reset: '1765806768',resource: 'core',used: '0'}` | Github API Rate Limit Control - Requests per Hour |
| USGS Earthquake | https://earthquake.usgs.gov/fdsnws/event/1/count?format=geojson | `\"count\"\\s*:\\s*(?<count>\\d+)` | `{ count: '9077' }` | Number of Earthquake Events |
| OpenDota | https://api.opendota.com/api/proPlayers | `\"steamid\"\\s*:\\s*\"(?<steamId>\\d+)\"[\\s\\S]*?\"personaname\"\\s*:\\s*\"(?<name>[^\"]+)\"[\\s\\S]*?\"loccountrycode\"\\s*:\\s*\"(?<country>[A-Z]{2})\"` | `{ country: 'US', name: 'Newsham', steamId: '76561197961562353' }` | Dota Top Player Information |
| Postman Echo | https://postman-echo.com/get | `\"user-agent\"\\s*:\\s*\"(?<userAgent>[^\"]+)\"` | `{ userAgent: 'reclaim/0.0.1' }` | Request Sender User Agent |
| Crossref | https://api.crossref.org/works/10.1038/nature12373 | `\"reference-count\"\\s*:\\s*(?<referenceCount>\\d+)` | `{ referenceCount: '30' }` | Research Papers Crossed Reference Counts |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.

## Links

- [Reclaim Protocol Documentation](https://docs.reclaimprotocol.org/)
- [Cardano Documentation](https://docs.cardano.org/)
- [Blockfrost API](https://blockfrost.io/)
- [Lucid Documentation](https://deno.land/x/lucid@0.10.11/mod.ts) 