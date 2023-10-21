import React, { useEffect, useRef, useState } from "react";
import './App.css';
import {dataObjects} from "./data/dataObjects";
import {
  Button,
  Dropdown,
  Form,
  Grid,
  Header,
  Image,
  Input,
  Message,
  Segment,
} from "semantic-ui-react";

function App() {
  const [answer, setAnswer] = useState(dataObjects[Math.floor(Math.random() * dataObjects.length)])
  const [sizeMultipler, setSizeMultipler] = useState(8)
  const [attempt, setAttempt] = useState()
  const [winSpin, setWinSpin] = useState('')
  const [win, setWin] = useState(false)
  const initReset = () => {
      setTimeout(() => {
          setWinSpin('');
          setWin(false);
      },300)
  }

  const updateAnswer = (o:any):void=>{
    setAttempt(o)
  }

  const attemptAnswer = ():void=>{
    setAttempt(undefined)
    if(answer.id===attempt){
      setWin(true)
    }else{
      if(sizeMultipler>2){
        setSizeMultipler(prev=>prev-0.5)
        setAttempt(undefined)
      }
    }
  }

  return (
    <div className="App">
      <Grid
        textAlign="center"
        style={{ height: "50vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="teal" textAlign="center">
            <Segment stacked style={{  width: "30vw",  height: "30vw", overflow: "hidden", margin:"auto"}} className="segment">
                <img
                src={`https://arkhamdb.com/${answer.imagesrc}`}
                style={{ margin:`${sizeMultipler*-5}vw ${sizeMultipler*-12}vw`, height:`${sizeMultipler*42}vw`, width:`${sizeMultipler*30}vw`}}
                />
              </Segment>
          </Header>
          <Form size="large">
          {win && <button className='initAgain' onClick={initReset}>Play again!</button>}
            <div className="searchBar">
            <Dropdown
                  placeholder='Type card name...'
                  search
                  selection
                  clearable
                  value={attempt}
                  onChange={(_,o)=>updateAnswer(o.value)}
                  options={dataObjects.map(o=>({key:o.id, value:o.id, text:o.name}))}
              />
              <button onClick={attemptAnswer}>➤</button>

            </div>
          </Form>
        </Grid.Column>
      </Grid>
    </div>
  );
}

export default App;
