const { User } = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; 
const register = async (req, res) => {
  const { name, phone, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "این ایمیل قبلا ثبت شده است!" });
    }

    const user = new User({ name, email, phone, password });
    await user.save();

    res.status(201).json({ message: "ثبت‌نام با موفقیت انجام شد.", user });
  } catch (err) {
    res.status(500).json({ message: "خطای سرور", error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      res.status(404).json({ message: "کاربری با این مشخصات یافت نشد!" });
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);

    if (!matchPassword) {
      res.status(400).json({ message: "نلم کاربری یا رمز عبور اشتباه است" });
    }

    const accessToken = jwt.sign(
      {
        id: existingUser.id,
        phone: existingUser.phone,
        email: existingUser.email,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      {
        id: existingUser.id,
        phone: existingUser.phone,
        email: existingUser.email,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(200).json({
      user: existingUser,
      accessToken ,
      refreshToken,
      message: "User Logged in successfully"
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({message:"مشکلی پیش آمده است!"})
  }
};

module.exports = {
  register,
  login,
};
