import User from "../model/userModel.js";

class UserValidator {
  checkUserValidate = async (req, res, next) => {
    const user = req.body;
    const id = req.params.id || "";

    if (!user.name) {
      return res.status(400).json({ status: false, message: "Name is required" });
    }
    if (user.name.trim().length < 10) {
      return res.status(400).json({ status: false, message: "Name must be at least 10 characters" });
    }

    if (!user.email) {
      return res.status(400).json({ status: false, message: "Email is required" });
    }
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email);
    if (!isEmailValid) {
      return res.status(400).json({ status: false, message: "Email is invalid" });
    }

    const emailFilter = id ? { email: user.email, _id: { $ne: id } } : { email: user.email };
    const emailExists = await User.findOne(emailFilter);
    if (emailExists) {
      return res.status(400).json({ status: false, message: "Email already exists" });
    }

    next();
  };
}

export default UserValidator;
// tạo vvaliator cho user