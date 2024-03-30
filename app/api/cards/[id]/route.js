import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/mongo/dbConnect";
import { getToken } from "next-auth/jwt";
import Card from "@/models/Card";

/**
 *
 * @param {NextRequest} req
 * @param {NextResponse} res
 */
//all can watch single card
export async function GET(req, res) {
  await db.connect();
  try {
    //receive id from url
    const id = req.url.split("cards/")[1];
    // Find card in the database
    const card = await Card.findOne({
      _id: id
    });
    console.log(card);
    if (!card) {
      return NextResponse.json({ success: false, message: `No card with id: ${id}` }, { status: 400 });
    }
    return NextResponse.json({ success: true, data: card }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error }, { status: 400 });
  }
}

//edit data
export async function PATCH(req, res) {
  await db.connect();
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const userId = token.sub;
    // receive parameters from req
    const id = req.url.split("cards/")[1];
    const body = await req.json();
    const { name, price, currency, shippingCost, quantity } = body;

    if (!name || !price || !currency || !shippingCost || !quantity) {
      return NextResponse.json(
        { success: false, message: "Name, price, currency, shipping cost and quantity fields cannot be empty" },
        { status: 400 }
      );
    }

    const card = await Card.findByIdAndUpdate({ createdBy: userId, _id: id }, body, {
      new: true,
      runValidators: true
    });
    if (!card) {
      return NextResponse.json({ success: false, message: `No card with id ${id}` }, { status: 400 });
    }
    return NextResponse.json({ success: true, data: card }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error }, { status: 400 });
  }
}

//delete data
export async function DELETE(req, res) {
  await dbConnect();
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const userId = token.sub;
    //receive id from url
    const id = req.url.split("cards/")[1];
    const card = await Card.findOneAndDelete({
      _id: id,
      createdBy: userId
    });
    if (!card) {
      return NextResponse.json({ success: false, message: `No card with id ${id}` }, { status: 400 });
    }
    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error }, { status: 400 });
  }
}
