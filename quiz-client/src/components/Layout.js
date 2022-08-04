import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Container } from "@mui/system";
import React from "react";
import { Outlet, useNavigate } from "react-router";
import useStateContext from "../hooks/useStateContext";

export default function Layout() {
  const { resetContext } = useStateContext();
  const navigate = useNavigate();
  const logout = () => {
    resetContext();
    navigate("/");
  };
  return (
    <>
      <AppBar position="sticky">
        <Toolbar sx={{ width: 500, m: "auto" }}>
          <Typography variant="h4" align="center" sx={{flexGrow: 1}}>
            Quiz App
          </Typography>
          <Button onClick={logout}>logout</Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Outlet />
      </Container>
    </>
  );
}
