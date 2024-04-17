"use client";
import { React, useState, useEffect, useRef } from "react";
import { useSession, getSession } from "next-auth/react";

import { useTheme } from "@mui/material/styles";
import { Typography, Grid, Backdrop, CircularProgress, Snackbar, Alert } from "@mui/material";

import useAuthUser from "@/store/useAuthUser";
import useImageUpload from "@/hooks/useImageUpload";
import { trimAndValidate } from "@/utils/helpers";
import AvatarSection from "./AvatarSection";
import FormSection from "./FormSection";

export default function UserProfileEditPage() {
  const theme = useTheme();
  const updateProfile = useAuthUser(state => state.updateProfile);
  const { handleImageUpload, error: errorAvatarUpload } = useImageUpload();
  const [selectedFile, setSelectedFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isEditAvatar, setIsEditAvatar] = useState(false);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);
  const { data: session, update: updateSession, status } = useSession();
  console.log("session", session);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    address: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = await getSession();
        if (session && status === "authenticated") {
          setUserData({
            name: session?.user?.name,
            email: session?.user?.email,
            address: session?.user?.address
          });
          setAvatarPreview(session?.user?.avatar);
        }
      } catch (error) {
        console.error(error);
        setOpenError(true);
        setErrorMessage(error.toString() || "unknown error");
      }
    };
    fetchData();
  }, [status, session]);

  //console.log(userData);
  useEffect(() => {
    if (!selectedFile) {
      setAvatarPreview("");
      return;
    }
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      setAvatarPreview(fileReader.result);
    };
    fileReader.readAsDataURL(selectedFile);
  }, [selectedFile]);

  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setIsEditAvatar(true);
    }
  };

  const submitAvatar = async () => {
    try {
      setLoading(true);
      if (selectedFile) {
        await handleImageUpload(selectedFile, async imageURL => {
          setAvatarPreview(imageURL);

          await updateSession({
            ...session,
            user: { ...session.user, avatar: imageURL }
          });

          const userDataWithAvatar = { ...session.user, avatar: imageURL, type: "profile" };
          await updateProfile(userDataWithAvatar);
          setIsEditAvatar(false);
        });
      } else {
        setIsEditAvatar(false);
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;

    const { value: trimmedValue, error: newError } = trimAndValidate(name, value);
    setUserData(prevUserData => ({ ...prevUserData, [name]: trimmedValue }));

    setError(prevError => ({ ...prevError, [`${name}Error`]: newError }));
  };

  const handleValidation = () => {
    let isValid = true;
    const formErrors = {};

    const { value: trimmedName, error: nameError } = trimAndValidate("name", userData.name);
    if (nameError) {
      formErrors.nameError = nameError;
      isValid = false;
    }

    const { value: trimmedEmail, error: emailError } = trimAndValidate("email", userData.email);
    if (emailError) {
      formErrors.emailError = emailError;
      isValid = false;
    }

    const { value: trimmedAddress, error: addressError } = trimAndValidate("address", userData.address);
    if (addressError) {
      formErrors.addressError = addressError;
      isValid = false;
    }
    setError(formErrors);
    return isValid;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const isValid = handleValidation();
    if (!isValid) return;
    try {
      await updateSession({
        ...session,
        user: { ...session.user, ...userData }
      });
      userData.type = "profile";
      await updateProfile(userData);
      setIsEditing(prevState => !prevState);
    } catch (error) {
      setIsEditing(false);
    }
  };

  if (!session) {
    return null;
  }
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };
  return (
    <>
      <Grid
        container
        spacing={7}
        sx={{
          mx: "auto",
          my: 5,
          width: "calc(100% - 10em)"
        }}>
        <Grid item xs={12} md={6} lg={3}>
          <AvatarSection
            avatarPreview={avatarPreview}
            handleAvatarChange={handleAvatarChange}
            isEditAvatar={isEditAvatar}
            fileInputRef={fileInputRef}
            submitAvatar={submitAvatar}
            theme={theme}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={9}>
          <Typography
            variant="h2"
            color="primary"
            gutterBottom
            sx={{
              flexGrow: 0,
              p: 0,
              textAlign: "left"
            }}>
            Update Your Profile
          </Typography>
          <FormSection
            handleChange={handleChange}
            userData={userData}
            isEditing={isEditing}
            handleSubmit={handleSubmit}
            error={error}
            theme={theme}
            isSeller={session.user.isSeller}
          />
        </Grid>
      </Grid>
      {errorAvatarUpload && (
        <Typography color="error" style={{ marginBottom: "10px" }}>
          {errorAvatarUpload}
        </Typography>
      )}
      <Backdrop
        sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1, backdropFilter: "blur(2px)" }}
        open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={openError}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
