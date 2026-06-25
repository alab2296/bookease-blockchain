# System Architecture

## Overview

BookEase Blockchain is a hybrid dApp:

## Frontend

- React.js
- Ethers.js
- MetaMask wallet connection

## Smart Contracts

- BookingContract
- EscrowContract
- ReputationContract

## Blockchain Network

- Ethereum (Sepolia testnet for development)

## Data Flow

1. User creates booking (frontend)
2. Smart contract locks payment (escrow)
3. Provider confirms booking
4. Contract releases payment OR refunds

## On-chain Data

- Booking ID
- Payment status
- Trust score updates

## Off-chain Data

- User profiles
- Listings
- Images
