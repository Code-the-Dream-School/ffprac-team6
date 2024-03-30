import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/mongo/dbConnect";
import { getToken } from "next-auth/jwt";
import Card from "@/models/Card";

/**
 *
 * @param {NextRequest} req
 * @param {NextResponse} res
 */

//GET all cards
//all can watch all cards
export async function GET(req, res) {
  await db.connect();
  try {
    // Fetch all cards from the database
    const cards = await Card.find({});
    if (!cards) {
      return NextResponse.json({ success: false, message: error.message || "No cards found" }, { status: 400 });
    }
    return NextResponse.json({ success: true, data: cards }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error }, { status: 400 });
  }
}

//Create card
export async function POST(req) {
  await db.connect();
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const userId = token.sub;
    const body = await req.json();
    body.createdBy = userId;

    const card = await Card.create(body);

    if (!card) {
      return NextResponse.json({ success: false, message: error.message || "Error saving a card" }, { status: 400 });
    }
    return new NextResponse(JSON.stringify({ success: true, data: card }), {
      status: 201 
    })
  } catch (error) {
    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(err => {
        let message = err.message;
        // Customize messages based on the validation error
        if (err.kind === 'maxlength') {
          message = `The ${err.path} '${err.value}' is too long. Maximum allowed length is ${err.properties.maxlength}.`;
        } else if (err.kind === 'minlength') {
          message = `The ${err.path} is too short. Minimum required length is ${err.properties.minlength}.`;
        } else if (err.kind === 'required') {
          message = `Please provide a ${err.path}.`;
        } else if (err.kind === 'enum') {
          message = `The ${err.path} '${err.value}' is not allowed. Allowed values are: ${err.properties.enumValues.join(", ")}.`;
        }
        return message;
      });
      return NextResponse.json({ 
        success: false, 
        message: "Validation error", 
        errors: errorMessages 
      }, { status: 400 });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: error.message || "Server error"
      }, { status: 500 });
    }
  }
}

//Delete all cards
export async function DELETE(req) {
  await db.connect();
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const userId = token.sub;
    const cards = await Card.deleteMany({ createdBy: userId });
    if (!cards) {
      console.log(error)
      return NextResponse.json({ success: false, message: error.message || "No cards found" }, { status: 400 });
    }
    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    console.log(error.message)
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
