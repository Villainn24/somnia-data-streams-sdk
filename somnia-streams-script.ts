{
"name": "somnia-streams",
"version": "1.0.0",
"description": "Integrasi SDK Somnia Streams — contoh emit, subscribe, dan grant reward",
"main": "dist/index.js",
"scripts": {
"build": "tsc",
"start": "node dist/index.js",
"dev": "ts-node-dev --respawn --transpile-only src/somnia-script.ts",
"prepare": ""
},
"dependencies": {
"@somnia-chain/streams": "^1.0.0",
"viem": "^1.0.0"
},
"devDependencies": {
"ts-node-dev": "^2.0.0",
"typescript": "^5.0.0",
"@types/node": "^20.0.0"
}
}
{
"compilerOptions": {
"target": "ES2022",
"module": "CommonJS",
"outDir": "dist",
"rootDir": "src",
"strict": true,
"esModuleInterop": true,
"skipLibCheck": true,
"forceConsistentCasingInFileNames": true
},
"include": ["src"]
}
node_modules/
dist/
.env
.vscode/
.DS_Store
/* eslint-disable @typescript-eslint/no-explicit-any */


const onAchievement = async (event: any) => {
try {
const evt = event || {};
const profile = evt.profile ?? evt.PlayerProfile ?? null;
const inventory = evt.inventory ?? evt.Inventory ?? null;
const elo = evt.elo ?? evt.ELORating ?? undefined;
const ctx = { profile, inventory, elo, evt };


if (!qualifies(ctx)) {
console.log('Tidak memenuhi syarat reward, skip.', { playerId });
return;
}


const reward = pickReward(elo);
const txHash = await sdk.streams.sessionWrite('grantReward', { playerId, reward });
console.log('Grant reward txHash:', txHash);


showBanner(reward);
await sendToGameServer({ playerId, event: 'rewardGranted', reward, txHash, ts: Date.now() });
} catch (err) {
console.error('Error saat memproses AchievementUnlocked:', err);
}
};


let subscription: any = null;
try {
subscription = await sdk.streams.subscribe('AchievementUnlocked', viewCallsOnEvent, onAchievement);
console.log('Subscribed to AchievementUnlocked. subscription:', !!subscription);
} catch (err) {
console.error('Gagal subscribe:', err);
}


try {
const subReward = await sdk.streams.subscribe('RewardGranted', [], (event: any) => {
if (event.playerId === playerId) {
showBanner(event.reward);
}
});
console.log('Subscribed to RewardGranted:', !!subReward);
} catch (err) {
console.warn('Gagal subscribe RewardGranted:', err);
}


return { sdk, subscription };
}


// jika dijalankan langsung via ts-node-dev
if (require.main === module) {
main()
.then(() => console.log('Main script selesai inisialisasi.'))
.catch((err) => console.error('Error di main():', err));
}
# Somnia Streams — contoh integrasi


`@somnia-chain/streams`.


1. Clone repo / copy file ke folder lokal
2. `npm install`
3. Set `PLAYER_ID` di environment jika perlu


## Menjalankan


- Development (realtime, automatic restart):
