// components/Navbar.js
"use client";
import React, { useEffect, useState } from "react";
import { alpha } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import useAuthUser from "../store/useAuthUser";
import {
  Badge,
  Box,
  Button,
  Typography,
  InputBase,
  AppBar,
  Toolbar,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  Avatar
} from "@mui/material";
import { Search, ShoppingCart } from "@mui/icons-material";

const Navbar = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  //Cart badge count
  const [count, setCount] = useState(0);
  const router = useRouter();
  const { logout } = useAuthUser();
  const { data: session } = useSession();

  const profileItems = [
    {
      displayName: "Profile",
      onClick: () => router.push("/profile"),
      show: true
    },
    {
      displayName: "Orders",
      onClick: () => router.push("/orders"),
      show: true
    },
    {
      displayName: "Sell",
      onClick: () => router.push("/sell"),
      show: session?.user?.isSeller
    }
    // {
    //   displayName: "Wishlist",
    //   onClick: () => router.push("/watch"),
    //   show: true
    // }
  ];
  const categories = ["Magic", "Pokemon", "Digimon", "Yu-Gi-Oh!", "Sport Card"];

  const handleKeyDown = event => {
    if (event.key === "Enter") {
      const trimmedSearchInput = searchInput.trim();
      setSearchInput(trimmedSearchInput);
      if (trimmedSearchInput) {
        //if the search input is not empty navigate to the market with the search parameter
        router.push(`/market?search=${encodeURIComponent(searchInput)}`);
      } else {
        //otherwise navigate to the market page without any search parameter
        router.push(`/market`);
      }
      setSearchInput("");
    }
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 4,
        flexGrow: 1
      }}>
      <AppBar component="nav" display="flex" sx={{ flexGrow: 1 }}>
        <Toolbar>
          <Box
            width="100%"
            gap={2}
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: theme.palette.primary.main
            }}>
            <Box className="logo" sx={{ cursor: "pointer" }}>
              <Link href="/" legacyBehavior>
                <Image src="/logo.png" alt="Play Trade" width={50} height={50} priority={true} />
              </Link>
            </Box>
            <nav className="nav">
              <Button
                id="cards-button"
                color="inherit"
                aria-controls={open ? "cards-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={event => {
                  setAnchorEl(event.currentTarget);
                }}
                variant="outlined">
                Cards
              </Button>
              <Menu
                id="cards-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "cards-button"
                }}>
                <MenuItem
                  onClick={() => {
                    router.push("/market"), handleClose();
                  }}>
                  All cards
                </MenuItem>
                <Divider />
                {categories.map(category => (
                  <MenuItem
                    key={category}
                    onClick={() => {
                      router.push(`/market?category=${encodeURIComponent(category)}`), handleClose();
                    }}>
                    {category}
                  </MenuItem>
                ))}
              </Menu>
            </nav>
            <Box flexGrow={1} />
            <Box className="search" sx={{ width: "50%" }}>
              <InputBase
                type="text"
                placeholder="Search cards..."
                value={searchInput}
                onChange={event => setSearchInput(event.target.value)}
                onKeyDown={handleKeyDown}
                startAdornment={
                  <InputAdornment position="start" sx={{ color: "inherit" }}>
                    <Search />
                  </InputAdornment>
                }
                sx={{
                  "width": "100%",
                  "px": theme.spacing(1),
                  "borderRadius": 1,
                  "backgroundColor": alpha(theme.palette.background.paper, 0.15),
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.background.paper, 0.25)
                  },
                  "color": "inherit"
                }}
              />
            </Box>
            <Box flexGrow={1} />
            <Badge color="warning" badgeContent={count} overlap="circular">
              <IconButton
                color="inherit"
                onClick={() => {
                  router.push("/cart");
                }}>
                <ShoppingCart />
              </IconButton>
            </Badge>
            {session ? (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton
                    onClick={event => setAnchorElUser(event.currentTarget)}
                    sx={{ p: 0 }}
                    aria-haspopup="true"
                    size="large"
                    color="inherit">
                    <Avatar alt="user image" src={session?.user?.avatar} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}>
                  {profileItems.map(item => {
                    return (
                      item.show && (
                        <MenuItem
                          key={item.displayName}
                          onClick={() => {
                            item.onClick(), handleCloseUserMenu();
                          }}>
                          <Typography textAlign="center">{item.displayName}</Typography>
                        </MenuItem>
                      )
                    );
                  })}
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      logout(), handleCloseUserMenu();
                    }}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button id="cards-button" color="inherit" onClick={() => router.push("/signin")} variant="outlined">
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
