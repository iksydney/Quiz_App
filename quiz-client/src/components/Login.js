import axios from "axios";
import useStateContext from "../hooks/useStateContext";
import {
  Button,
  TextField,
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import Center from "./Center";
import useForm from "../hooks/useForm";
import { createAPIEndpoint, ENDPOINTS } from "../api";

const getFreshModel = () => ({
  name: "",
  email: "",
});

export default function Login() {
  const { context, setContext } = useStateContext();
  const { values, setValues, errors, setErrors, handleInputChange } =
    useForm(getFreshModel);

  const login = (e) => {
    e.preventDefault();
    if (validate())
      createAPIEndpoint(ENDPOINTS.participant)
        .post(values)
        .then((res) => {
          setContext({ participantId: res.data.participantId });
          console.log(context);
        })
        .catch((err) => console.log(err));
  };

  const validate = () => {
    let temp = {};
    temp.email = /\S+@\S+\.\S+/.test(values.email) ? "" : "Email is not valid";
    temp.name = values.name !== "" ? "" : "This field is required";
    setErrors(temp);
    return Object.values(temp).every((x) => x === "");
  };

  return (
    <Center>
      {context.participantId}
      <Card sx={{ width: 450 }}>
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="h3" sx={{ my: 3 }}>
            Quiz
          </Typography>
          <Box
            sx={{
              "& .MuiTextField-root": {
                m: 1,
                width: "90%",
              },
            }}
          >
            <form
              noValidate
              autoComplete="off"
              onSubmit={login}
              encType="application/x-www-form-urlencoded"
            >
              <TextField
                label="Email"
                name="email"
                value={values.email}
                onChange={handleInputChange}
                variant="outlined"
                id="email-address"
                autoComplete=""
                {...(errors.email && { error: true, helperText: errors.email })}
              />

              <TextField
                label="Name"
                name="name"
                value={values.name}
                onChange={handleInputChange}
                variant="outlined"
                id="name-value"
                {...(errors.name && { error: true, helperText: errors.name })}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ width: "90%" }}
              >
                Start
              </Button>
            </form>
          </Box>
        </CardContent>
      </Card>
    </Center>
  );
}
