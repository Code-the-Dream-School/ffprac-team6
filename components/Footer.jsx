import { Typography, Box } from "@mui/material";
import Link from "next/link";

const getCurrentYear = () => {
  const date = new Date().getFullYear();
  return date;
};

const Footer = () => {
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", p: 2.5, gap: 2, bgcolor: "primary.main" }}>
        <Typography variant="body2" color="background.paper">{` © ${getCurrentYear()}  PLAYTRADE`}</Typography>
        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />
        <Link href="/team" style={{ textDecoration: "none", color: "#FFFFFF" }}>
          Our Team
        </Link>
        {/* <Link href="/policies" style={{ textDecoration: "none", color: "#FFFFFF" }}>
          Policies
        </Link>
        <Link href="/messages" style={{ textDecoration: "none", color: "#FFFFFF" }}>
          Contact Us
        </Link> */}
      </Box>
    </>
  );
};

export default Footer;
