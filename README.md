# BookEase — Decentralized Booking & Escrow DApp

A full-stack Ethereum-based booking and escrow system built with Solidity, React, and Hardhat. Enables peer-to-peer service bookings with trustless payment handling.

![BookEase](https://img.shields.io/badge/Ethereum-Blockchain-purple) ![React](https://img.shields.io/badge/React-19-blue) ![Solidity](https://img.shields.io/badge/Solidity-0.8.20-red) ![Tests](https://img.shields.io/badge/Tests-Vitest-yellow)

## 🎯 Features

- **Trustless Escrow**: ETH locked in smart contract until customer confirms completion
- **Lifecycle States**: Created → Accepted → Provider Completed → Confirmed → Completed
- **Secure Refunds**: Customers can cancel before acceptance to recover funds
- **Event-Driven UX**: Real-time blockchain event listeners trigger UI updates
- **Professional UI**: Responsive design with loading states, error handling, status badges
- **Fully Tested**: Component and contract tests included

## 🏗️ Architecture

### Smart Contract (`contracts/BookingEscrow.sol`)
- Pure Solidity contract with OpenZeppelin's ReentrancyGuard
- 5 core functions: `createBooking`, `acceptBooking`, `providerComplete`, `confirmCompletion`, `cancelBooking`
- Event emissions for all state changes
- Comprehensive security tests

### Frontend (`frontend/src/`)
- **React 19** with Hooks for state management
- **ethers.js v6** for blockchain interaction
- **Vite** for fast development and production builds
- **Component Library**: 8 specialized components
- **CSS Framework**: 400+ lines of semantic styling

### Services Layer
- `contractService.js`: Abstract contract interaction
- `walletService.js`: MetaMask connection and signing
- `useWallet.js`: Custom React hook for wallet state

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MetaMask browser extension
- Sepolia testnet ETH (get from [faucet](https://www.alchemy.com/faucets/ethereum-sepolia))

### Installation

\`\`\`bash
# Install root dependencies (Hardhat)
npm install

# Install frontend dependencies
cd frontend
npm install
\`\`\`

### Development

\`\`\`bash
# Terminal 1: Start Hardhat local network
npm run hardhat node

# Terminal 2: Deploy contract locally
npm run deploy

# Terminal 3: Start React dev server
cd frontend
npm run dev
\`\`\`

Visit \`http://localhost:5173\`

### Testing

\`\`\`bash
# Smart contract tests
npm test

# Frontend component tests
cd frontend
npm test

# Run tests with UI
npm run test:ui
\`\`\`

### Production Build

\`\`\`bash
cd frontend
npm run build
\`\`\`

## 📋 Contract Interaction Flow

1. **Customer creates booking** with ETH amount → funds locked in contract
2. **Provider accepts booking** → booking status changes to "Accepted"
3. **Provider marks complete** → status changes to "ProviderCompleted"
4. **Customer confirms** → ETH transferred to provider, status = "Completed"

**Alternative**: Customer can cancel before step 2 to receive refund.

## 🔧 Environment Variables

Create \`.env\` in root (see \`.env.example\`):

\`\`\`env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
SEPOLIA_PRIVATE_KEY=your_private_key_here
\`\`\`

**Never commit \`.env\`** — use \`.env.example\` as template.

## 📊 Contract State

Each booking is stored as:

\`\`\`javascript
Booking {
  id: uint256,
  customer: address,
  provider: address,
  amount: uint256 (in wei),
  status: enum (Created, Accepted, ProviderCompleted, Completed, Cancelled)
}
\`\`\`

All bookings are queryable via \`getBooking(id)\` or iterate via \`bookingCount\`.

## 🛡️ Security

- **ReentrancyGuard**: Protects payment transfer from reentrancy attacks
- **Access Control**: Only customer can cancel/confirm, only provider can mark complete
- **Validation**: All inputs validated before state changes
- **Escrow Pattern**: Funds never directly transferred until customer explicitly confirms

**Audit Status**: Security test suite included in \`test/BookingEscrow.security.test.js\`

## 📝 Project Structure

\`\`\`
bookease-blockchain/
├── contracts/
│   └── BookingEscrow.sol          # Main contract
├── test/
│   ├── BookingEscrow.test.js      # Functional tests
│   └── BookingEscrow.security.test.js
├── frontend/
│   ├── src/
│   │   ├── components/Booking/    # 8 booking action components
│   │   ├── components/Wallet/     # Wallet connection UI
│   │   ├── services/              # Contract & wallet services
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── App.jsx                # Main app layout
│   │   └── App.css                # Semantic component styling
│   ├── vitest.config.js           # Test configuration
│   └── package.json
├── scripts/
│   └── deploy.js                  # Hardhat deployment script
├── hardhat.config.js
└── README.md (this file)
\`\`\`

## 🧪 Testing

### Unit Tests (Hardhat)

\`\`\`bash
npm test
\`\`\`

Covers:
- Booking creation with ETH locking
- Provider acceptance
- Work completion & customer confirmation
- Refund on cancellation
- Security: reentrancy, access control, invalid state transitions

### Component Tests (Vitest)

\`\`\`bash
cd frontend
npm test
\`\`\`

Covers:
- Form validation (positive amounts, valid IDs)
- Button loading states during transactions
- Error display on contract failures
- Success feedback after transactions
- Input clearing after successful operations

## 🔗 Contract Addresses

| Network | Address |
|---------|---------|
| Hardhat (Local) | \`0x5FbDB2315678afecb367f032d93F642f64180aa3\` |
| Sepolia | TBD |

## 📚 Key Technologies

| Layer | Technology | Why |
|-------|-----------|-----|
| Blockchain | Solidity 0.8.20 + OpenZeppelin | Industry standard, audited libraries |
| Ethereum Client | ethers.js v6 | Modern async/await API, smaller bundle |
| Frontend | React 19 | Latest hooks, streaming SSR ready |
| Build | Vite | Lightning-fast HMR, optimized bundles |
| Testing | Hardhat + Vitest | Comprehensive contract + component coverage |
| Styling | Custom CSS | Semantic, zero dependencies |

## 🎨 UI/UX Highlights

- **Responsive Grid Layout**: 2-column on desktop, 1-column on mobile
- **Loading Spinners**: Clear feedback during async transactions
- **Status Badges**: Visual booking state with color coding
- **Real-time Events**: Live updates from blockchain events
- **Inline Validation**: Form errors shown without page reload
- **Accessibility**: Semantic HTML, proper labels, ARIA attributes

## 📖 Learn More

- [Solidity Docs](https://docs.soliditylang.org/)
- [ethers.js](https://docs.ethers.org/)
- [Hardhat](https://hardhat.org/)
- [React 19](https://react.dev/)

## 📄 License

MIT License

## 📧 Contact

Built by [Ali Abdullah](https://github.com/alab2296)

---

**Status**: ✅ Production-ready | 🧪 Fully tested | 📱 Responsive | 🔒 Secure

Last updated: June 2026
