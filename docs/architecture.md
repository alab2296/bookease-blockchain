# How it's built

## Smart Contract Layer

`BookingEscrow.sol` — One contract that does everything:
- Stores bookings (id, customer, provider, amount, status)
- Handles state transitions (created → accepted → complete → completed)
- Transfers ETH when confirmed
- Refunds when cancelled

Uses `ReentrancyGuard` from OpenZeppelin so no one can exploit the payment function.

Deployed on Sepolia testnet (or local Hardhat for testing).

## Frontend Layer

React app that talks to the contract:

**Components:**
- Wallet connection (MetaMask)
- CreateBooking form
- AcceptBooking form
- ProviderComplete button
- ConfirmCompletion button
- CancelBooking button
- ViewBooking search
- BookingsList grid

**How it works:**
- User connects wallet
- User fills out a form (amount, booking ID, etc)
- Click button → calls contract function → ethers.js handles the signing
- Listen to contract events (BookingCreated, BookingAccepted, etc)
- Update UI when events fire

**Styling:**
- One CSS file with semantic classes
- Responsive grid layout
- No CSS framework, just vanilla CSS

## Data flow

```
User → React form
  ↓
ethers.js → contract function
  ↓
Smart contract updates state + emits event
  ↓
Event listener fires
  ↓
React state updates
  ↓
UI re-renders
```

## Testing

**Contract tests (Hardhat):**
- Deploy contract
- Call functions
- Check state changed correctly
- Make sure security stuff works

**Component tests (Vitest):**
- Mock the contract service
- Test form validation
- Test error handling
- Test loading states

## File structure

```
contracts/          → Solidity contract
test/              → Hardhat tests
frontend/src/      → React app
  ├── components/  → UI components
  ├── services/    → Contract interaction
  ├── hooks/       → Custom React hooks
  └── App.css      → All styles
scripts/           → Deployment script
```
