import crypto from "crypto";
import db from "@lib/mongo/dbConnect";
import User from "@/models/User";
import { NextResponse, NextRequest } from "next/server";
import createTransporter from "../../../utils/mailerConfig";
import { passwordResetEmail } from "../../../utils/emailTemplates/passwordResetEmail";

/**
 * @param {NextResponse} res
 * @param {NextRequest} req
 */

export const POST = async req => {
  await db.connect();
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return NextResponse.json({ error: "email does not exist" }, { status: 400 });
  }
  const resetToken = crypto.randomBytes(20).toString("hex");
  const passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  
  const passwordResetExpires = Date.now() + 3600000;

  existingUser.passwordResetToken = passwordResetToken;
  existingUser.passwordResetExpiry = passwordResetExpires;
  
  const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
  const EMAIL = process.env.MAIL_USERNAME;

  const transporter = await createTransporter();
  let mailOptions = {
    from: `Play Trade ${EMAIL}`,
    to: email,
    subject: "Password Reset Link",
    html: passwordResetEmail(resetUrl) 
  };

  try {
    await transporter.sendMail(mailOptions);
    await existingUser.save();
    return NextResponse.json({ message: "Reset link sent to your email address." });
  } catch {
    existingUser.passwordResetToken = "";
    existingUser.passwordResetExpiry = null;
    await existingUser.save();
    return NextResponse.json({ error: error.message }, { status: 500 });  }
};
