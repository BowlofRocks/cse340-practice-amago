// Import express using ESM syntax
import express from "express";
import { fileURLToPath } from "url";
import path from "path";

// Create __dirname and __filename variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create an instance of an Express application
const app = express();

const port = process.env.PORT;

// Place before all other calls to app
app.set("view engine", "ejs");
// Place after your existing app.use(express.static(...)) call
app.set("views", path.join(__dirname, "views"));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// ID validation middleware
const validateId = (req, res, next) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).send("Invalid ID: must be a number.");
  }
  next(); // Pass control to the next middleware or route
};

// Account page route with ID validation
app.get("/account/:name/:id", validateId, (req, res) => {
  const title = "Account Page";
  const { name, id } = req.params;
  const isEven = id % 2 === 0 ? "even" : "odd";
  const content = `
      <h1>Welcome, ${name}!</h1>
      <p>Your account ID is ${id}, which is an ${isEven} number.</p>
  `;
  res.render("index", { title, content, port });
});

// Handle 404 errors by passing an error
app.use((req, res, next) => {
  const error = new Error("Page Not Found");
  error.status = 404;
  next(error);
});

// Centralized error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const context = { port };
  res.status(status);
  if (status === 404) {
    context.title = "Page Not Found";
    res.render("404", context);
  } else {
    context.title = "Internal Server Error";
    context.error = err.message;
    res.render("500", context);
  }
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
