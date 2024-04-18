import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// Handle user signup
export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Validate request body
    if (
      !username ||
      !email ||
      !password ||
      username === "" ||
      email === "" ||
      password === ""
    ) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    // Hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success message
    res.json({ message: "Signup successful" });
  } catch (error) {
    // Handle any errors
    next(error);
  }
};

// Handle user signin
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password || email === "" || password === "") {
      return res.status(400).json({ error: "All fields are required!" });
    }

    // Find the user by email
    const user = await User.findOne({ email });

    // If user not found, return error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare passwords
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // Exclude password field from response
    const { password: pass, ...userData } = user._doc;

    // Set cookie and send user data with token
    res.cookie("access_token", token, { httpOnly: true }).json(userData);
  } catch (error) {
    // Handle any errors
    next(error);
  }
};

// Handle Google authentication
export const google = async (req, res, next) => {
  try {
    const { name, email, googlePhotoUrl } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // If user does not exist, generate random password
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      // Create a new user with Google data
      user = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });

      // Save the new user
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // Exclude password field from response
    const { password: pass, ...userData } = user._doc;

    // Set cookie and send user data with token
    res.cookie("access_token", token, { httpOnly: true }).json(userData);
  } catch (error) {
    // Handle any errors
    next(error);
  }
};


