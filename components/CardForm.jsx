import { useState, useRef, useEffect } from "react";
import useImageUpload from "../hooks/useImageUpload";
import { theme } from "../styles/theme";
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
  Container,
  Backdrop,
  CircularProgress,
  useMediaQuery
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import Image from "next/image";

/**
 *
 * @param {object} props
 * @param {object} props.cardValue
 * @param {function} props.onSubmitForm
 */

export default function CardForm({ cardValue, onSubmitForm }) {
  const [cardCategory, setCardCategory] = useState(cardValue?.category);
  const { handleImageUpload, error } = useImageUpload();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(cardValue?.imageURL || "");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const { imageURL } = cardValue;
    if (imageURL) {
      setPreviewImage(imageURL);
    }
  }, [cardValue]);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewImage("");
      return;
    }
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      setPreviewImage(fileReader.result);
    };
    fileReader.readAsDataURL(selectedFile);
  }, [selectedFile]);

  const editCard = cardValue.name ? true : false;
  const conditionVariants = cardCategory => {
    if (cardCategory === "Sport Card") {
      return ["near mint", "excellent", "very good", "poor"];
    } else {
      return ["near mint", "lightly played", "moderately played", "heavily played", "damaged"];
    }
  };

  const handleFileChange = event => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handlePaperClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const { cardName, set, price, currency, shippingCost, description, conditions, quantity, available } =
      e.target.elements;

    const defaultImage = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload/v1711381226/vr2hc3udhtc8z9u1hrp4.png`;

    const submitFormData = imageURL => {
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
        imageURL: imageURL || cardValue?.imageURL || defaultImage
      };
      onSubmitForm(formData);
    };

    try {
      setLoading(true);
      if (selectedFile) {
        await handleImageUpload(selectedFile, submitFormData);
      } else {
        submitFormData(cardValue?.imageURL || defaultImage);
      }
    } catch {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const isXS = useMediaQuery(theme => theme.breakpoints.down("sm"));
  return (
    <Container maxWidth="md">
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
        <Typography textAlign="center" variant="h1">
          {editCard ? "Edit" : "Add"} card
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Box display="flex" flexDirection="column" gap={2} sx={{ px: isXS ? 10 : 0 }}>
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
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt="Preview"
                    fill={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={true}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <>
                    <ImageIcon alt="no image icon" fontSize="large" color="secondary" />
                    <Typography sx={theme => ({ color: theme.palette.text.secondary })}>
                      Click to upload an image
                    </Typography>
                  </>
                )}
                {isHovered && previewImage && (
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
                    defaultValue={cardValue?.currency || "USD"}>
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

              <Box display="flex" gap={2} sx={{ flexDirection: { xs: "column", md: "row" } }}>
                <FormControl required fullWidth size="small">
                  <InputLabel id="conditions">condition</InputLabel>
                  <Select
                    fullWidth
                    name="conditions"
                    labelId="conditions"
                    id="conditions"
                    label="conditions"
                    defaultValue={cardValue?.conditions || "near mint"}>
                    {conditionVariants(cardCategory).map((condition, index) => (
                      <MenuItem key={index} value={condition}>
                        {condition}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  required
                  fullWidth
                  name="quantity"
                  type="number"
                  label="quantity"
                  inputProps={{
                    min: "0"
                  }}
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
                    defaultValue={cardValue?.available || "available"}>
                    <MenuItem value="available">available</MenuItem>
                    <MenuItem value="sold">sold</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                sx={{
                  "&:hover": {
                    backgroundColor: theme.palette.accent.main
                  }
                }}>
                {editCard ? "Edit" : "Add"} card
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Backdrop
        sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1, backdropFilter: "blur(2px)" }}
        open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
}
