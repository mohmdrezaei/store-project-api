const { User } = require("../models/User");
const register = async  (req, res) => {
    const { username,phone, email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({email});
      if (existingUser) {
        return res.status(400).json({ message: 'این ایمیل قبلا ثبت شده است!' });
      }

      const user = new User({ username, email, password });
      await user.save();
  
      res.status(201).json({ message: 'ثبت‌نام با موفقیت انجام شد.', user });
    } catch (err) {
      res.status(500).json({ message: 'خطای سرور', error: err.message });
    }
  }

  module.exports= {
    register
  }