import { models, model } from "mongoose";
import SellerSchema from "@/models/Seller";
import BuyerSchema from "@/models/Buyer";
import User from "@/models/User";

async function createAssociatedModels(newUser) {
  if (newUser.role === "user") {
    const BuyerModel = models.Buyer || model("Buyer", BuyerSchema);
    await BuyerModel.create({ userId: newUser._id });

    if (newUser.isSeller) {
      const SellerModel = models.Seller || model("Seller", SellerSchema);
      const user = await User.findById(newUser._id);
      if (!user.address) {
        throw new Error("User should provide an address to become a seller");
      }
      await SellerModel.create({ userId: newUser._id, isRequestedAt: new Date() });
    }
  }
}
export default createAssociatedModels;
