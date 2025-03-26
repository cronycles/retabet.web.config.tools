import express from "express";
import bodyParser from "body-parser";
import configRoutes from "./routes/configRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.json());
app.use("/api", configRoutes);

// Serve static files for the frontend
app.use(express.static(path.join(__dirname, "public")));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
