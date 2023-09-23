const express = require("express");
const router = express.Router();
const getuser = require("../middleware/getuser");
const CodeSnippet = require("../models/CodeSnippet");
const { body, validationResult } = require("express-validator");

// ROUTE 1: Get all codesnippets of a particular user at endpoint "/api/codesnippet/getallcodesnippets".
router.get("/getallcodesnippets", getuser, async (req, res) => {
  try {
    const codesnippets = await CodeSnippet.find({ user: req.user.id });
    res.json(codesnippets);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 2: Add new codesnippet of a particular user at endpoint "/api/codesnippet/addcodesnippet"
router.post(
  "/addcodesnippet",
  getuser,
  [body("title", "Give a title for your CodeSnippet !").isLength({ min: 3 })],
  [body("code")],
  async (req, res) => {
    try {
      const { title, html, css, javascript } = req.body;
      // If errors ?  return bad request and the respective errors
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const codesnippet = new CodeSnippet({
        title,
        code: { html, css, javascript },
        user: req.user.id,
      });

      const savedCodeSnippet = await codesnippet.save();
      res.json(savedCodeSnippet);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 3: Update an existing codesnippet of a particular user at endpoint "/api/codesnippet/updatecodesnippet"
router.put("/updatecodesnippet/:id", getuser, async (req, res) => {
  const { title, code } = req.body;
  try {
    // Create a newCodeSnippet object
    const newCodeSnippet = {};
    if (title) {
      newCodeSnippet.title = title;
    }
    if (code) {
      newCodeSnippet.code = code;
    }

    // Find the codesnippet to be updated and update it
    let codesnippet = await CodeSnippet.findById(req.params.id);
    if (!codesnippet) {
      return res.status(404).send("Not Found");
    }

    if (codesnippet.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    codesnippet = await CodeSnippet.findByIdAndUpdate(
      req.params.id,
      { $set: newCodeSnippet },
      { new: true }
    );
    res.json({ codesnippet });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 4: Delete a codesnippet of a particular user at endpoint "/api/codesnippet/deletecodesnippet"
router.delete("/deletecodesnippet/:id", getuser, async (req, res) => {
  try {
    // Find the codesnippet to be deleted and delete it
    let codesnippet = await CodeSnippet.findById(req.params.id);
    if (!codesnippet) {
      return res.status(404).send("Not Found");
    }

    if (codesnippet.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    codesnippet = await CodeSnippet.findByIdAndDelete(req.params.id);
    res.send(' "Successfully deleted your CodeSnippet" ');
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
