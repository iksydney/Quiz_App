import useStateContext from "../hooks/useStateContext";
import { createAPIEndpoint, ENDPOINTS, BASE_URL } from "../api";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { getFormatedTime } from "../helper";
import { useNavigate } from "react-router";

export default function Result() {
  const { context, setContext } = useStateContext();
  const [score, setScore] = useState(0);
  const [qnAnswers, setQnAnswers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const ids = context.selectedOptions.map((x) => x.qnId);
    console.log(ids);
    createAPIEndpoint(ENDPOINTS.getAnswers)
      .post(ids)
      .then((res) => {
        //console.log(res.data);
        const qna = context.selectedOptions.map((x) => ({
          ...x,
          ...res.data.find((y) => y.qnId === x.qnId),
        }));
        setQnAnswers(qna);
        calculateScore(qna);
      })
      .catch((err) => console.log(err));
  }, []);
  const restart = () => {
    setContext({
      timeTaken: 0,
      selectedOptions: [],
    });
    navigate("/quiz");
  };

  const submitScore = () => {
    createAPIEndpoint(ENDPOINTS.participant)
      .put(context.participantId, {
        participantId: context.participantId,
        score: score,
        timeTaken: context.timeTaken,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const calculateScore = (qna) => {
    let tempScore = qna.reduce((acc, curr) => {
      return curr.answer === curr.selected ? acc + 1 : acc;
    }, 0);
    setScore(tempScore);
  };
  return (
    <Card
      sx={{ mt: 5, display: "flex", width: "100%", maxwidth: 640, mx: "auto" }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <CardContent sx={{ flex: "1 auto", textAlign: "center" }}>
          <Typography variant="h4">Congratulations</Typography>
          <Typography variant="h6">
            YOUR SCORE
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {score}/5
            </Typography>
          </Typography>
          <Typography variant="h6">
            Took {getFormatedTime(context.timeTaken) + " mins "}
          </Typography>
          <Button
            variant="contained"
            sx={{ mx: 1 }}
            size="small"
            onClick={submitScore}
          >
            Submit
          </Button>
          <Alert
            severity="success"
            variant="string"
            sx={{ width: "60%", m: "auto" }}
          >
            Score Updated.
          </Alert>
          <Button
            variant="contained"
            sx={{ mx: 1 }}
            size="small"
            onClick={restart}
          >
            Re-try
          </Button>
        </CardContent>
      </Box>
      <CardMedia component="img" sx={{ width: 220 }} image="./result.png" />
    </Card>
  );
}
