# BookEase

A decentralized booking and escrow system on Ethereum. Two people make a deal: customer locks ETH in a smart contract, provider does the work, customer confirms and releases the funds. If the provider doesn't accept, the customer can cancel and get their money back.

Built with Solidity (contract), React (frontend), and Hardhat (tests + deployment).

## How it works

- **Customer creates booking** with some ETH → money sits in the contract
- **Provider accepts** → they're taking the job
- **Provider marks complete** → work is done
- **Customer confirms** → ETH is transferred to the provider
- **Or customer cancels** (only before acceptance) → refund back to customer

Everything is secured by the contract — no trusted middleman needed.

## Stack

| Part | Tech | Why |
|------|------|-----|
| Smart contract | Solidity 0.8.20 + OpenZeppelin | Standard library, reentrancy protection |
| Frontend | React 19 + Vite | Fast, modern, good DX |
| Blockchain client | ethers.js v6 | Better async/await than older versions |
| Testing | Hardhat + Vitest | Can test both contract and components |
| Styling | Custom CSS | No dependencies, semantic design |

## Setup

### Before you start
- Node.js 18+
- MetaMask installed
- Sepolia ETH from a [faucet](https://www.alchemy.com/faucets/ethereum-sepolia)

### Install & run locally

```bash
npm install
cd frontend && npm install
```

Start the blockchain (Terminal 1):
```bash
npm run hardhat node
```

Deploy the contract (Terminal 2):
```bash
npm run deploy
```

Start the React app (Terminal 3):
```bash
cd frontend && npm run dev
```

Then go to http://localhost:5173

## Testing

Smart contract tests:
```bash
npm test
```

Frontend component tests:
```bash
cd frontend && npm test
npm run test:ui  # with UI
```

## The flow

1. Customer sends ETH → contract locks it
2. Provider sees booking, accepts it
3. Provider does work, marks it complete
4. Customer checks it's done, releases payment
5. Provider gets ETH

Or if something goes wrong before step 2, customer just cancels and gets refunded.

## Contract details

Located in `contracts/BookingEscrow.sol`. Has 5 main functions:
- `createBooking()` — customer locks ETH
- `acceptBooking(id)` — provider takes the job
- `providerComplete(id)` — provider says work is done
- `confirmCompletion(id)` — customer releases funds
- `cancelBooking(id)` — customer gets refund (only before acceptance)

Uses `ReentrancyGuard` from OpenZeppelin to prevent reentrancy attacks. Only the customer can cancel/confirm, only the provider can mark complete — no one else can touch the funds.

## Environment variables

Create a `.env` file in the root (copy from `.env.example`):

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
SEPOLIA_PRIVATE_KEY=your_test_wallet_private_key
```

Never commit `.env` — it has your private key.

## Frontend

8 components for different actions:
- `CreateBooking` — customer creates a booking
- `AcceptBooking` — provider accepts
- `ProviderComplete` — provider marks work done
- `ConfirmCompletion` — customer releases payment
- `CancelBooking` — customer cancels (if not accepted yet)
- `ViewBooking` — search and view a single booking
- `BookingsList` — see all bookings in a grid
- `Wallet` — connect MetaMask

All styled with a single CSS file that uses semantic color variables and component classes. Responsive on mobile and desktop.

## Project structure

```
bookease-blockchain/
├── contracts/
│   └── BookingEscrow.sol           # Main contract
├── test/
│   ├── BookingEscrow.test.js       # Functional tests
│   └── BookingEscrow.security.test.js
├── frontend/
│   ├── src/
│   │   ├── components/Booking/     # 8 booking components
│   │   ├── components/Wallet/      # Wallet UI
│   │   ├── services/               # Contract & wallet services
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── App.jsx                 # Main app
│   │   └── App.css                 # All styles
│   └── package.json
├── scripts/
│   └── deploy.js                   # Deployment script
├── hardhat.config.js
└── README.md
```

## Deploy to Sepolia

Make sure you have `.env` with your keys, then:

```bash
npm run hardhat run scripts/deploy.js --network sepolia
```

You'll get the contract address back. Copy it and update the contract config if needed.

## Tests

Hardhat tests cover:
- Creating a booking with ETH
- Provider accepting
- Marking complete and customer confirming
- Refunds on cancellation
- Security stuff (reentrancy, access control)

Component tests with Vitest cover:
- Form validation (amount must be > 0, booking ID must exist)
- Loading states while transactions happen
- Error messages when things fail
- Success messages when they work
- Input fields clearing after successful actions

## Security

- Uses `ReentrancyGuard` so no one can re-enter the payment function
- Only customer can cancel/confirm, only provider can mark complete
- All inputs are validated
- Money doesn't move until the customer explicitly confirms

## What I learned building this

- How to structure a React app without a state management library (just hooks)
- How ethers.js v6 handles contract interaction and event listening
- Writing Solidity that's actually safe (ReentrancyGuard matters)
- Testing both contracts (Hardhat) and components (Vitest) in one project
- Building a semantic CSS framework instead of using Tailwind

## License

MIT
