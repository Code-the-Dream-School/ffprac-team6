// export default function Page({ params }) {
//   return (
//     <div>
//       <h2>Order unique card: {params.id}</h2>
//     </div>
//   );
// }

import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Container, Typography, Box, Divider, Avatar } from "@mui/material";
import CardComponent from "@/components/CardComponent";

const order = {
  id: 1,
  orderNumber: "ORD001",
  datePlaced: "04/04/2024",
  orderStatus: "Pending",
  shippingCost: 3.5,
  //   subtotalPrice,
  //   totalPrice: totalPrice,
  currency: "CAD",
  items: [
    {
      id: 101,
      imageURL: "https://m.media-amazon.com/images/I/51skd-tjunL._AC_.jpg",

      name: "Pikachu",
      quantity: 2,
      price: 25.0
    },
    {
      id: 102,
      name: "Bob Bobov",
      quantity: 1,
      price: 50.0
    },
    {
      id: 103,
      imageURL: "https://i.ebayimg.com/images/g/BG8AAOSweppkjGfq/s-l1200.webp",
      name: "Bulbasaur",
      quantity: 1,
      price: 15000.0
    }
  ]
};
const subtotalPrice = order.items.reduce((accumulator, currentItem) => {
  return accumulator + currentItem.price * currentItem.quantity;
}, 0);

// Tax rate
const taxRate = 0.1;

const tax = Number(((subtotalPrice + order.shippingCost) * taxRate).toFixed(2));
const totalPrice = subtotalPrice + order.shippingCost + tax;

export default function Order({ item }) {
  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 10 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Order details #{order.orderNumber}
        </Typography>
        <Typography variant="h4">{order.datePlaced}</Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Item #</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Item picture</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Item name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Order total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.items.map(item => (
              <TableRow key={item.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {item.itemNumber}
                </TableCell>
                <TableCell>
                  <CardComponent card={item} showInformation={false} showButtons={false} />
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 3, display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Box>
          <Typography sx={{ fontWeight: "bold" }}> Shipping informations</Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", width: "30%" }}>
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>Order summary</Typography>
          </Box>
          <Box flexDirection="row" display="flex" justifyContent="space-between">
            <Box>
              <Typography>Subtotal</Typography>
            </Box>
            <Box>
              {subtotalPrice}
              {order.currency}
            </Box>
          </Box>
          <Box flexDirection="row" display="flex" justifyContent="space-between">
            <Box>
              <Typography>Shipping</Typography>
            </Box>
            <Box>
              {order.shippingCost}
              {order.currency}
            </Box>
          </Box>
          <Box flexDirection="row" display="flex" justifyContent="space-between">
            <Box>
              <Typography>Tax</Typography>
            </Box>
            <Box>
              {tax}
              {order.currency}
            </Box>
          </Box>
          <Divider />
          <Box flexDirection="row" display="flex" justifyContent="space-between">
            <Box>
              <Typography>Total</Typography>
            </Box>
            <Box>
              {totalPrice}
              {order.currency}
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
