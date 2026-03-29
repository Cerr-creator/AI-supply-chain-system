const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🌦 WEATHER AGENT
function weatherAgent() {
    const isBad = Math.random() > 0.7;

    return {
        risk: isBad ? "HIGH" : "LOW",
        temp: Math.floor(Math.random() * 45), // simulated temp
        condition: isBad ? "Rain" : "Clear"
    };
}

// ⚔️ CONFLICT AGENT (REPLACES NEWS)
function conflictAgent() {
    const risk = Math.random() > 0.8 ? "HIGH" : "LOW";

    return {
        risk,
        message: risk === "HIGH" ? "Conflict detected" : "Stable region"
    };
}

// 🚦 TRAFFIC AGENT
function trafficAgent() {
    const risk = Math.random() > 0.6 ? "HIGH" : "LOW";

    return {
        risk,
        message: risk === "HIGH" ? "Heavy traffic" : "Smooth traffic"
    };
}

// 🧠 SAFETY CALCULATION (MATCH FRONTEND)
function calculateSafety(weather, traffic) {

    let score = 100;

    if (weather.temp > 40) score -= 40;
    if (weather.temp < 5) score -= 20;

    if (weather.condition.toLowerCase().includes("rain")) score -= 30;

    if (traffic.risk === "HIGH") score -= 20;

    let level;

    if (score >= 70) level = "SAFE";
    else if (score >= 40) level = "MODERATE";
    else level = "UNSAFE";

    return { score, level };
}

// 🛣 ROUTE LOGIC
function getRouteName(source, destination) {
    if (
        source.toLowerCase().includes("vijayawada") &&
        destination.toLowerCase().includes("hyderabad")
    ) {
        return "NH65 Highway (Vijayawada → Suryapet → Hyderabad)";
    }

    return `${source} → ${destination} Optimized Route`;
}

// 🌐 MAIN API
app.get("/api/optimize", (req, res) => {

    const source = req.query.source || "Hyderabad";
    const destination = req.query.destination || "Chennai";

    const weather = weatherAgent();
    const conflicts = conflictAgent();   // 🔥 changed
    const traffic = trafficAgent();

    const safety = calculateSafety(weather, traffic);

    const route = getRouteName(source, destination);

    res.json({
        weather,
        conflicts,   // 🔥 must match frontend
        traffic,
        safety,      // 🔥 new
        decision: {
            recommendedRoute: route,
            riskScore: 100 - safety.score,
            safetyLevel: safety.level
        }
    });
});

// 🚀 START SERVER
app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});