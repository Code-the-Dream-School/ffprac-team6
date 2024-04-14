"use client";
import { Box, Button, Paper, TextField } from "@mui/material";

export default function FormSection({ handleChange, userData, isEditing, handleSubmit, error, theme, isSeller }) {
  return (
    <Paper
      padding={2}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        sx={{
          mt: 5,
          p: 2,
          width: "80%"
        }}>
        <TextField
          onChange={handleChange}
          name="name"
          label="Nickname"
          value={userData.name}
          sx={{ mb: 2 }} //margin bottom
          disabled={!isEditing}
          required
          error={Boolean(error.nameError)}
          helperText={error.nameError}
        />
        <TextField
          label="Email"
          name="email"
          value={userData.email}
          sx={{ mb: 2 }}
          disabled={!isEditing}
          onChange={handleChange}
          required
          error={Boolean(error.emailError)}
          helperText={error.emailError}
        />
        {isSeller && (
          <TextField
            label="Location"
            name="address"
            placeholder="e.g., Canada, Toronto"
            value={userData.address}
            sx={{ mb: 2 }}
            disabled={!isEditing}
            onChange={handleChange}
            required
            error={Boolean(error.addressError)}
            helperText={error.addressError}
          />
        )}

        <Box display="flex" justifyContent="space-between" width="100%" mt={2}>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            onClick={handleSubmit}
            disabled={
              isEditing &&
              (Boolean(error.nameError) || Boolean(error.emailError) || Boolean(error.addressError) || !userData.name.trim() || !userData.email.trim() || !userData.address.trim())
            }
            sx={{
              "mt": 2,
              "width": "40%",
              "letterSpacing": "0.1em",
              "&:hover": {
                backgroundColor: theme.palette.accent.main
              }
            }}>
            {isEditing ? "Save" : "Edit"}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              "mt": 2, // Add a top margin
              "width": "40%", // Make the button full width
              "letterSpacing": "0.1em",
              "&:hover": {
                backgroundColor: theme.palette.accent.main
              }
            }}>
            Delete
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
