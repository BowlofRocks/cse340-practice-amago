// Import required modules using ESM import syntax
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
// Import all other required modules: Route handlers, Middleware, etc.
import categoryRoute from "./src/routes/category/index.js";
import baseRoute from "./src/routes/index.js";
import layouts from "./src/middleware/layouts.js";
import configMode from "./src/middleware/config-mode.js";
import configureStaticPaths from "./src/middleware/static-paths.js";
import {
  notFoundHandler,
  globalErrorHandler,
} from "./src/middleware/error-handler.js";
import { setupDatabase } from "./src/database/index.js";

// Get the current file path and directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get environment variables
const port = process.env.PORT || 3000;
const mode = process.env.MODE || "production";

// Create an instance of an Express application
const app = express();

// Configure the application based on environment settings
app.use(configMode);

// Configure static paths for the Express application
configureStaticPaths(app);

// Set EJS as the view engine and record the location of the views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// Set Layouts middleware to automatically wrap views in a layout and configure default layout
app.set("layout default", "default");
app.set("layouts", path.join(__dirname, "src/views/layouts"));
app.use(layouts);

// Middleware to parse JSON data in request body
app.use(express.json());

// Middleware to parse URL-encoded form data (like from a standard HTML form)
app.use(express.urlencoded({ extended: true }));

app.use("/", baseRoute);
app.use("/category", categoryRoute);

// Apply error handlers
app.use(notFoundHandler);
app.use(globalErrorHandler);

// When in development mode, start a WebSocket server for live reloading
if (mode.includes("dev")) {
  const ws = await import("ws");

  try {
    const wsPort = parseInt(port) + 1;
    const wsServer = new ws.WebSocketServer({ port: wsPort });

    wsServer.on("listening", () => {
      console.log(`WebSocket server is running on port ${wsPort}`);
    });

    wsServer.on("error", (error) => {
      console.error("WebSocket server error:", error);
    });
  } catch (error) {
    console.error("Failed to start WebSocket server:", error);
  }
}
// Start the server on the specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await setupDatabase();
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
