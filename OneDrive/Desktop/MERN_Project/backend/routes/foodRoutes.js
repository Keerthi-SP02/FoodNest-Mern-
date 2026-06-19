const express = require("express");
const router = express.Router();
console.log("Food Routes Loaded");

const Food = require("../models/Food");


// GET ALL FOODS
router.get("/", async (req, res) => {
  try {
    const foods = await Food.find();

    res.json(foods);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// ADD FOOD

router.post("/", async (req, res) => {
  try {
    const food = new Food(req.body);

    await food.save();

    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// UPDATE FOOD

router.put("/:id", async (req, res) => {
  try {
    const updatedFood =
      await Food.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(updatedFood);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// DELETE FOOD

router.delete("/:id", async (req, res) => {
  try {
    await Food.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Food deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;