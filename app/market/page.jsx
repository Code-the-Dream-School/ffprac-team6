"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Grid, Box, Snackbar, Alert, Typography, IconButton, Drawer, Button } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
import { fetchAllCardsData } from "@/utils/fetchData";
import CardComponent from "../../components/CardComponent";
import Filter from "../../components/Filter";

export default function Market() {
  const [cards, setCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCards, setTotalCards] = useState(0);
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const searchParams = useSearchParams();
  const filters = {
    conditions: searchParams.get("conditions") || "",
    priceFrom: searchParams.get("priceFrom") || "",
    priceTo: searchParams.get("priceTo") || "",
    category: searchParams.get("category") || "",
    availability: searchParams.get("availability") || "",
    search: searchParams.get("search") || ""
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const limit = 6;
        const page = filters.search && currentPage !== 1 ? 1 : currentPage;
        const data = await fetchAllCardsData(filters.search, filters, page, limit);
        setCards(data.cards);
        setTotalCards(data.total);
      } catch (error) {
        console.error;
        setOpenError(true);
        setErrorMessage(error.toString() || "unknown error");
      }
    };

    fetchData();
  }, [
    filters.search,
    filters.conditions,
    filters.category,
    filters.priceFrom,
    filters.priceTo,
    currentPage,
    filters.availability
  ]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };

  return (
    <>
      <Grid container sx={{ height: "100vh", p: 0, m: 3, flexDirection: { xs: "column", sm: "row" } }} spacing={3}>
        <Grid
          item
          xs={12}
          sm={5}
          md={4}
          lg={3}
          // sx={{ paddingTop: 0 }}
          // sx={{ border: 1, borderColor: "gray.300", borderRadius: 2, p: 2, boxShadow: 3 }}
        >
          <Box
            display={{ xs: "block", sm: "none" }}
            sx={{
              m: 0.5,
              position: "fixed",
              top: 70,
              left: 20,
              border: 1,
              borderColor: "gray.300",
              borderRadius: 2,
              p: 2,
              boxShadow: 3
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
              <Filter filtersParams={filters} />
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
            <Filter filtersParams={filters} />
          </Box>
        </Grid>
        <Grid item xs={12} sm={7} md={8} lg={9} sx={{ paddingInline: 5, flex: 8, width: "100%" }}>
          {cards.length > 0 ? (
            <Grid container spacing={3} sx={{ paddingTop: 0 }}>
              {cards.map(card => (
                <Grid item xs={12} sm={6} md={4} lg={4} key={card._id} align="center" sx={{ p: 1 }}>
                  <CardComponent card={card} />
                </Grid>
              ))}

              <Grid item xs={12} sx={{ textAlign: "center", bottom: 0, left: "50%" }}>
                <Grid container justifyContent="center" alignItems="flex-end">
                  {/* <Stack spacing={2} alignItems="center"> */}
                  <Pagination
                    count={Math.ceil(totalCards / 6)}
                    page={currentPage}
                    onChange={(event, page) => setCurrentPage(page)}
                    shape="rounded"
                  />
                  {/* </Stack> */}
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Typography variant="h6" align="center" sx={{ width: "100%" }}>
              No matches found.
            </Typography>
          )}
        </Grid>

        <Snackbar
          open={openError}
          autoHideDuration={5000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}>
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            {errorMessage}
          </Alert>
        </Snackbar>
      </Grid>
    </>
  );
}
