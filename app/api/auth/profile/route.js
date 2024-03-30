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

export const GET = async () => {
  await db.connect();
  const session = await getServerSession(authOptions);

  console.log(session);
  if (!session || !session.user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  const { email, name, _id } = session.user;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: "No such user found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: { name, email, _id} }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
};
