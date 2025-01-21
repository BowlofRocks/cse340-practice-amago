// Import express using ESM syntax
import express from "express";
import { fileURLToPath } from "url";
import path from "path";

// Create __dirname and __filename variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create an instance of an Express application
const app = express();

const name = process.env.NAME;

const port = process.env.PORT;

// Place before all other calls to app
app.set("view engine", "ejs");
// Place after your existing app.use(express.static(...)) call
app.set("views", path.join(__dirname, "views"));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Example of the home route using the layout
app.get("/", (req, res) => {
  const title = "Home Page";
  const content = "<h1>Welcome to the Home Page</h1>";
  res.render("index", { title, content });
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
