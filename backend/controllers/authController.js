const User = require("../models/User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });

    if (exists)
      return res.status(400).json({
        message: "Email already exists",
      });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json(user);
  } catch (error) {
    console.log("err ", error.message)
    res.status(500).json(error);
  }
};

exports.login = async (req, res) => {
  try {
        console.log("regicter ", req.body);
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({
        message: "Invalid credentials",
      });

    const valid = await bcrypt.compare(password, user.password);

    if (!valid)
      return res.status(400).json({
        message: "Invalid credentials",
      });

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.json({
      token,
      user,
    });
  } catch (error) {
      console.log("err ", error.message);
    res.status(500).json(error);
  }
};
