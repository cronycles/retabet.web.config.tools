const express = require("express");
const bodyParser = require("body-parser");
const configRoutes = require("./routes/configRoutes");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use("/api", configRoutes);

// Serve static files for the frontend
app.use(express.static(path.join(__dirname, "public")));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
