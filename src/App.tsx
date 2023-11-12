import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import {
  jsonfile,
  card,
  cardFilterFunction,
  dataTransform,
  packCodes,
  packs,
} from "./data/dataObjects";
import useLocalStorage from 'beautiful-react-hooks/useLocalStorage';
import {
  Button,
  Checkbox,
  Container,
  Divider,
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

interface setting {
  filteredPacks: string[];
}

const DEFAULT_FILTER = ["rcore", "fhvp"]

const ZOOM_OUT_RATE: number = 1;

function App() {
  const [dataObjects, setDataObjects] = useState<card[]>(
    dataTransform(jsonfile)
  );
  const [answer, setAnswer] = useState<card>(
    dataObjects[Math.floor(Math.random() * dataObjects.length)]
  );
  const [sizeMultiplier, setSizeMultiplier] = useState<number>(10);
  const [attempt, setAttempt] = useState<string[]>([]);
  const [animation, setAnimation] = useState<string>("");
  const [win, setWin] = useState(false);
  const [value, setValue] = useState<string>();
  const [ogToggle, setOgToggle] = useState<boolean>(true);
  const [tempAnswer, setTempAnswer] = useState<card | undefined>(undefined);
  const [setting, setSetting] = useLocalStorage<setting>('setting',{
    filteredPacks: DEFAULT_FILTER,
  });
  useEffect(() => {
    if(!setting) return
    let cards = jsonfile.filter((o: { pack_code: string }) =>
      !setting.filteredPacks.includes(o.pack_code)
    ).filter(cardFilterFunction);
    const transformedData = dataTransform(cards);
    setDataObjects(transformedData);    
    setAttempt([]);
    setWin(false);
    setAnswer(transformedData[Math.floor(Math.random() * cards.length)]);
    setSizeMultiplier(8);
  }, [setting]);

  useEffect(()=>{console.log(answer)},[answer])

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

  const onCheck = (packCode: string): void => {
    if(!setting) return
    setSetting({
      ...setting,
      filteredPacks: setting.filteredPacks.includes(packCode)
        ? setting.filteredPacks.filter((code) => code !== packCode)
        : [...setting.filteredPacks, packCode],
    });
  };

  const setOverrideAnswer = (id: string): void => {
    const tempAnswer = dataObjects.find(o=>o.id === id)
    if(!tempAnswer) return alert('Card not found')
    setTempAnswer(tempAnswer)
    setAnswer(tempAnswer)
    setAnimation("");
    setAttempt([]);
    setWin(false);
    setSizeMultiplier(8);
  }
  return (
    <div className="App">
      <h1>
        AHCardle - Pic Guessor
        <Modal
          closeIcon={true}
          trigger={<Icon name="question circle outline" />}
          content={
            <Container fluid>
              <div className="instructions">
                <h2>Welcome to Ahcardle Pic Guessor!</h2>
                <p>
                  Unleash your inner investigator! Identify the Arkham Horror
                  LCG card from a zoomed-in image. Make a guess, but be cautious
                  – each incorrect answer zooms the card out a bit. How many can
                  you guess correctly?
                </p>
                <h3>How to Play:</h3>
                <ol>
                  <li>
                    Examine the zoomed-in image of an Arkham Horror LCG card.
                  </li>
                  <li>Guess the card's identity in the provided textbox.</li>
                  <li>Submit your guess.</li>
                  <li>Correct guesses move you to the next round.</li>
                  <li>
                    Incorrect guesses zoom the card out for and continue guessing.
                  </li>
                </ol>
              </div>
            </Container>
          }
        />
      </h1>
      <Grid textAlign="center" verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 450 }}>
          {win && ogToggle ? (
            <img
              src={`https://arkhamdb.com/${answer?.imagesrc}`}
              style={{
                // margin: `${sizeMultiplier * -5}rem ${sizeMultiplier * -12}rem`,
                height: `420px`,
                width: `300px`,
              }}
            />
          ) : (
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
                  margin: `${sizeMultiplier * -5}rem ${
                    sizeMultiplier * -12
                  }rem`,
                  height: `${sizeMultiplier * 42}rem`,
                  width: `${sizeMultiplier * 30}rem`,
                }}
              />
            </Segment>
          )}
          <Form size="large">
            {win ? (
              <>
                <Button
                  onClick={() => setOgToggle(!ogToggle)}
                  content={`Toggle to ${
                    ogToggle ? "last guess" : "full card"
                  }!`}
                />
                <Button onClick={() => initReset()} content="Play again!" />
              </>
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
      <Modal
        closeIcon={true}
        trigger={
          <Button
            style={{ marginTop: 10 }}
            content={
              <>
                <Icon name="setting" />
                Additional Setting
              </>
            }
          />
        }
        content={
          <Container fluid>
            <div className="settings">
              <h2>Packs settings</h2>
              <p>
                Select which packs included in the game. Notes - card with
                duplicated name, one of them will be removed
              </p>
              <p>
                Card/Data set retrieved on Oct 2023
              </p>
              <button onClick={() => setSetting({ filteredPacks: [] })}>
                Select All
              </button>
              <button onClick={() => setSetting({ filteredPacks: packs.map(o=>o.code)})}>
                Filter All
              </button>
              <button onClick={() => setSetting({ filteredPacks: DEFAULT_FILTER})}>
                Default All
              </button>
                  <br />
              {packs.map(({ code, name }) => (
                <>
                  <Checkbox
                    key={code}
                    label={name}
                    checked={!setting?.filteredPacks?.includes(code)}
                    onChange={() => onCheck(code)}
                  />
                  <br />
                </>
              ))}
              <Divider />
              Set Answer for next card
              <Dropdown
                  placeholder="Type card name..."
                  search
                  selection
                  fluid
                  value={tempAnswer?.id}
                  onChange={(_, o) => setOverrideAnswer(o.value as string)}
                  options={dataObjects
                    .map((o) => ({
                      key: o.id,
                      value: o.id,
                      text: o.name,
                    }))
                  }
                />
            </div>
          </Container>
        }
      />
    </div>
  );
}

export default App;
