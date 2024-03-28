"use client";
import React from "react";
import CardsHome from "/components/CardsHome";
import { useRouter } from "next/navigation";
import { Box, Button, useTheme } from "@mui/material";

export default function Home() {
  const router = useRouter();
  const theme = useTheme(); // Access the theme

  return (
    <Box height="100vh">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          "position": "relative",
          "height": "100%",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundImage: "url(/landing_page.jpeg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.7,
            zIndex: -1
          }
        }}>
        <Button
          variant="contained"
          color="accent"
          onClick={() => router.push("/market")}
          sx={{
            "position": "absolute",
            "top": "50%",
            "left": "50%",
            "transform": "translate(-50%, -50%)",
            "fontSize": theme.typography.h4.fontSize,
            "padding": theme.spacing(1),
            "letterSpacing": "10px",
            "paddingLeft": theme.spacing(2),
            "borderRadius": theme.shape.borderRadius, // Use the theme border radius
            "&:hover": {
              backgroundColor: theme.palette.background.paper
            }
          }}>
          START
        </Button>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="flex-start"
        sx={{ height: { xs: "auto", sm: "auto" }, pt: 0, mt: 2 }}>
        <CardsHome />
      </Box>
      <Box height="1em" />
    </Box>
  );
}
