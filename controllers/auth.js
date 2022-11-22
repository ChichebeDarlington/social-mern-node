import { comparePassword, hashPassword } from "../bcrypt/bcrypt";
import User from "../models/auth";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  console.log("Resgistered endpoint", req.body);
  const { name, email, password, secret } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  if (!password || password.length < 7) {
    return res
      .status(400)
      .json({ error: "Password character should be longer than 7" });
  }
  if (!secret) {
    return res.status(400).json({ error: "Secret is required" });
  }
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    return res
      .status(400)
      .json({ error: "Email already exist in the database" });
  }
  // hash password
  const hashedPassword = await hashPassword(password);

  const user = new User({ name, email, password: hashedPassword, secret });
  try {
    await user.save();
    console.log("Registered user=>", user);
    return res.status(200).json({ okay: true });
  } catch (err) {
    console.log("Registration failed", err);
    return res.status(400).json({ error: "something went wrong" });
  }
};

export const signin = async (req, res) => {
  try {
    console.log(req.body);
    // check if email exist in database
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Not yet registered" });
    // check if password matched
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      return res.json({ error: "Wrong password" });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "12d",
    });
    user.password = undefined;
    user.secret = undefined;
    return res.json({ token, user });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Try again later" });
  }
};
