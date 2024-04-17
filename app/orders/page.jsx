"use client";
// import { useRouter } from "next/navigation";
// import { Button } from "@mui/material";
// export default function Orders() {
//   const router = useRouter();
//   return (
//     <div>
//       <p>
//         Orders history Combined Buyer/Seller history of all orders with a way to filter by type (buy/sell), date,
//         seller/buyer.
//       </p>
//       <Button variant="contained" color="primary" onClick={() => router.push("/orders/[id]")}>
//         Order details
//       </Button>
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
import { Container, Typography, Box, ButtonBase, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const orders = [
  {
    id: 1,
    orderNumber: "ORD001",
    datePlaced: "04/04/2024",
    orderStatus: "Pending",
    shippingCost: 3.5,
    totalPrice: 16613.85,

    //   subtotalPrice,
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
        imageURL: "",
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
  },

  {
    id: 2,
    orderNumber: "ORD002",
    datePlaced: "28/02/2021",
    orderStatus: "Delivered",
    totalPrice: 25.0,
    currency: "USD",
    shippingCost: 5,
    items: [
      {
        id: 201,
        imageURL: "",

        name: "Andrei Svechnikov",
        quantity: 1,
        price: 25.0
      }
    ]
  },
  {
    id: 3,
    orderNumber: "ORD003",
    datePlaced: "01/01/2001",
    orderStatus: "Cancelled",
    totalPrice: 75,
    shippingCost: 0,
    currency: "USD"
  }
];

export default function Orders({ order }) {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Order history
        </Typography>
        <Typography variant="h4">Welcome back, {session?.user?.name}</Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Order #</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date placed</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Total amount</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {order.orderNumber}
                </TableCell>
                <TableCell>{order.datePlaced}</TableCell>
                <TableCell>{order.orderStatus}</TableCell>
                <TableCell>
                  {order.totalPrice}
                  {order.currency}
                </TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => router.push(`/orders/${order.id}`)}>
                    View order
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
