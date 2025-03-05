import { Router } from "express";
import { registerUser, verifyUser } from "../../models/account/index.js";
import { body, validationResult } from "express-validator";
import { requireAuth } from "../../utils/index.js";
const router = Router();

// Account page route
router.get("/", requireAuth, async (req, res) => {
  res.render("account/index", { title: "Account Dashboard" });
});

// Login page route
router.get("/login", async (req, res) => {
  res.render("account/login", { title: "Login" });
});

// Register page route
router.get("/register", async (req, res) => {
  res.locals.scripts.push("<script src='/js/registration.js'></script>");
  res.render("account/register", { title: "Register" });
});

// Build an array of validation checks for the registration route
const registrationValidation = [
  body("email").isEmail().withMessage("Invalid email format."),
  body("password")
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
    .withMessage(
      "Password must be at least 8 characters long, include one uppercase letter, one number, and one symbol."
    ),
];

//add an account using post
router.post("/register", registrationValidation, async (req, res) => {
  // Check if there are any validation errors
  const results = validationResult(req);
  if (results.errors.length > 0) {
    results.errors.forEach((error) => {
      req.flash("error", error.msg);
    });
    res.redirect("/account/register");
    return;
  }

  const { email, password, confirm_password } = req.body;
  console.log(email, password, confirm_password);

  // Check if required fields are empty
  if (!email || !password || !confirm_password) {
    req.flash("error", "Required fields must not be empty.");
    return res.redirect("/account/register"); // Redirect back to the registration page
  }

  // Check if passwords match
  if (password !== confirm_password) {
    req.flash("error", "Passwords do not match.");
    return res.redirect("/account/register");
  }

  await registerUser(email, password);
  //redirect to login page
  req.flash("success", "Registration successful! Please log in.");
  res.redirect("/account/login");
});

//add an account using post
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await verifyUser(email, password);

  if (!user) {
    req.flash("error", "Invalid email or password.");
    return res.redirect("/account/login");
  } else if (user) {
    req.flash("success", "Login successful!");
    delete user.password;
    req.session.user = user;
  }

  //redirect to login page
  res.redirect("/account");
});
export default router;
