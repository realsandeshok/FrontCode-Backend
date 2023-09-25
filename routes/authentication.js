const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const getuser = require("../middleware/getuser");

const JWT_SECRET = "Mynameis$andesh:)";

// ROUTE 1: Createing user with method "POST" at endpoint /api/authentication/createuser, with validation but no login required.
router.post(
  "/createuser",
  [
    body("name", "Enter a valid Name with minimum 3 characters").isLength({
      min: 3,
    }),
    body("email", "Enter a valid Email").isEmail(),
    body(
      "password",
      "Enter a valid Password with minimum 8 characters"
    ).isLength({ min: 8 }),
  ],

  async (req, res) => {
    let success = false;
    // If errors ?  return bad request and the respective errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    // Check whether the user with the same email exists.

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        res.json({ success, error: "Email with this email Already exists !" });
      }

      const salt = await bcrypt.genSalt(10);
      const securePass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authenticationToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authenticationToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 2: Authenticating User with Credentials at endpoint /api/authentication/login, with validation but no login required.
router.post(
  "/login",
  [
    body("email", "Enter a valid Email").isEmail(),
    body(
      "password",
      "Enter a valid Password with minimum 8 characters"
    ).isLength({ min: 8 }),
  ],

  async (req, res) => {
    // If errors ?  return bad request and the respective errors
    let success = false;
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res.status(300).json({
          success,
          errors:
            "Invalid Password or Email, Please Login with correct Credentials",
        });
      }

      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword) {
        success = false;
        return res.status(300).json({
          success,
          errors:
            "Invalid Password or Email, Please Login with correct Credentials",
        });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const authenticationToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authenticationToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 3: Get user details using at endpoint /api/authentication/getuser. Login reqiured as we are getting loggedin user details.
router.post("/getuser", getuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
