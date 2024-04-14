import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongo/dbConnect";
import { getToken } from "next-auth/jwt";
import User from "@/models/User";
import Seller from "@/models/Seller";

/**
 * @param {NextRequest} req
 * @param {NextResponse} res
 */

//GET seller by id

export async function GET(req, res) {
  await dbConnect();
  const token = await getToken({ req });
  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  try {
    const idWithParams = req.url.split("seller/")[1];
    const id = idWithParams.split("?")[0];
    console.log("id", id);
    if (!id) {
      return NextResponse.json({ success: false, message: "Seller ID not provided" }, { status: 400 });
    }
    const user = await User.findById(id);
    console.log("user", user);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    const seller = await Seller.findOne({ userId: id });
    console.log("seller", seller);
    if (!seller) {
      return NextResponse.json({ success: false, message: "Seller not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: { user, seller } }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error }, { status: 400 });
  }
}
