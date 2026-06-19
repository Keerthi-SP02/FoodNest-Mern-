console.log("***** MY SERVER.JS IS RUNNING *****");
console.log("***** THIS IS MY SERVER FILE *****");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const foodRoutes = require("./routes/foodRoutes");

require("dotenv").config();
console.log("JWT_SECRET =", process.env.JWT_SECRET);

const User = require("./models/User");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/foods", foodRoutes);
app.get("/api/test", (req, res) => {
  res.send("TEST WORKING");
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Cloud Connected Successfully");
    })
    .catch((error) => {
        console.log("MongoDB Connection Failed", error);
    });

app.get("/", (req, res) => {
    res.send("Backend server is running");
});

app.get("/api/test", (req, res) => {
    res.send("TEST WORKING");
});
app.post("/api/register", async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({
            message: "Registration Succesful",
        });
    } catch (error) {
    console.log("LOGIN ERROR:", error);

    res.status(500).json({
        message: "Login failed",
        error: error.message,
    });
}
});

app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email: email });
        console.log("User Found:", existingUser);

        if (!existingUser) {
            return res.status(400).json({
                message: "Invalid email or password",
            });
        }

        const isPasswordMatch = await bcrypt.compare(
            password,
            existingUser.password
        );
        console.log("Password Match:", isPasswordMatch);
console.log("JWT_SECRET:", process.env.JWT_SECRET);

        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
    {
        id: existingUser._id,
        email: existingUser.email,
    },
    "mysecretkey123",
    {
        expiresIn: "1h",
    }
);

        res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id: existingUser._id,
                fullName: existingUser.fullName,
                email: existingUser.email,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message,
        });
    }
});
app.get("/hello", (req, res) => {
  res.send("HELLO FROM SERVER");
});
app.get("/hello", (req, res) => {
  res.send("HELLO FROM MY SERVER");
});
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
})