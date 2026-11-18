
const express = require("express");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// In-memory data
let registrations = [
    {
        id: 501,
        participantName: "Riya Sharma",
        eventName: "Tech Fest",
        department: "CSE",
        ticketCount: 2,
        paymentStatus: "Paid"
    },
    {
        id: 502,
        participantName: "Arjun Mehta",
        eventName: "Code Sprint",
        department: "IT",
        ticketCount: 1,
        paymentStatus: "Pending"
    },
    {
        id: 503,
        participantName: "Neha Verma",
        eventName: "Tech Fest",
        department: "ECE",
        ticketCount: 3,
        paymentStatus: "Paid"
    }
];

// GET all registrations
app.get("/api/registrations", (req, res) => {
    res.status(200).json(registrations);
});

// POST a new registration
app.post("/api/registrations", (req, res) => {
    const {
        participantName,
        eventName,
        department,
        ticketCount,
        paymentStatus
    } = req.body;

    if (
        !participantName ||
        !eventName ||
        !department ||
        !Number.isInteger(ticketCount) ||
        ticketCount <= 0 ||
        !["Paid", "Pending"].includes(paymentStatus)
    ) {
        return res.status(400).json({
            message: "Invalid registration data"
        });
    }

    const newRegistration = {
        id: registrations.length
            ? Math.max(...registrations.map(r => r.id)) + 1
            : 501,
        participantName,
        eventName,
        department,
        ticketCount,
        paymentStatus
    };

    registrations.push(newRegistration);

    res.status(201).json(newRegistration);
});

// GET pending registrations
app.get("/api/registrations/pending", (req, res) => {
    const pendingRegistrations = registrations.filter(
        r => r.paymentStatus === "Pending"
    );

    res.status(200).json(pendingRegistrations);
});

// FILTER registrations by department
app.get("/api/registrations/filter", (req, res) => {
    const department = req.query.department;

    if (!department) {
        return res.status(400).json({
            message: "Department query is required"
        });
    }

    const filteredRegistrations = registrations.filter(
        r => r.department === department
    );

    res.status(200).json(filteredRegistrations);
});

// CANCEL a pending registration
app.patch("/api/registrations/:id/cancel", (req, res) => {
    const id = Number(req.params.id);

    const registration = registrations.find(r => r.id === id);

    if (!registration) {
        return res.status(404).json({
            message: "Registration not found"
        });
    }

    if (registration.paymentStatus !== "Pending") {
        return res.status(400).json({
            message: "Only pending registrations can be cancelled"
        });
    }

    registration.paymentStatus = "Cancelled";

    res.status(200).json({
        message: "Registration cancelled successfully",
        registration
    });
});

// GET registration by ID
app.get("/api/registrations/:id", (req, res) => {
    const id = Number(req.params.id);

    const registration = registrations.find(r => r.id === id);

    if (!registration) {
        return res.status(404).json({
            message: "Registration not found"
        });
    }

    res.status(200).json(registration);
});

// PUT update registration
app.put("/api/registrations/:id", (req, res) => {
    const id = Number(req.params.id);

    const registration = registrations.find(r => r.id === id);

    if (!registration) {
        return res.status(404).json({
            message: "Registration not found"
        });
    }

    const {
        participantName,
        eventName,
        department,
        ticketCount,
        paymentStatus
    } = req.body;

    if (
        !participantName ||
        !eventName ||
        !department ||
        !Number.isInteger(ticketCount) ||
        ticketCount <= 0 ||
        !["Paid", "Pending"].includes(paymentStatus)
    ) {
        return res.status(400).json({
            message: "Invalid registration data"
        });
    }

    registration.participantName = participantName;
    registration.eventName = eventName;
    registration.department = department;
    registration.ticketCount = ticketCount;
    registration.paymentStatus = paymentStatus;

    res.status(200).json(registration);
});

// DELETE registration
app.delete("/api/registrations/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = registrations.findIndex(r => r.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Registration not found"
        });
    }

    registrations.splice(index, 1);

    res.status(200).json({
        message: "Registration deleted successfully"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
