import { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new Schema({
  name: {
    // changed from username to name for google oauth
    type: String,
    required: [true, "Please enter your name"]
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email address"
    ]
  },
  password: {
    type: String,
    required: [true, "Please provide your password"],
    match: [
      /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
      "Password should be at least 8 characters long and contain at least one special character"
    ]
  },
  imageProfileURL: {
    type: String,
    match: [
      /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png|webp|svg|JPG|JPEG|GIF|PNG|WEBP|SVG)/,
      "Invalid image URL format"
    ]
  },
  authProvider: {
    type: Boolean,
    default: false,
    required: false
  },
  passwordResetToken: {
    type: String,
    required: false,
  },
  passwordResetExpiry: {
    type: Date,
    required: false,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  },
  address: {
    type: String,
    maxLength: 50,
    required: function () {
      return this.isSeller === true;
    }
    
  },
  isSeller: {
    type: Boolean,
    default: false
  }
});

// Encrypt password before saving
UserSchema.pre("save", async function () {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});


UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id, email: this.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME
  });
};

UserSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

// edit user
UserSchema.methods.editUser = async function (updatedUserInfo) {
  try {
    if (updatedUserInfo.imageProfileURL) {
      this.imageProfileURL = updatedUserInfo;
    }
    Object.assign(this, updatedUserInfo);
    await this.save();
    console.log("User was successfully updated");
  } catch (error) {
    console.log("Error");
    throw error;
  }
};

//delete user
UserSchema.methods.deleteUser = async function () {
  try {
    await this.remove();
    console.log("User was successfully deleted");
  } catch (error) {
    console.log("Error");
    throw error;
  }
};

const User = models.User || model("User", UserSchema);
export default User;
