import { ReclaimClient } from "@reclaimprotocol/zk-fetch";
import fs from "fs";
import process from "node:process";

export async function main(path = "proof.json", dataSource = "ada") {
  try {
    const APP_ID = "0x381994d6B9B08C3e7CfE3A4Cd544C85101b8f201";
    const APP_SECRET =
      "0xfdc676e00ac9c648dfbcc271263c2dd95233a8abd391458c91ea88526a299223";

    const reclaimClient = new ReclaimClient(
      APP_ID,
      APP_SECRET,
    );

    let proof;

    if (dataSource === "sports") {
      // Sports scores from Goal.com
      const url = "https://www.goal.com/en-in/live-scores";
      
      console.log("Requesting sports scores proof from Goal.com...");
      
      proof = await reclaimClient.zkFetch(
        url,
        { method: "GET" },
        {
          responseMatches: [
            {
              type: "regex",
              value: '<div class="fco-match-team-and-score">.*?<div class="fco-team-name fco-long-name">(?<team1>.*?)</div>.*?<div class="fco-team-name fco-long-name">(?<team2>.*?)</div>.*?<div class="fco-match-score" data-side="team-a">(?<score1>\\d+)</div>\\s*<div class="fco-match-score" data-side="team-b">(?<score2>\\d+)</div>',
            },
          ],
          responseRedactions: [
            {
              regex: '<div class="fco-match-team-and-score">.*?<div class="fco-team-name fco-long-name">(?<team1>.*?)</div>.*?<div class="fco-team-name fco-long-name">(?<team2>.*?)</div>.*?<div class="fco-match-score" data-side="team-a">(?<score1>\\d+)</div>\\s*<div class="fco-match-score" data-side="team-b">(?<score2>\\d+)</div>',
            },
          ],
        },
      );
    } else if (dataSource === "gdp") {
      // GDP data from Trading Economics
      const url = "https://tradingeconomics.com/";
      
      console.log("Requesting GDP data proof from Trading Economics...");
      
      proof = await reclaimClient.zkFetch(
        url,
        {
          method: "GET",
          headers: {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9",
            "priority": "u=0, i",
            "sec-ch-ua": "\"Google Chrome\";v=\"141\", \"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"141\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1"
          },
          context: {
            contextAddress: "0x0",
            contextMessage: "countries gdp"
          }
        },
        {
          responseMatches: [
            {
              type: "regex",
              value: "(?:<a class=\\\"matrix-country\\\"[^>]*>(?<country1>[^<]+)<\\/a><\\/td>\\s*<td data-heatmap-value='\\d+'><a[^>]*>(?<gdp1>\\d+)<\\/a>)(?:.*?<a class=\\\"matrix-country\\\"[^>]*>(?<country2>[^<]+)<\\/a><\\/td>\\s*<td data-heatmap-value='\\d+'><a[^>]*>(?<gdp2>\\d+)<\\/a>){0,1}(?:.*?<a class=\\\"matrix-country\\\"[^>]*>(?<country3>[^<]+)<\\/a><\\/td>\\s*<td data-heatmap-value='\\d+'><a[^>]*>(?<gdp3>\\d+)<\\/a>){0,1}(?:.*?<a class=\\\"matrix-country\\\"[^>]*>(?<country4>[^<]+)<\\/a><\\/td>\\s*<td data-heatmap-value='\\d+'><a[^>]*>(?<gdp4>\\d+)<\\/a>){0,1}(?:.*?<a class=\\\"matrix-country\\\"[^>]*>(?<country5>[^<]+)<\\/a><\\/td>\\s*<td data-heatmap-value='\\d+'><a[^>]*>(?<gdp5>\\d+)<\\/a>){0,1}"
            }
          ],
          responseRedactions: []
        }
      );
    } else if (dataSource === "forbes") {
      // Forbes billionaires data
      const url = "https://www.forbes.com/forbesapi/person/rtb/0/-estWorthPrev/true.json?fields=rank,personName,finalWorth";
      
      console.log("Requesting Forbes billionaires data proof...");
      
      proof = await reclaimClient.zkFetch(
        url,
        {
          method: "GET",
          headers: {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Google Chrome\";v=\"141\", \"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"141\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin"
          },
          context: {
            contextAddress: "0x0",
            contextMessage: "forbes real time billionaires"
          }
        },
        {
          responseMatches: [
            {
              type: "regex",
              value: "(?:\\\"personName\\\":\\s*\\\"(?<name1>[^\\\"]+)\\\".*?\\\"rank\\\":\\s*(?<rank1>\\d+).*?\\\"finalWorth\\\":\\s*(?<worth1>[\\d.]+))(?:(?:.*?\\\"personName\\\":\\s*\\\"(?<name2>[^\\\"]+)\\\".*?\\\"rank\\\":\\s*(?<rank2>\\d+).*?\\\"finalWorth\\\":\\s*(?<worth2>[\\d.]+))){0,1}(?:(?:.*?\\\"personName\\\":\\s*\\\"(?<name3>[^\\\"]+)\\\".*?\\\"rank\\\":\\s*(?<rank3>\\d+).*?\\\"finalWorth\\\":\\s*(?<worth3>[\\d.]+))){0,1}(?:(?:.*?\\\"personName\\\":\\s*\\\"(?<name4>[^\\\"]+)\\\".*?\\\"rank\\\":\\s*(?<rank4>\\d+).*?\\\"finalWorth\\\":\\s*(?<worth4>[\\d.]+))){0,1}(?:(?:.*?\\\"personName\\\":\\s*\\\"(?<name5>[^\\\"]+)\\\".*?\\\"rank\\\":\\s*(?<rank5>\\d+).*?\\\"finalWorth\\\":\\s*(?<worth5>[\\d.]+))){0,1}"
            }
          ],
          responseRedactions: []
        }
      );
    } else if (dataSource === "weather") {
      // AccuWeather data
      const url = "https://www.accuweather.com/en/us/new-york/10021/weather-forecast/349727";
      
      console.log("Requesting AccuWeather data proof...");
      
      proof = await reclaimClient.zkFetch(
        url,
        {
          method: "GET",
          headers: {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9",
            "priority": "u=0, i",
            "sec-ch-ua": "\"Google Chrome\";v=\"141\", \"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"141\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1"
          },
          context: {
            contextAddress: "0x0",
            contextMessage: "accuweather nyc"
          }
        },
        {
          responseMatches: [
            {
              type: "regex",
              value: "\\\"englishName\\\":(?<city>.*?),"
            },
            {
              type: "regex",
              value: "<div class=\\\"temp\\\">(?<tempInC>.*?)&#xB0;"
            }
          ],
          responseRedactions: []
        }
      );
    } else {
      // ADA price from CoinGecko (default)
      const url =
        "https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd";

      console.log("Requesting ADA price proof from CoinGecko...");
      
      proof = await reclaimClient.zkFetch(
        url,
        { method: "GET" },
        {
          responseMatches: [
            {
              type: "regex",
              value: '\\{"cardano":\\{"usd":(?<price>[\\d\\.]+)\\}\\}',
            },
          ],
        },
      );
    }

    fs.writeFileSync(path, JSON.stringify(proof, null, 2));
    console.log(`Proof saved to: ${path}`);
    process.exit(0);
  } catch (e) {
    console.error("Error requesting proof:", e.message);
    process.exit(1);
  }
}

// Only run main() if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const path = args[0] || "proof.json";
  const dataSource = args[1] || "ada";
  
  if (args.includes("--help") || args.includes("-h")) {
    console.log("Usage: node requestProof.js [output-file] [data-source]");
    console.log("");
    console.log("Arguments:");
    console.log("  output-file    Path to save the proof JSON file (default: proof.json)");
    console.log("  data-source    Data source to fetch from (default: ada)");
    console.log("");
    console.log("Data sources:");
    console.log("  ada            Fetch ADA price from CoinGecko");
    console.log("  sports         Fetch live sports scores from Goal.com");
    console.log("  gdp            Fetch GDP data from Trading Economics");
    console.log("  forbes         Fetch Forbes billionaires data");
    console.log("  weather        Fetch weather data from AccuWeather");
    console.log("");
    console.log("Examples:");
    console.log("  node requestProof.js                    # ADA price to proof.json");
    console.log("  node requestProof.js sports-proof.json sports  # Sports scores to sports-proof.json");
    console.log("  node requestProof.js gdp-data.json gdp         # GDP data to gdp-data.json");
    console.log("  node requestProof.js forbes-data.json forbes   # Forbes data to forbes-data.json");
    console.log("  node requestProof.js weather-data.json weather # Weather data to weather-data.json");
    console.log("  node requestProof.js ada-price.json ada        # ADA price to ada-price.json");
    process.exit(0);
  }
  
  main(path, dataSource);
}
