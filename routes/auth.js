import express from "express";
import { register } from "../controllers/auth";
import { signin } from "../controllers/auth";
const router = express.Router();

router.post("/register", register);
router.post("/signin", signin);

module.exports = router;
