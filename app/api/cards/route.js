import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongo/dbConnect";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Card from "@/models/Card";

/**
 *
 * @param {NextRequest} req
 * @param {NextResponse} res
 */

//GET all cards
//all can watch all cards
export async function GET(req, res) {
  await dbConnect();
  //extracting query parameters from the request URL
  const name = req.nextUrl.searchParams.get("search");
  const condition = req.nextUrl.searchParams.get("conditions");
  const priceFrom = req.nextUrl.searchParams.get("priceFrom");
  const priceTo = req.nextUrl.searchParams.get("priceTo");
  const category = req.nextUrl.searchParams.get("category");
  const availability = req.nextUrl.searchParams.get("availability");

  //pagination setup with default values if not specified
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "6", 10);
  const skip = (page - 1) * limit;

  const searchQuery = {};

  if (name) {
    const decodedName = decodeURIComponent(name);
    //the regex matches on spaces, commas, and semicolons as separators
    const searchTerms = decodedName.split(/[\s,;]+/);
    //using $or to match documents with any listed names
    searchQuery.$or = searchTerms.map(term => ({
      name: new RegExp(term, "i") //case-insensitive match
    }));
  }
  if (condition) {
    const decodedCondition = decodeURIComponent(condition);
    searchQuery.conditions = new RegExp(`^${decodedCondition}$`, "i");
  }
  if (priceFrom && priceTo) {
    //converting the string values to numbers for comparison + in db the price is stored as number
    const priceFromNumber = Number(priceFrom);
    const priceToNumber = Number(priceTo);
    //ensuring priceFrom is less than or equal to priceTo and both are valid numbers
    //to prevent invalid queries where price values are non-numeric
    if (!isNaN(priceFromNumber) && !isNaN(priceToNumber) && priceFromNumber <= priceToNumber) {
      searchQuery.price = { $gte: priceFromNumber, $lte: priceToNumber };
    }
  }
  if (availability) {
    searchQuery.available = availability;
  }
  if (category) {
    searchQuery.category = category;
  }

  try {
    //fetch filtered cards from the database with pagination
    const cards = await Card.find(searchQuery).skip(skip).limit(limit);
    console.log("cards", cards);
    const total = await Card.countDocuments(searchQuery);
    console.log("total", total);
    if (!cards) {
      return NextResponse.json({ success: false, message: error.message || "No cards found" }, { status: 400 });
    }
    console.log("cards, total, page, limit", cards, total, page, limit);
    return NextResponse.json({ success: true, data: { cards, total, page, limit } }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error }, { status: 400 });
  }
}

//Create card
export async function POST(req) {
  await dbConnect();

  try {
    const token = await getToken({ req });
    //protecting the route with token and seller authentication
    if (!token || !token.user.isSeller) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const userId = token.user._id;
    const body = await req.json();
    body.createdBy = userId;

    const card = await Card.create(body);

    if (!card) {
      return NextResponse.json({ success: false, message: error.message || "Error saving a card" }, { status: 400 });
    }
    return new NextResponse(JSON.stringify({ success: true, data: card }), {
      status: 201
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(err => {
        let message = err.message;
        // Customize messages based on the validation error
        if (err.kind === "maxlength") {
          message = `The ${err.path} '${err.value}' is too long. Maximum allowed length is ${err.properties.maxlength}.`;
        } else if (err.kind === "minlength") {
          message = `The ${err.path} is too short. Minimum required length is ${err.properties.minlength}.`;
        } else if (err.kind === "required") {
          message = `Please provide a ${err.path}.`;
        } else if (err.kind === "enum") {
          message = `The ${err.path} '${
            err.value
          }' is not allowed. Allowed values are: ${err.properties.enumValues.join(", ")}.`;
        }
        return message;
      });
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: errorMessages
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: error.message || "Server error"
        },
        { status: 500 }
      );
    }
  }
}

//Delete all cards
export async function DELETE(req) {
  await dbConnect();

  try {
    const token = await getToken({ req });
    //protecting the route with token and seller authentication
    if (!token || !token.user.isSeller) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const userId = token.user._id;
    const cards = await Card.deleteMany({ createdBy: userId });
    if (!cards) {
      console.log(error);
      return NextResponse.json({ success: false, message: error.message || "No cards found" }, { status: 400 });
    }
    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    console.log(error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
