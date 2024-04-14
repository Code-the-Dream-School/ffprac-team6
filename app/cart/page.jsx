"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { theme } from "/styles/theme.js";
import {
  Grid,
  Typography,
  Paper,
  Divider,
  Checkbox,
  Button,
  TextField,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  useMediaQuery,
  Box
} from "@mui/material";

// Custom hook for countdown timer interval
function useCountdown(initialTime, onEnd) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(timeLeft => {
        if (timeLeft === 0) {
          onEnd();
          return 0;
        } else {
          return timeLeft - 1;
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onEnd]);
  return timeLeft;
}

// Function for counting down time
function CartItem({ item, index, handleCheck, removeItemFromCart, handleQuantityChange, cartItems }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const timeLeft = useCountdown(1 * 60, () => setOpen(true));
  {
    /* For the presentation should be changed for useCountdown(15 * 60, */
  }
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // handleClose is to close the dialog
  const handleClose = () => {
    setOpen(false);
  };

  // handleCheckout - to navigate to the checkout page
  const handleCheckout = () => {
    router.push("/cart/checkout");
    handleClose();
  };

  //handleRemove - to remove the item from the cart
  const handleRemove = () => {
    removeItemFromCart(item.id);
    handleClose();
  };

  return (
    <React.Fragment key={item.id}>
      <Grid container sx={{ mt: 2, mb: 1, justifyContent: "flex-start" }} spacing={2}>
        {/* Checkbox, img, and Price */}
        <Grid item xs={12} sm={4} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Grid item xs={12} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box>
              <Checkbox checked={item.checked} onChange={() => handleCheck(index)} />
            </Box>
            <img src={`/cards/${item.img}`} alt={item.name} style={{ width: 100, height: 120 }} />
          </Grid>
          <Grid item xs={12} sx={{ mt: 1, pl: 5, display: "flex", textAlign: "center", textAlign: "center" }}>
            <Typography>Price:{item.price}</Typography>
          </Grid>
        </Grid>

        {/* Deal, Name, Description, Quantity */}
        <Grid item xs={12} sm={8} sx={{ display: "flex", flexDirection: "column" }}>
          {/* Countdown Deal */}
          <Typography
            variant="body1"
            sx={{ display: "flex", alignItems: "center", mt: 1, color: theme.palette.error.main }}>
            <WhatshotIcon color="error" />
            {`Your special deal reserved for ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`}
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {item.name}
          </Typography>
          <Typography variant="body2">{item.description}</Typography>
          {/* Quantity and Remove Button */}
          <Grid item xs={12} sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <TextField
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              value={item.quantity}
              onChange={e => handleQuantityChange(index, e.target.value)}
              size="small"
              sx={{ width: "5rem", mr: 2 }}
            />
            <Button onClick={() => removeItemFromCart(item.id)}>Remove</Button>
          </Grid>
        </Grid>
      </Grid>
      {index < cartItems.length - 1 && <Divider />} {/* Don't render a divider after the last item */}
      {/*Alert Box*/}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title" // for visually impaired users provide context about what the dialog is for
        aria-describedby="alert-dialog-description">
        <DialogContent>
          <Alert color="text.primary">
            Your time is up.
            <br />
            Would you like to proceed to checkout or remove your reserved item?
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRemove} color="secondary">
            Remove
          </Button>
          <Button onClick={handleCheckout} color="accent" autoFocus>
            Checkout
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default function Cart() {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const [checkoutUrl, setCheckoutUrl] = useState(() => () => {});

  // TODO//const id = router.query ? router.query.id : null;//get id from query  for cart item

  // Declare cartItems variable
  // Remove the redundant declaration of 'cartItems'

  useEffect(() => {
    setCheckoutUrl(() => () => router.push("/cart/checkout"));
  }, [router]);

  // Hardcoded cart items
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Destiny ",
      description:
        " You can reveal the top card of your Deck, and if it is a Normal Spell Card, send it to the Graveyard, otherwise place it on the bottom of your Deck",
      price: 1.15,
      img: "magic.png",
      checked: false,
      quantity: 2
    },
    {
      id: 2,
      name: "Gatomon",
      description: "When one of your other Digimon is deleted, this Digimon gets +3000 DP for the turn.",
      price: 0.1,
      img: "yugioh.png",
      checked: false,
      quantity: 1
    }
  ]);

  //check if cartItems is empty and count in the cart
  const handleCheck = index => {
    const newCartItems = [...cartItems];
    newCartItems[index].checked = !newCartItems[index].checked;
    setCartItems(newCartItems);
  };

  //Subtotal section
  const itemsCount = cartItems.reduce((total, item) => (item.checked ? total + item.quantity : total), 0);
  const totalPrice = cartItems.reduce((total, item) => (item.checked ? total + item.price * item.quantity : total), 0);

  // Remove item from cart
  const removeItemFromCart = itemId => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  // Changing quantity of the item in the cart
  const handleQuantityChange = (index, quantity) => {
    const newCartItems = [...cartItems];
    newCartItems[index].quantity = Number(quantity);
    setCartItems(newCartItems);
  };

  return (
    <Grid container spacing={2} direction={isSmallScreen ? "column-reverse" : "row"}>
      <Grid item xs={12} sm={8}>
        <Paper sx={{ mt: 3, mr: 3, ml: 3, padding: theme.spacing(2), marginBottom: theme.spacing(2) }}>
          <Grid container justifyContent="space-between" alignItems="flex-start">
            <Typography variant="body3" textAlign="left" fontWeight="bold">
              Shopping cart
            </Typography>
          </Grid>
          <Divider />
          {/* Check if items exist and map over them to render each item for future adding to the cart as well*/}
          {cartItems &&
            cartItems.map((item, index) => (
              <CartItem
                key={item.id}
                item={item}
                index={index}
                handleCheck={handleCheck}
                removeItemFromCart={removeItemFromCart}
                handleQuantityChange={handleQuantityChange}
                cartItems={cartItems}
              />
            ))}
        </Paper>
      </Grid>
      {/* Subtotal section */}
      <Grid item xs={12} sm={4}>
        <Paper sx={{ mt: 3, mr: 3, ml: 3, padding: theme.spacing(2), marginBottom: theme.spacing(2) }}>
          <Typography variant="body3" textAlign="left" fontWeight="bold">
            Subtotal
          </Typography>
          <Divider />
          <Typography variant="body1" sx={{ mt: 3 }}>
            Items ({itemsCount})
          </Typography>
          <Typography variant="body1" sx={{ mt: 3, mb: 2 }}>
            Total Price: {totalPrice.toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            color="accent"
            onClick={checkoutUrl}
            fullWidth
            size={theme.breakpoints.down("sm") ? "small" : "large"}>
            Checkout
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
}
