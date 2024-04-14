"use client";
import  { useRouter } from "next/navigation"
import { Avatar, Paper, Button } from "@mui/material";

export default function AvatarSection({
  avatarPreview,
  handleAvatarChange,
  fileInputRef,
  isEditAvatar,
  submitAvatar,
  theme
}) {
  const router = useRouter();
  return (
    <Paper
      sx={{
        p: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
      <Avatar src={avatarPreview} sx={{ width: 180, height: 180 }} />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarChange}
        name="image"
        style={{ display: "none" }}
        accept="image/png, image/jpeg, image/jpg"
      />
      {isEditAvatar ? (
        <Button
          fullWidth
          onClick={submitAvatar}
          type="submit"
          variant="contained"
          color="primary"
          component="span"
          sx={{
            letterSpacing: "0.1em",
            mt: 3
          }}>
          Save Photo
        </Button>
      ) : (
        <Button
          fullWidth
          type="button"
          onClick={() => fileInputRef.current.click()}
          variant="contained"
          color="primary"
          sx={{
            letterSpacing: "0.1em",
            mt: 3
          }}
          component="span">
          Edit Photo
        </Button>
      )}
      <Button
        fullWidth
        type="button"
        onClick={() => router.push("/sell/add")}
        variant="contained"
        color="accent"
        sx={{
          letterSpacing: "0.1em",
          mt: 2,
          "&:hover": {
            backgroundColor: theme.palette.accent.main
          }
        }}>
        Add Card to Sell
      </Button>
    </Paper>
  );
}
