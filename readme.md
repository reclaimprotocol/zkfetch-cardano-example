# Reclaim-Cardano zkFetch example

This example illustrates how to store Reclaim proofs' identifiers and responses
on Cardano.

In this example, we store latest ADA price, fetched from a remote source.

## Pre-requisities

- Node.js
- Deno (install: https://docs.deno.com/runtime/getting_started/installation/)

Credentials for Blockfrost and Reclaim are filled for you, feel free to create
your own.

## Install

```
npm i
```

## Use

1 - Create a wallet, this will write address details to `addressDetails.json`:

```
deno run -A --unstable createWallet.ts
```

2 - Fund with tADA on Preprod:

https://docs.cardano.org/cardano-testnets/tools/faucet

3 - Request a proof containing the latest ADA price, this will write a proof to
`proof.json`:

```
node requestProof.js
```

4 - Send a tx with the proof's identifier and ADA price included in the
metadata:

```
deno run -A --unstable --node-modules-dir=manual sendTransaction.ts
```

## Metadata example

https://preprod.cexplorer.io/tx/c36ba27f9124ec345b3a54bde3212aef834f91e203d2c8bf32a2f1f474ac5b4f/metadata#data

## Further exploration

Here is another data source that you can try:

```js
const proof = await reclaimClient.zkFetch(
  "https://www.goal.com/en-in/live-scores",
  {
    method: "GET",
  },
  {
    responseMatches: [
      {
        type: "regex",
        value:
          '<div class="fco-match-team-and-score">.*?<div class="fco-team-name fco-long-name">(?<team1>.*?)</div>.*?<div class="fco-team-name fco-long-name">(?<team2>.*?)</div>.*?<div class="fco-match-score" data-side="team-a">(?<score1>\\d+)</div>\\s*<div class="fco-match-score" data-side="team-b">(?<score2>\\d+)</div>',
      },
    ],
    responseRedactions: [
      {
        regex:
          '<div class="fco-match-team-and-score">.*?<div class="fco-team-name fco-long-name">(?<team1>.*?)</div>.*?<div class="fco-team-name fco-long-name">(?<team2>.*?)</div>.*?<div class="fco-match-score" data-side="team-a">(?<score1>\\d+)</div>\\s*<div class="fco-match-score" data-side="team-b">(?<score2>\\d+)</div>',
      },
    ],
  },
);
```
