import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemButton,
  CardHeader,
  Box,
  LinearProgress,
  CardMedia,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { createAPIEndpoint, ENDPOINTS, BASE_URL } from "../api";
import { getFormatedTime } from "../helper";
import useStateContext from "../hooks/useStateContext";
import {useNavigate} from 'react-router'

export default function Quiz() {
  const [qns, setQns] = React.useState([]);
  const [qnIndex, setQnIndex] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const { context, setContext, resetContext } = useStateContext();

  let timer;

  const startTimer = () => {
    timer = setInterval(() => {
      setTimeTaken((prev) => prev + 1);
    }, [1000]);
  };

  useEffect(() => {
    setContext({
      timeTaken: 0,
      selectedOptions: [],
    });
  });

  const navigate = useNavigate();
  const updateAnswer = (qnId, optionIdx) => {
    const temp = [...context.selectedOptions];
    temp.push({
      qnId,
      selected: optionIdx,
    });

    if (qnIndex < 4) {
      setContext({ selectedOptions: [...temp] });
      setQnIndex(qnIndex + 1);
    } else {
      setContext({ selectedOptions: [...temp], timeTaken });
      navigate('/result')
    }
  };

  useEffect(() => {
    createAPIEndpoint(ENDPOINTS.question)
      .fetch()
      .then((res) => {
        setQns(res.data);
        startTimer();
      })
      .catch((err) => console.log(err));
    return () => {
      clearInterval(timer);
    };
  }, []);

  return qns.length !== 0 ? (
    <Card
      sx={{
        maxWidth: 640,
        mx: "auto",
        mt: 5,
        "& . MultiCardHeader-action": { m: 0, alignSelf: "center" },
      }}
    >
      <CardHeader
        title={"Question" + (qnIndex + 1) + "of 5"}
        action={<Typography>{getFormatedTime(timeTaken)}</Typography>}
      />
      <Box>
        {qns[qnIndex].imageName != null ? (
          <CardMedia
            component="img"
            image={BASE_URL + "images/" + qns[qnIndex].imageName}
            sx={{ width: "100%", m: "2px auto" }}
          />
        ) : null}
        <LinearProgress
          variant="determinate"
          value={((qnIndex + 1) * 100) / 5}
        />
      </Box>
      <CardContent>
        <Typography variant="h6">{qns[qnIndex].qinWords}</Typography>
        <List>
          {qns[qnIndex].options.map((item, idx) => (
            <ListItemButton
              key={idx}
              onClick={() => updateAnswer(qns[qnIndex].qnId, idx)}
            >
              <div>
                <b>{String.fromCharCode(65 + idx) + " . "}</b>
                {item}
              </div>
            </ListItemButton>
          ))}
        </List>
      </CardContent>
    </Card>
  ) : null;
}
