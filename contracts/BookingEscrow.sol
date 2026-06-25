// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BookingEscrow {

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

    // EVENTS
    event BookingCreated(
        uint256 indexed id,
        address indexed customer,
        uint256 amount
    );

    event BookingAccepted(
        uint256 indexed id,
        address indexed provider
    );

    event BookingCompleted(
        uint256 indexed id
    );

    event BookingCancelled(
        uint256 indexed id
    );
    event ProviderMarkedComplete(uint256 indexed id);

    // 1. CREATE BOOKING (Customer locks ETH)
    function createBooking() external payable {
        require(msg.value > 0, "Send ETH to create booking");

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
    

    // 2. ACCEPT BOOKING (Provider accepts job)
    function acceptBooking(uint256 _id) external {
        Booking storage b = bookings[_id];

        require(b.id != 0, "Invalid booking");
        require(b.status == Status.Created, "Not available");
        require(b.provider == address(0), "Already assigned");

        b.provider = payable(msg.sender);
        b.status = Status.Accepted;

        emit BookingAccepted(_id, msg.sender);
    }

    // 3. COMPLETE BOOKING (Customer approves completion)
    
    function providerComplete(uint256 _id) external {
    Booking storage b = bookings[_id];

    require(b.id != 0, "Invalid booking");
    require(msg.sender == b.provider, "Only provider");
    require(b.status == Status.Accepted, "Not active");

    b.status = Status.ProviderCompleted;

    emit ProviderMarkedComplete(_id);
    }
    function confirmCompletion(uint256 _id) external {
    Booking storage b = bookings[_id];

    require(b.id != 0, "Invalid booking");
    require(msg.sender == b.customer, "Only customer");
    require(b.status == Status.ProviderCompleted, "Not ready");

    b.status = Status.Completed;

    (bool success, ) = b.provider.call{value: b.amount}("");
    require(success, "Transfer failed");

    emit BookingCompleted(_id);
    }

    // 4. CANCEL BOOKING (Before acceptance only)
    function cancelBooking(uint256 _id) external {
        Booking storage b = bookings[_id];

        require(b.id != 0, "Invalid booking");
        require(msg.sender == b.customer, "Only customer can cancel");
        require(b.status == Status.Created, "Cannot cancel now");

        b.status = Status.Cancelled;

        // Refund customer
        (bool success, ) = b.customer.call{value: b.amount}("");
        require(success, "Refund failed");

        emit BookingCancelled(_id);
    }

    // VIEW FUNCTION
    function getBooking(uint256 _id) external view returns (Booking memory) {
        return bookings[_id];
    }
}