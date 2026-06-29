# Product Idea

## Problem

Booking platforms have trust issues:
- How do you know the provider will actually do the work?
- How do you know the customer won't claim the work was bad to get a refund?
- What if the platform goes down or shuts down?

## Solution

Use a smart contract as the middleman:
- Customer sends ETH to the contract (not to the provider)
- Provider does the work
- Customer confirms it's done
- Contract automatically sends ETH to provider
- If provider doesn't accept, customer gets refunded

No platform can steal the money. No disputes. Just code.

## What it does

1. Customer creates a booking with amount
2. Provider accepts it
3. Provider marks work complete
4. Customer confirms and releases payment
5. Or customer cancels (before acceptance) and gets refunded

## What's on-chain

- Booking records (id, customer, provider, amount, status)
- ETH transfers

## What's not needed yet

- Reputation system
- Reviews
- User profiles
- Images

Those could be added later. For now, just the escrow.
