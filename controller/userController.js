const User = require("../models/User");
const cryptoJS = require("crypto-js");
const UserData = require("../models/UserData");
const Level_depression = require("../models/Level_Depression")

const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

module.exports = {
  updateUser: async (req, res) => {
    if (req.body.password) {
      req.body.password = cryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString();
    }

    try {
      const UpdateUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status.json("Update thanh cong")
    } catch (err) { }
  },
  checkExistedEmail: async (req, res) => {
    try {
      const email = req.body.email;
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.json({ exists: true });
      } else {
        return res.json({ exists: false });
      }
    } catch (error) {
      res.status(500).json(error)
    }
  },
  getUser: async (req, res) => {
    try {
      const userData = await User.findById(req.params.id).select('-password');
      res.status(200).json(userData);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  createUser: async (req, res) => {
    const dateString = req.body.DOB;
    const parts = dateString.split("/");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    const dob = new Date(year, month - 1, day);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email, 
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      DOB: dob,
      password: cryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString(),
    });
    try {
      const savedUser = await newUser.save();
      console.log(savedUser)
      res.status(200).json({ user: savedUser });
    } catch (error) {
      res.status(400).json(error)
    }
  },
  loginUser: async (req, res) => {
    try {
      console.log(req.body);
      const user = await User.findOne({
        email: req.body.email,
      });
      console.log(user);
      if (!user) {
        res.status(200).json({ message: false });
      } else {
        const de_pass = cryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
        const depassword = de_pass.toString(cryptoJS.enc.Utf8);
        if (depassword != req.body.password) {
          res.status(200).json({ message: false });
        } else {
          // Remove accents from the user's name and address
          const userResponse = {
            ...user._doc, // Get the user object fields
            name: removeAccents(user.name),
            address: removeAccents(user.address),
          };
          res.status(200).json({ user: userResponse, message: true });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  getUserDataById: async (req, res) => {
    try {
      const userData = await UserData.findById(req.params.id);
      if (userData == null) {
        let newUserData = await UserData({
          _id: req.params.id,
          bio: "Whaly's bio",
          socialConnections: [],
        });
        const savedUserData = await newUserData.save();
        res.status(200).json({ userData: savedUserData, message: true });
      } else {
        res.status(200).json({ userData: userData, message: true });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error)
    }
  },
  updateSocialConnection: async (req, res) => {
    const userDataId = req.params.id;
    const { socialConnections } = req.body.s;

    try {
      const userData = await UserData.findByIdAndUpdate(userDataId, { $set: { socialConnections } }, { new: true }).select('-password');
      res.json(userData);
    } catch (error) {
      res.status(500).json({error: error.message});
    }
  },
  updateBio: async (req, res) => {
    const userDataId = req.params.id;
    const {bio} = req.body;

    try {
      const userData = await UserData.findByIdAndUpdate(userDataId, {$set: {bio}}, {new: true}).select('-password');
      res.json(userData);
    } catch (error) {
      res.status(500).json({error: error.message});
    }
  },
  updateNoti: async (req, res) => {
    const userDataId = req.params.id;
    const {notifications} = req.body;

    try {
      const userData = await UserData.findByIdAndUpdate(userDataId, {$set: {notifications}}, {new: true}).select('-password');
      res.json(userData);
    } catch (error) {
      res.status(500).json({error: error.message});
    }
  },
  updateAddress: async (req, res) => {
    const userId = req.params.id;
    const {address} = req.body;

    try {
      const user = await User.findByIdAndUpdate(userId, { $set: { address } }, { new: true }).select('-password');
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateName: async (req, res) => {
    const userId = req.params.id;
    const { name } = req.body;

    try {
      const user = await User.findByIdAndUpdate(userId, { $set: { name } }, { new: true }).select('-password');
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updatePhoneNo: async (req, res) => {
    const userId = req.params.id;
    const { phoneNumber } = req.body;

    try {
      const user = await User.findByIdAndUpdate(userId, { $set: { phoneNumber } }, { new: true }).select('-password');
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateDOB: async (req, res) => {
    const userId = req.params.id;
    const { DOB } = req.body;

    try {
      const user = await User.findByIdAndUpdate(userId, { $set: { DOB } }, { new: true }).select('-password');
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  checkExistedEmailAndPhoneNumber: async (req, res) => {
    try {
      const email = req.body.email;
      const phoneNumber = req.body.phoneNumber;

      // Kiểm tra xem email tồn tại hay không
      const existingEmailUser = await User.findOne({ email });

      // Kiểm tra xem phoneNumber tồn tại hay không
      const existingPhoneNumberUser = await User.findOne({ phoneNumber });

      if (existingEmailUser && existingPhoneNumberUser) {
        // Cả email và phoneNumber tồn tại
        return res.json({ status: true, user: existingEmailUser });
      } else {
        // Ít nhất một trong hai không tồn tại
        return res.json({ status: false });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updatePassword: async (req, res) => {
    try {
      const userId = req.body.userId;
      const newPassword = req.body.password;
      const encryptedPassword = cryptoJS.AES.encrypt(newPassword, process.env.SECRET_KEY).toString();
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { password: encryptedPassword } },
        { new: true }
      ).select('-password');

      res.json({ status: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getAllUser: async (req, res) => {
    try {
      const currentUserId = req.params.id;
      console.log(currentUserId)
      const currentUserLevelDepression = await Level_depression.findOne({
        userId: currentUserId,
      });
  
      if (!currentUserLevelDepression) {
        return res.status(404).json({ error: "User not found in Level_depression" });
      }

      const userLevel = currentUserLevelDepression.level;
      console.log(userLevel)
      const users = await Level_depression.find({
        userId: { $ne: currentUserId }, // Loại bỏ user hiện tại
        level: { $gte: userLevel - 1, $lte: userLevel + 1 }, // Đảm bảo level nằm trong khoảng 0 - 4
      });
  
      // Lọc ra các bản ghi có level hợp lệ (là một số)
      const validUsers = users.filter((user) => !isNaN(user.level));
  
      // Lấy danh sách các userId từ kết quả truy vấn
      const userIds = validUsers.map((user) => user.userId);
  
      // Tìm thông tin người dùng dựa trên danh sách userIds
      const allUsers = await User.find({ _id: { $in: userIds } }).select('-password');
  
      res.status(200).json(allUsers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  searchByName: async (req, res) => {
    const { name } = req.body;
    try {
      const users = await User.find({ name: { $regex: name, $options: "i" } });
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  addFriend: async (req, res) => {
    const { userId, friendId } = req.body;
    try {
      const user = await User.findById(userId);
      if (!user.friends.includes(friendId)) {
        user.friends.push(friendId);
        await user.save();
      }
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};
