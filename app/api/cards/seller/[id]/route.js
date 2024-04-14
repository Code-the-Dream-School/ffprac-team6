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
    const idWithParams = req.url.split("seller/")[1];
    const id = idWithParams.split("?")[0];
    if (!id) {
      return NextResponse.json({ success: false, message: "Seller ID not provided" }, { status: 400 });
    }

    const token = await getToken({ req });
    //protecting the route with token and seller authentication remove for now
    // if (!token || !token.user.isSeller) {
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    //fetch filtered cards from the database with pagination
    const cards = await Card.find({ createdBy: id, ...searchQuery })
      .skip(skip)
      .limit(limit);
    const total = await Card.countDocuments({ createdBy: id, ...searchQuery });
    console.log("total", total);

    if (!cards || cards.length === 0) {
      return NextResponse.json({ success: false, message: "No cards found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { cards, total, page, limit } }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error }, { status: 400 });
  }
}
