// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title Booking Escrow System
/// @notice Escrow-based booking system (Airbnb-style flow)
/// @dev ETH is locked in contract until completion confirmation

contract BookingEscrow is ReentrancyGuard {

    // -----------------------------
    // STATE
    // -----------------------------

    enum Status {
        Created,
        Accepted,
        ProviderCompleted,
        Completed,
        Cancelled
    }

    struct Booking {
        uint256 id;
        address payable customer;
        address payable provider;
        uint256 amount;
        Status status;
    }

    uint256 public bookingCount;

    mapping(uint256 => Booking) public bookings;

    // -----------------------------
    // EVENTS
    // -----------------------------

    event BookingCreated(
        uint256 indexed id,
        address indexed customer,
        uint256 amount
    );

    event BookingAccepted(
        uint256 indexed id,
        address indexed provider
    );

    event ProviderMarkedComplete(
        uint256 indexed id
    );

    event BookingCompleted(
        uint256 indexed id,
        address provider,
        uint256 amount
    );

    event BookingCancelled(
        uint256 indexed id,
        address customer,
        uint256 amount
    );

    // -----------------------------
    // CREATE BOOKING
    // -----------------------------

    /// @notice Customer creates booking and locks ETH
    function createBooking() external payable {
        require(msg.value > 0, "Amount must be > 0");

        bookingCount++;

        bookings[bookingCount] = Booking({
            id: bookingCount,
            customer: payable(msg.sender),
            provider: payable(address(0)),
            amount: msg.value,
            status: Status.Created
        });

        emit BookingCreated(bookingCount, msg.sender, msg.value);
    }

    // -----------------------------
    // ACCEPT BOOKING
    // -----------------------------

    function acceptBooking(uint256 _id) external {
        Booking storage b = bookings[_id];

        require(b.id != 0, "Invalid booking");
        require(b.status == Status.Created, "Already accepted or closed");
        require(b.provider == address(0), "Provider already assigned");

        b.provider = payable(msg.sender);
        b.status = Status.Accepted;

        emit BookingAccepted(_id, msg.sender);
    }

    // -----------------------------
    // PROVIDER COMPLETES WORK
    // -----------------------------

    function providerComplete(uint256 _id) external {
        Booking storage b = bookings[_id];

        require(b.id != 0, "Invalid booking");
        require(msg.sender == b.provider, "Only provider");
        require(b.status == Status.Accepted, "Not active booking");

        b.status = Status.ProviderCompleted;

        emit ProviderMarkedComplete(_id);
    }

    // -----------------------------
    // CUSTOMER CONFIRMS & RELEASES FUNDS
    // -----------------------------

    function confirmCompletion(uint256 _id) external nonReentrant {
        Booking storage b = bookings[_id];

        require(b.id != 0, "Invalid booking");
        require(msg.sender == b.customer, "Only customer");
        require(b.status == Status.ProviderCompleted, "Not ready");

        b.status = Status.Completed;

        uint256 amount = b.amount;
        address payable provider = b.provider;

        (bool success, ) = provider.call{value: amount}("");
        require(success, "Transfer failed");

        emit BookingCompleted(_id, provider, amount);
    }

    // -----------------------------
    // CANCEL BOOKING (ONLY BEFORE ACCEPTANCE)
    // -----------------------------

    function cancelBooking(uint256 _id) external {
        Booking storage b = bookings[_id];

        require(b.id != 0, "Invalid booking");
        require(msg.sender == b.customer, "Only customer");
        require(b.status == Status.Created, "Cannot cancel now");

        b.status = Status.Cancelled;

        uint256 amount = b.amount;
        address payable customer = b.customer;

        (bool success, ) = customer.call{value: amount}("");
        require(success, "Refund failed");

        emit BookingCancelled(_id, customer, amount);
    }

    // -----------------------------
    // VIEW
    // -----------------------------

    function getBooking(uint256 _id) external view returns (Booking memory) {
        return bookings[_id];
    }
}