import bcrypt from "bcryptjs";
import { createUser, getUser, updateUser } from "../models/users/userModel.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { sendEmailVerificationTemplate } from "../utils/emailProcessor.js";

export const registerUser = async (req, res) => {
  try {
    // register user logic
    // {username,email,password}
    let userObject = req.body;

    // encrypt the password
    let salt = bcrypt.genSaltSync(parseInt(process.env.SALT) || 10);
    userObject.password = bcrypt.hashSync(userObject.password, salt);

    let newUser = await createUser(userObject);
    if (newUser._id) {
      // Create unique code
      // Update user table with unique code
      const emailVerificationToken = uuidv4()
      const result = await updateUser(newUser._id, { emailVerificationToken })

      // Send email verification link
      const url = process.env.ROOT_DOMAIN + `/verify-email?t=${emailVerificationToken}&email=${newUser.email}`

      sendEmailVerificationTemplate({
        to: newUser.email,
        url,
        userName: newUser.username
      })
    }

    return res.status(201).json({
      status: true,
      message: "User successfully created!",
    });
  } catch (err) {
    console.log(err.message);

    if (err.message.includes("E11000")) {
      return res.status(400).json({
        status: false,
        message: "Email already used!",
      });
    } else {
      return res.status(500).json({
        status: false,
        message: "SERVER ERROR",
      });
    }
  }
};

export const loginUser = async (req, res) => {
  try {
    // login user
    // let email = req.body.email;
    // let pasword = req.body.password;

    let { email, password } = req.body;

    // fetch user from database
    let user = await getUser({ email: email });
    if (!user.status && !user.isEmailVerified) {
      return res.status(401).json({
        status: false,
        message: "Please verify your email first!"
      })
    }

    if (user) {
      // user found
      // user.password -> db password
      // compare password with user.password
      let passwordMatch = bcrypt.compareSync(password, user.password);
      if (passwordMatch) {
        user.password = "";

        let payload = {
          email: user.email,
        };

        let accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRESIN,
        });

        return res.status(200).json({
          status: true,
          message: "Login Successful",
          user,
          accessToken,
        });
      } else {
        return res.status(401).json({
          status: false,
          message: "User not authenticated!",
        });
      }
    } else {
      // user not found
      return res.status(401).json({
        status: false,
        message: "Credentials Mismatch!",
      });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      status: false,
      message: "Server Error!",
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    let token = req.query.t
    let email = req.query.email

    let user = await getUser({ email: email })

    if (user) {
      if (user.isEmailVerified) {
        return res.json({
          status: false,
          message: "User already verified!"
        })
      }

      if (user.emailVerificationToken === token) {
        user.isEmailVerified = true
        user.emailVerificationToken = ""
        await user.save()

        return res.json({
          status: true,
          message: "Email Verified!"
        })
      } else {
        return res.json({
          status: false,
          message: "Verification Failed!"
        })
      }
    } else {
      return res.json({
        status: false,
        message: "User not found!"
      })
    }
  } catch (error) {
    console.log(error.message)

    return res.json({
      status: false,
      message: "Verification Failed"
    })
  }
}

// Resend token
export const resendToken = async (req, res) => {
  try {
    let email = req.query.email;

    let user = await getUser({ email: email });

    if (user) {
      user.emailVerificationToken = uuidv4();
      user.isEmailVerified = false;
      await user.save();

      // send the email
      const url =
        process.env.ROOT_DOMAIN +
        `/verify-email?t=${user.emailVerificationToken}&email=${user.email}`;

      sendEmailVerificationTemplate({
        to: user.email,
        url,
        userName: user.username,
      });

      return res.json({
        status: true,
        message: "Token send to email",
      });
    } else {
      return res.json({
        status: false,
        message: "User not found",
      });
    }
  } catch (err) {
    console.log(err.message);
    return res.json({
      status: false,
      message: "Resend Failed",
    });
  }
};
