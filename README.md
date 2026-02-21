#  Stellar Token Wallet

A mini-dApp built on the Stellar testnet that lets you connect your Freighter wallet, check your XLM balance, send payments, and view transaction history.

##  Features
- Freighter wallet connect/disconnect
-  Real-time XLM balance with auto-refresh every 30s
-  Send XLM payments with memo support
- Transaction history (last 10)
- Loading states and progress indicators
- Smart caching (balance: 30s TTL, transactions: 60s TTL)
-  Unit tests with Jest

##  Tech Stack
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Stellar SDK (@stellar/stellar-sdk)
- Freighter API (@stellar/freighter-api)
- Jest + Testing Library

## Prerequisites
- Node.js 18+
- [Freighter Wallet](https://freighter.app) browser extension
- A Stellar testnet account (use Friendbot to fund)

##  Getting Started

```bash
git clone <your-repo>
cd stellar-wallet
npm install
npm run dev
```

Open http://localhost:3000

## 🧪 Running Tests

```bash
npm test
```

## 💡 How to Use
1. Install Freighter browser extension
2. Switch Freighter to Testnet network
3. Click "Connect Freighter Wallet"
4. Click "Fund with Friendbot" to get free testnet XLM
5. Enter a destination address and amount to send

## 📁 Project Structure
```
src/
  app/          → Next.js pages
  components/   → UI components
  hooks/        → useWallet hook
  lib/          → stellar.ts + cache.ts
  types/        → TypeScript interfaces
  __tests__/    → Jest test files
```

## 🎥 Demo
[Demo video link here]

## 📄 License
MIT
