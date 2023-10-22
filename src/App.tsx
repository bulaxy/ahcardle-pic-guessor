import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { card, dataObjects } from "./data/dataObjects";
import {
  Button,
  Container,
  Dropdown,
  Form,
  Grid,
  Header,
  Icon,
  Image,
  Input,
  Message,
  Modal,
  Segment,
} from "semantic-ui-react";

const ZOOM_OUT_RATE: number= 1

function App() {
  const [answer, setAnswer] = useState<card>(
    dataObjects[Math.floor(Math.random() * dataObjects.length)]
  );
  const [sizeMultiplier, setSizeMultiplier] = useState<number>(10);
  const [attempt, setAttempt] = useState<string[]>([]);
  const [animation, setAnimation] = useState<string>("");
  const [win, setWin] = useState(false);
  const [value, setValue] = useState<string>();

  const initReset = () => {
    setAnimation("");
    setAttempt([]);
    setWin(false);
    setAnswer(dataObjects[Math.floor(Math.random() * dataObjects.length)]);
    setSizeMultiplier(8);
  };

  const updateAnswer = (o: string): void => {
    setValue(o);
  };

  const attemptAnswer = (): void => {
    console.log(value, attempt);
    if (value && !attempt.includes(value)) {
      setAttempt([value, ...attempt]);
    }
  };

  useEffect(() => {
    if (attempt.length) {
      if (answer.id === attempt[0]) {
        setWin(true);
      } else {
        setAnimation("shakeAnimation");
        setTimeout(() => {
          setAnimation("");
          setValue("");
        }, 300);
        if (sizeMultiplier > 2) {
          setSizeMultiplier((prev) => prev - ZOOM_OUT_RATE);
        }
      }
    }
  }, [attempt]);

  useEffect(() => {
    if (win) {
      setAnimation("initWin");
    }
  }, [win]);

  return (
    <div className="App">
      <h1>
        AHCardle - Pic Guessor
        <Modal
          trigger={<Icon name="question circle outline" />}
          header="AH Cardle Pic Guessor"
          content={
            <Container fluid>
              <p>Test your Arkham card pool knowledge skills!</p>
              <p>
                Look at the picture, to guess the card, wrong guess, the pic will zoom out a little bit (until a maximum)
              </p>
            </Container>
          }
          actions={[{ key: "Close", content: "Close" }]}
        />
      </h1>
      <Grid textAlign="center" verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Segment
            stacked
            style={{
              overflow: "hidden",
              margin: "auto",
              border: 0,
            }}
            className="segment"
          >
            <img
              src={`https://arkhamdb.com/${answer?.imagesrc}`}
              style={{
                margin: `${sizeMultiplier * -5}rem ${sizeMultiplier * -12}rem`,
                height: `${sizeMultiplier * 42}rem`,
                width: `${sizeMultiplier * 30}rem`,
              }}
            />
          </Segment>
          <Form size="large">
            {win ? (
              <Button onClick={() => initReset()} content="Play again!" />
            ) : (
              <div className={`searchBar ${animation}`}>
                <Dropdown
                  placeholder="Type card name..."
                  search
                  selection
                  fluid
                  value={value}
                  onChange={(_, o) => updateAnswer(o.value as string)}
                  options={dataObjects
                    .map((o) => ({
                      key: o.id,
                      value: o.id,
                      text: o.name,
                    }))
                    .filter((o) => !attempt.includes(o.value))}
                  className={animation}
                />
                <button onClick={attemptAnswer}>➤</button>
              </div>
            )}
            {attempt.map((id: string, index) => (
              <Message
                key={`message-id-${id}`}
                negative={!(win && index === 0)}
                positive={win && index === 0}
                header={dataObjects.find((card: card) => card.id === id)?.name}
              />
            ))}
          </Form>
        </Grid.Column>
      </Grid>
    </div>
  );
}

export default App;
