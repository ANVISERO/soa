import React, {useState} from 'react';
import {HashLink as Link} from 'react-router-hash-link';
import AppContainer from '../../AppContainer';

import "./index.scoped.css";

function Header(props) {
    // const [headerShadow, setHeaderShadow] = useState("");
    const [active, setActive] = useState(false);
    //
    // document.querySelector("body").addEventListener("scroll", checkWindowScroll);
    //
    // useEffect(() => {
    //     if (active) {
    //         props.addToScroll()
    //     } else {
    //         props.removeToScroll()
    //     }
    // }, [active]);
    //
    // function checkWindowScroll() {
    //     setHeaderShadow(document.querySelector("body").scrollTop > 20 ? "shadow" : "");
    // }

    return (
        <>
            <AppContainer enabled={props.container}>
                <div className="header__container">
                    <div className="header__navigation">
                        <div className={"menu burger__content " + (active ? "" : "menu__hidden")}>
                            <Link className={"header__link" + " " + props.hover} to={"/movies"}>
                                <h1>Movies</h1>
                            </Link>
                            <Link className={"header__link" + " " + props.hover} to={"/movies-max"}>
                                <h1>Movies max</h1>
                            </Link>
                            <Link className={"header__link" + " " + props.hover} to={"/loosers"}>
                                <h1>Loosers</h1>
                            </Link>
                            {props.children}
                        </div>
                    </div>
                </div>
            </AppContainer>
        </>
    );

}

export default Header;