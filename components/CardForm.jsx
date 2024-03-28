import { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  InputLabel,
  FormControl,
  TextField,
  MenuItem,
  Select,
  Typography,
  Paper,
  Grid,
  Container
} from "@mui/material";
import { Image } from "@mui/icons-material";

/**
 *
 * @param {cardValue} Object
 * @param {onSubmitForm} Function
 */

export default function CardForm({ cardValue, onSubmitForm }) {
  const [cardCategory, setCardCategory] = useState(cardValue?.category);
  const [image, setImage] = useState(cardValue?.imageURL || "");
  const [imageURL, setImageURL] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const { imageURL } = cardValue;
    if (imageURL) {
      setImageURL(imageURL);
    }
  }, [cardValue]);

  const editCard = cardValue.name ? true : false;
  const conditionVariants = cardCategory => {
    if (cardCategory === "Sport Card") {
      return ["near mint", "excellent", "very good", "poor"];
    } else {
      return ["near mint", "lightly played", "moderately played", "heavily played", "damaged"];
    }
  };
  async function handleImageUpload(file) {
    try {
      const res = await fetch('/api/cloudinary-signature');

      if (!res.ok) throw new Error("Failed to fetch the Cloudinary signature.");

      const { signature, timestamp, api_key } = await res.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", api_key);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`;
      const uploadRes = await fetch(uploadUrl, {
        method: "POST",
        body: formData
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) throw new Error(uploadData.error?.message || "Upload to Cloudinary failed.");
      let imageURL = uploadData.secure_url;
      return imageURL;
    } catch (error) {
      setError("Failed to upload the image. Please try again.");
      return "";
    }
  }

  const handleFileChange = async event => {
    const file = event.target.files[0];
    if (file) {
      const uploadedimageURL = await handleImageUpload(file);
      if (uploadedimageURL) {
        setImage(URL.createObjectURL(file));
        setImageURL(uploadedimageURL);
      } else {
        setError("Failed to upload the image for preview");
      }
    }
  };

  const handlePaperClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    const { 
      cardName, set, price, currency, shippingCost, 
      description, conditions, quantity, available 
    } = e.target.elements;
  
    const finalImageUrl = imageURL || `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload/v1711381226/vr2hc3udhtc8z9u1hrp4.png`;
    
    const formData = {
      name: cardName.value,
      set: set.value,
      price: price.value,
      currency: currency.value,
      shippingCost: shippingCost.value,
      description: description.value,
      conditions: conditions.value,
      quantity: quantity.value,
      available: available.value,
      category: cardCategory,
      imageURL: finalImageUrl
    };
  
    await onSubmitForm(formData);
  };

  return (
    <Container>
      <Box
        component="form"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        margin={2}
        gap={2}
        onSubmit={e => {
          e.preventDefault();
          handleSubmit(e);
        }}>
        <Typography textAlign="center" variant="h4">
          {editCard ? "Edit" : "Add"} card
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={6} md={4}>
            <Box display="flex" flexDirection="column" gap={2}>
              <Paper
                onClick={handlePaperClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                  position: "relative",
                  aspectRatio: "3/4",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  cursor: "pointer"
                }}
                sx={{ overflow: "hidden" }}>
                {image || cardValue.imageURL ? (
                  <img
                    src={image}
                    alt="Preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute" }}
                  />
                ) : (
                  <>
                    <Image fontSize="large" color="secondary" />
                    <Typography sx={theme => ({ color: theme.palette.text.secondary })}>
                      Click to upload an image
                    </Typography>
                  </>
                )}
                {isHovered && (image || cardValue.imageURL) && (
                  <Box
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "rgba(0, 0, 0, 0.5)"
                    }}>
                    <Typography variant="body1" style={{ color: "#fff", textAlign: "center" }}>
                      Click to upload a new image
                    </Typography>
                  </Box>
                )}
                {error && (
                  <Typography color="error" style={{ marginBottom: "10px" }}>
                    {error}
                  </Typography>
                )}
              </Paper>
              <input
                ref={fileInputRef}
                type="file"
                name="image"
                accept="image/png, image/jpeg, image/jpg"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </Box>
          </Grid>
          <Grid item xs>
            <Box display="flex" flexDirection="column" gap={2}>
              <FormControl required fullWidth size="small">
                <InputLabel id="cardCategory">category</InputLabel>
                <Select
                  fullWidth
                  name="category"
                  labelId="cardCategory"
                  id="category"
                  label="category"
                  value={cardCategory}
                  onChange={e => {
                    setCardCategory(e.target.value);
                  }}>
                  <MenuItem value="Magic">Magic</MenuItem>
                  <MenuItem value="Pokemon">Pokemon</MenuItem>
                  <MenuItem value="Digimon">Digimon</MenuItem>
                  <MenuItem value="Yu-Gi-Oh!">Yu-Gi-Oh!</MenuItem>
                  <MenuItem value="Sport Card">Sport Card</MenuItem>
                </Select>
              </FormControl>
              <TextField required fullWidth name="cardName" label="name" defaultValue={cardValue?.name} />
              <TextField fullWidth name="set" label="set" defaultValue={cardValue?.set} />
              <Box display="flex" gap={2} sx={{ flexDirection: { xs: "column", md: "row" } }}>
                <TextField
                  required
                  fullWidth
                  name="price"
                  type="number"
                  inputProps={{
                    step: 0.01,
                    min: "0"
                  }}
                  label="price"
                  defaultValue={cardValue?.price}
                />
                <FormControl required fullWidth size="small">
                  <InputLabel id="cardCurrency">currency</InputLabel>
                  <Select
                    fullWidth
                    name="currency"
                    labelId="cardCurrency"
                    id="currency"
                    label="currency"
                    defaultValue={cardValue?.currency}>
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="CAD">CAD</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  required
                  fullWidth
                  name="shippingCost"
                  type="number"
                  inputProps={{
                    step: 0.01,
                    min: "0"
                  }}
                  label="shipping cost"
                  defaultValue={cardValue?.shippingCost}
                />
              </Box>

              <TextField
                fullWidth
                name="description"
                multiline
                rows={3}
                defaultValue={cardValue?.description}
                label="description"
              />
              <FormControl required fullWidth size="small">
                <InputLabel id="conditions">condition</InputLabel>
                <Select
                  fullWidth
                  name="conditions"
                  labelId="conditions"
                  id="conditions"
                  label="conditions"
                  defaultValue={cardValue?.conditions}>
                  {conditionVariants(cardCategory).map((condition, index) => (
                    <MenuItem key={index} value={condition}>
                      {condition}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box display="flex" gap={2} sx={{ flexDirection: { xs: "column", md: "row" } }}>
                <TextField
                  required
                  fullWidth
                  name="quantity"
                  type="number"
                  label="quantity"
                  defaultValue={cardValue?.quantity}
                />
                <FormControl required fullWidth size="small">
                  <InputLabel id="availableCard">available</InputLabel>
                  <Select
                    fullWidth
                    name="available"
                    labelId="availableCard"
                    id="available"
                    label="available"
                    defaultValue={cardValue?.available}>
                    <MenuItem value="available">available</MenuItem>
                    <MenuItem value="sold">sold</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Button variant="contained" color="secondary" type="submit">
                {editCard ? "Edit" : "Add"} card
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
