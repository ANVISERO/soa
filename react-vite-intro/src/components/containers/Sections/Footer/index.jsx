import AppContainer from "../../AppContainer";

import "./index.scoped.css";

function Footer() {

    return (
        <div className="footer">
            <AppContainer>

                <div className="footer__container">
                    <div className="empty"></div>
                    <div className="copyright">Service Oriented Architecture <br/>ITMO  2024</div>
                    <div className="author__block">
                        <p>by Ivanov Andrey</p>
                    </div>
                </div>

            </AppContainer>
        </div>
    );

}

export default Footer;
