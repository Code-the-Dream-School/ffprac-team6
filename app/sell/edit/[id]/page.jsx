"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchCardData, editCardData } from "@/utils/fetchData";
import { Alert, Box, Snackbar } from "@mui/material";
import CardForm from "@/components/CardForm";

/**
 *
 * @param {*} params
 */

export default function Page({ params }) {
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState(null);
  const router = useRouter();
  const id = params.id;

  //get card data
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const cardData = await fetchCardData(id);
          setData(cardData);
        } catch (error) {
          console.error;
          setOpenError(true);
          setErrorMessage(error.message || "unknown error");
        }
      };
      fetchData();
    }
  }, [id]);

  //edit card
  const editCard = async editProperty => {
    const editCard = {
      ...data,
      ...editProperty
    };
    try {
      await editCardData(id, editCard);
      router.push(`/market/item/${id}`);
    } catch (error) {
      console.log(error.message);
      console.error(error);
      setOpenError(true);
      setErrorMessage(error.message || "unknown error");
    }
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };

  return (
    <Box>
      {data && <CardForm cardValue={data} onSubmitForm={editCard} />}
      <Snackbar
        open={openError}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
