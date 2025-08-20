import React from "react";
import { AppBar, Toolbar, Typography, Stack } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const DashHeader = () => {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#000000", 
        borderBottom: "1px solid #e5e7eb",
        height: 64,
        justifyContent: "center",
      }}
    >
      <Toolbar>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={1}
          sx={{ width: "100%" }}
        >
          <PersonIcon sx={{ color: "#fff" }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#fff",
              letterSpacing: 1,
            }}
          >
            DASHBOARD
          </Typography>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default DashHeader;