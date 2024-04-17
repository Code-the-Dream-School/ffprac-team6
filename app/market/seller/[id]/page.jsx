"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchSellerCards } from "@/utils/fetchData";
import { fetchSellerData } from "@/utils/fetchData";
import Filter from "@/components/Filter";
import CardComponent from "@/components/CardComponent";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Drawer,
  Grid,
  IconButton,
  Paper,
  Pagination,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  Typography
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";

/**
 *
 * @param {*} params
 */

export default function Seller({ params }) {
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState("cards"); //for tabs
  const [cards, setCards] = useState([]); //for cards
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCards, setTotalCards] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [user, setUser] = useState({}); //for seller data
  const [seller, setSeller] = useState({}); //for seller data

  const showButtons = false;
  const searchParams = useSearchParams();
  const filters = {
    conditions: searchParams.get("conditions") || "",
    priceFrom: searchParams.get("priceFrom") || "",
    priceTo: searchParams.get("priceTo") || "",
    category: searchParams.get("category") || "",
    availability: searchParams.get("availability") || "",
    search: searchParams.get("search") || ""
  };

  //for now fot testing, later it will be a seller id
  const sellerId = params.id;
  let dateValue;

  useEffect(() => {
    if (sellerId) {
      const fetchData = async () => {
        try {
          const sellerData = await fetchSellerData(sellerId);
          console.log("sellerData", sellerData);
          setUser(sellerData.user);
          setSeller(sellerData.seller);
        } catch (error) {
          console.error(error);
          setOpenError(true);
          setErrorMessage(error.toString() || "unknown error");
        }
      };
      fetchData();
    }
  }, [sellerId]);

  useEffect(() => {
    if (sellerId) {
      const fetchData = async () => {
        try {
          const limit = 6;
          const page = filters.search && currentPage !== 1 ? 1 : currentPage;
          const data = await fetchSellerCards(sellerId, filters, page, limit);
          setCards(data.cards);
          setTotalCards(data.total);
        } catch (error) {
          console.error;
          setOpenError(true);
          setErrorMessage(error.toString() || "unknown error");
        }
      };
      fetchData();
    }
  }, [
    sellerId,
    filters.search,
    filters.conditions,
    filters.category,
    filters.priceFrom,
    filters.priceTo,
    currentPage,
    filters.availability
  ]);

  //create a date object from the seller's isRequestedAt
  if (seller.isRequestedAt) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    const year = new Date(seller.isRequestedAt).getFullYear();
    const monthNumber = new Date(seller.isRequestedAt).getMonth();
    const month = monthNames[monthNumber];
    const day = new Date(seller.isRequestedAt).getDate();
    dateValue = `${month}, ${day} ${year}`;
  }
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };
  return (
    <Container maxWidth="lg">
      <Box display="flex" flexDirection="column" mt={5} mb={5} gap={2}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            backgroundColor: "background.default",
            justifyContent: "center",
            alignItems: { xs: "center", sm: "flex-start" },
            height: 150,
            px: 2,
            borderRadius: 1
          }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 1, sm: 5 },
              justifyContent: "center",
              alignItems: "center"
            }}>
            <Box>
              <Avatar alt="seller image" src={user?.imageProfileURL} sx={{ width: 100, height: 100 }} />
            </Box>
            <Box gap={2} display="flex" flexDirection="column">
              <Box flexGrow={1}>
                <Typography variant="h2">{user.name}</Typography>
              </Box>
              <Box display="flex" gap={2}>
                <Typography variant="body2">Rating: {seller?.rating}</Typography>
                <Typography variant="body2">Sales: {seller?.numberOfSales}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box width="100%" my={5}>
        <Tabs
          value={activeTab}
          onChange={(event, newValue) => {
            setActiveTab(newValue);
          }}
          aria-label="handle seller info">
          <Tab label="Cards" value="cards" />
          <Tab label="About" value="about" />
          {/* <Tab label="Reviews" value="reviews" /> */}
        </Tabs>
      </Box>
      {activeTab === "cards" && (
        <Box>
          <Grid container spacing={2}>
            <Grid item sm={3}>
              <Box display="flex" sx={{ flexDirection: { xs: "column", sm: "row" } }}>
                <Box
                  display={{ xs: "block", sm: "none" }}
                  sx={{
                    m: 0.5,
                    position: "fixed",
                    top: 70,
                    left: 20
                  }}>
                  <FilterListIcon sx={{ fontSize: 40 }} onClick={() => setFilterOpen(true)} />
                </Box>
                {/* Filter Drawer shown on small screens */}
                <Drawer
                  sx={{
                    "& .MuiDrawer-paper": {
                      width: "100%",
                      maxWidth: "100%"
                    }
                  }}
                  open={filterOpen}
                  onClose={() => setFilterOpen(false)}
                  ModalProps={{ keepMounted: true }}>
                  <Box role="presentation">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        p: 1
                      }}>
                      <IconButton onClick={() => setFilterOpen(false)} aria-label="close">
                        <CloseIcon sx={{ fontSize: "40px" }} />
                      </IconButton>
                    </Box>
                    <Filter filtersParams={filters} sellerPage={true} sellerId={sellerId} />
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => {
                        setFilterOpen(false);
                      }}>
                      Apply Filters
                    </Button>
                    <Typography variant="subtitle1" align="center" sx={{ width: "100%", mt: 2 }}>
                      {`${totalCards} result${totalCards !== 1 ? "s" : ""} found`}
                    </Typography>
                  </Box>
                </Drawer>
                {/* Filter Box shown on larger screens */}
                <Box
                  sx={{
                    display: { xs: "none", sm: "block" },
                    flex: 2,
                    border: 1,
                    borderColor: "grey.300",
                    borderRadius: 2,
                    p: 1,
                    boxShadow: 3
                  }}>
                  <Filter filtersParams={filters} sellerPage={true} sellerId={sellerId} />
                </Box>
              </Box>
            </Grid>
            <Grid item xs>
              {cards.length > 0 ? (
                <Grid container spacing={2}>
                  {cards.map(card => (
                    <Grid item key={card._id} xs={12} md={4} sx={{ display: "flex", justifyContent: "center" }}>
                      <CardComponent key={card._id} card={card} showButtons={showButtons} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="h6" align="center" sx={{ width: "100%" }}>
                  No matches found.
                </Typography>
              )}
            </Grid>
          </Grid>
          <Stack spacing={2} alignItems="center">
            <Pagination
              count={Math.ceil(totalCards / 6)}
              page={currentPage}
              onChange={(event, page) => setCurrentPage(page)}
              shape="rounded"
            />
          </Stack>
        </Box>
      )}
      {activeTab === "about" && (
        <Grid container spacing={2}>
          <Grid item xs></Grid>
          <Grid item xs={8}>
            <Paper elevation={3} sx={{ px: 2, py: 5 }}>
              <Box display="flex" gap={1} my={2}>
                <Typography variant="h4">Location:</Typography>
                <Typography variant="body1">{user?.address || ""}</Typography>
              </Box>
              <Box display="flex" gap={1} my={2}>
                <Typography variant="h4">Seller since:</Typography>
                <Typography variant="body1">{dateValue || ""}</Typography>
              </Box>
              {/* <Box display="flex" gap={1} my={2}>
                <Typography variant="h4">Other:</Typography>
                <Typography variant="body1">{seller?.other || ""}</Typography>
              </Box> */}
            </Paper>
          </Grid>
          <Grid item xs></Grid>
        </Grid>
      )}
      {/* {activeTab === "reviews" &&
        seller.feedback.map((feedback, index) => (
          <Paper key={index} sx={{ p: 2, my: 1 }}>
            <Typography variant="body1">{feedback}</Typography>
          </Paper>
        ))} */}
      <Snackbar
        open={openError}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
