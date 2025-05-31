const axios = require("axios");

const API_URL = "http://localhost:3000";
let authToken = "";
let userId = "";

async function testAPI() {
    try {
        // 1. Test Registration with invalid data
        console.log("\n1. Testing Registration with invalid data...");
        try {
            await axios.post(`${API_URL}/api/auth/register`, {
                email: "invalid-email",
                password: "123",
                name: "T",
            });
        } catch (error) {
            console.log("Expected validation error:", error.response.data);
        }

        // 2. Test Registration with valid data
        console.log("\n2. Testing Registration with valid data...");
        const registerResponse = await axios.post(`${API_URL}/api/auth/register`, {
            email: `test${Date.now()}@example.com`,
            password: "password123",
            name: "Test User",
        });
        console.log("Registration successful:", registerResponse.data);
        userId = registerResponse.data.user.id;

        // 3. Test Login with invalid credentials
        console.log("\n3. Testing Login with invalid credentials...");
        try {
            await axios.post(`${API_URL}/api/auth/login`, {
                email: "wrong@example.com",
                password: "wrongpass",
            });
        } catch (error) {
            console.log("Expected login error:", error.response.data);
        }

        // 4. Test Login with valid credentials
        console.log("\n4. Testing Login with valid credentials...");
        const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
            email: registerResponse.data.user.email,
            password: "password123",
        });
        authToken = loginResponse.data.token;
        console.log("Login successful:", loginResponse.data);

        // 5. Test Get Current User
        console.log("\n5. Testing Get Current User...");
        const userResponse = await axios.get(`${API_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${authToken}` },
        });
        console.log("Current user:", userResponse.data);

        // 6. Test Restaurant Recommendations with invalid parameters
        console.log("\n6. Testing Restaurant Recommendations with invalid parameters...");
        try {
            await axios.get(`${API_URL}/api/restaurants/recommendations?latitude=200&longitude=500&radius=0`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
        } catch (error) {
            console.log("Expected validation error:", error.response.data);
        }

        // 7. Test Restaurant Recommendations with valid parameters
        console.log("\n7. Testing Restaurant Recommendations with valid parameters...");
        const restaurantsResponse = await axios.get(`${API_URL}/api/restaurants/recommendations?latitude=40.7128&longitude=-74.0060&radius=1500`, {
            headers: { Authorization: `Bearer ${authToken}` },
        });
        console.log("Found restaurants:", restaurantsResponse.data.restaurants.length);
        console.log("Response message:", restaurantsResponse.data.message);

        // 8. Test Get All Audit Logs
        console.log("\n8. Testing Get All Audit Logs...");
        const auditResponse = await axios.get(`${API_URL}/api/audit?page=1&limit=10`, {
            headers: { Authorization: `Bearer ${authToken}` },
        });
        console.log("Total audit logs:", auditResponse.data.total);

        // 9. Test Get User Audit Logs
        console.log("\n9. Testing Get User Audit Logs...");
        const userAuditResponse = await axios.get(`${API_URL}/api/audit/user/${userId}?page=1&limit=10`, {
            headers: { Authorization: `Bearer ${authToken}` },
        });
        console.log("User audit logs:", userAuditResponse.data);

        console.log("\nAll tests completed successfully!");
    } catch (error) {
        console.error("Test failed:", error.response?.data || error.message);
        process.exit(1);
    }
}

// Add test command to package.json
console.log("Running API tests...");
testAPI();
