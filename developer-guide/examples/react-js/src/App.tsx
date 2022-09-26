import { useState } from 'react';
import './App.css';
import 'normalize.css/normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import { Button, Icon } from '@blueprintjs/core';
import { GetIndex, GetTag } from './tagAssistant';
import { useEffect } from "react";

function App() {
  const [showError, setShowError] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showTag, setShowTag] = useState(false);
  const [showNoTagRead, setShowNoTagRead] = useState(false);
  const [tagRead, setTagRead] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const fetchTag = async () => {
    setButtonDisabled(true);
    setTagRead('');
    setShowTag(false);
    setErrorMessage('');
    setShowError(false);
    setShowInfo(true);
    setShowNoTagRead(false);

    const getTagResult = await GetTag();

    setShowInfo(false);

    if(getTagResult.errorMessage){
      setErrorMessage(getTagResult.errorMessage);
      setShowError(true);
    }
    else {
      if(getTagResult.tag.length === 0) {
        setShowNoTagRead(true);
      }
      else {
        setTagRead(`Tag read: ${getTagResult.tag}`);
        setShowTag(true);
      }
    }
    setButtonDisabled(false);
  }

  const probe = async () => {
    const probeResult = await GetIndex();

    if(!probeResult.success){
      setErrorMessage(probeResult.errorMessage);
      setShowError(true);
    }
    else{
      setButtonDisabled(false);
    }
  }

  useEffect(() => {
    probe();
  }, [])

  return (
    <div className="App" onLoad={probe}>
      <div><h2 className="bp3-heading">Logicality Tag Assistant Demo</h2></div>
      <div className="bp3-running-text .modifier">
        This application requires installation of the Logicality Tag Assistant software on your machine. <a href="https://github.com/logicality-io/tag-assistant-support">Download now.</a>
      </div>
      <Button className="ibutton-activate" icon="key" text="Read Tag" disabled={buttonDisabled} onClick={fetchTag} />
      <div className="ibutton-data">
      {
        showInfo ? <div><Icon icon="info-sign" intent="primary" /> Place Tag in reader now.</div> : ""
      }
      {
        showError ? <div><Icon icon="error" intent="danger" /> {errorMessage}</div> : ""
      }
      {
        showTag ? <div><Icon icon="tick" intent="success"/> {tagRead}</div> : ""
      }
      {
        showNoTagRead ? <div><Icon icon="warning-sign" intent="warning" /> No tag read.</div> : ""
      }
      </div>
      <div className="Copyright">Copyright 2022 Logicality B.V. All rights reserved.</div>
    </div>
  );
}

export default App;
