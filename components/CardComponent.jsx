"use client";
import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import { CardActionArea } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import AddToCartButton from "./AddToCartButton";

export default function CardComponent({ card, showButtons = true }) {
  const router = useRouter();
  // const addToCart = () => {
  //   console.log("add to cart");
  // };
  const buyNow = () => {
    console.log("buy now");
  };
  return (
    <Card variant="outlined" style={{ border: "none", maxWidth: 220 }}>
      <CardActionArea type="button" onClick={() => router.push(`/market/item/${card.id}`)}>
        <CardMedia
          // style={{ objectFit: "contain" }}
          style={{ objectFit: "cover", padding: 8 }}
          component="img"
          image={card.imageURL}
          alt={card.name}
        />
        <CardContent sx={{ p: 0.5 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography gutterBottom variant="caption" component="div">
              {card.name}
            </Typography>
            <Typography gutterBottom variant="caption" component="div">
              {card.price}
            </Typography>
          </div>
        </CardContent>
      </CardActionArea>

      {showButtons && ( // Conditionally render buttons based on showButtons prop
        <CardActions sx={{ p: 0.5 }}>
          <Button onClick={buyNow} variant="contained" color="secondary">
            Buy Now
          </Button>
          <AddToCartButton card={card} />
        </CardActions>
      )}
      
    </Card>
  );
}
