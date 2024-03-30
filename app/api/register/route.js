import db from "@lib/mongo/dbConnect";
import User from "@/models/User";
import { NextResponse, NextRequest } from "next/server";
import createAssociatedModels from "@/utils/createAssociatedModels";

/**
 * @param {NextResponse} res
 * @param {NextRequest} req
 */

export const POST = async req => {
  try {
    await db.connect();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "name, email and password are required" }, { status: 400 });
    }
    const emailExist = await User.findOne({ email });
    const nameExist = await User.findOne({ name });
    if (emailExist || nameExist) {
      return NextResponse.json({ error: "email or name already exists" }, { status: 400 });
    }

    const newUser = await new User({
      name,
      email,
      password, // <-password is hashed  in the User model
      role: "user"
    });
    await newUser.save();
    const token = newUser.createJWT();
    await createAssociatedModels(newUser);

    return NextResponse.json(
      {
        message: "User is saved successfully",
        user: newUser,
        token
      },

      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
