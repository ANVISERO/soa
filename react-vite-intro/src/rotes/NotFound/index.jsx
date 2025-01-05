import React from "react";
import { useNavigate } from 'react-router-dom';

import "./index.scoped.css";
import AppBody from "../../components/containers/AppBody/index.jsx";
import Header from "../../components/containers/Sections/Header/index.jsx";
import AppContainer from "../../components/containers/AppContainer/index.jsx";
import PrimaryButton from "../../components/PrimaryButton/index.jsx";
// import { ReactComponent as Home } from "./../../assets/icons/send.svg";
import sendIcon from "./../../assets/icons/send.svg";


function NotFound() {
  const navigate = useNavigate();

  async function backward() {
    navigate('/');
  }

  return (
    <AppBody>

      <Header logo="" addToScroll={() => {}} removeToScroll={() => {}} tasks={false} hover="no__hover"></Header>

      <div className="content">
        <AppContainer>
          <div className="nf__img"></div>
          <div className="nf__content">
            <div className="title fix">PAGE NOT FOUND</div>

            {/*<div className="button">*/}
              <PrimaryButton click={backward} content="Backward" class="default__button">
                {/*<Home />*/}
                <div>
                  <img src={sendIcon} alt="Home"/>
                </div>
              </PrimaryButton>
            {/*</div>*/}
          </div>
        </AppContainer>
      </div>

    </AppBody>
  )
}

export default NotFound;