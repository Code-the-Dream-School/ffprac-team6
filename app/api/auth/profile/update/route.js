import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/lib/mongo/dbConnect";
import User from "@/models/User";

/**
 *
 * @param {NextRequest} req
 * @param {NextResponse} res
 *
 */

// Update a user profile
export const PUT = async req => {
  await db.connect();
  const session = await getServerSession(authOptions);

  console.log("PUT IS HERE", session);
  if (!session || !session.user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.user._id;
    console.log("userId", userId);
    const body = await req.json();
    const { name, email } = body;
    console.log("NAME", name);
    console.log("EMAIL", email);
    if (!name || !email) {
      return new NextResponse.json({ message: error.message });
    }
    // console.log("NAME", name);
    // console.log("Email", email);
    // console.log("location", location);
    // console.log("userId", userId);
    const updateUser = await User.findByIdAndUpdate(userId, body, {
      new: true,
      runValidators: true
    });
    if (!updateUser) {
      return NextResponse.json({ success: false, message: "Profile not found" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Your profile is updated", data: updateUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message, data: error.data },
      { status: error.statusCode || 500 }
    );
  }
};
