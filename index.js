import express from "express";
import bodyParser from "body-parser";

import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
// Constants
const app = express();
const PORT = 3000;

// Middlewares
app.use(bodyParser.json());

// Routes
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.listen(PORT, () => {
  console.log("Server started on port: " + PORT);
});
