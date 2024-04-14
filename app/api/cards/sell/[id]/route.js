import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongo/dbConnect";
import { getToken } from "next-auth/jwt";
import Card from "@/models/Card";

/**
 *
 * @param {NextRequest} req
 * @param {NextResponse} res
 */

//GET all cards created by seller

export async function GET(req, res) {
  await dbConnect();

  try {
    console.log("req.url", req.url);
    const id = req.url.split("sell/")[1];
    if (!id) {
      return NextResponse.json({ success: false, message: "Seller ID not provided" }, { status: 400 });
    }

    const token = await getToken({ req });
    //protecting the route with token and seller authentication remove for now
    // if (!token || !token.user.isSeller) {
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const cards = await Card.find({ createdBy: id });

    if (!cards || cards.length === 0) {
      return NextResponse.json({ success: false, message: "No cards found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { cards } }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error }, { status: 400 });
  }
}
