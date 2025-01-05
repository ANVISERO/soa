import "./index.css"

function AppContainer(props) {

  const style = {
    maxWidth: props.enabled === "false" ? "100%" : "1200px",
    marginLeft: props.enabled === "false" ? "2rem" : "0",
    marginRight: props.enabled === "false" ? "2rem" : "0"
  }

  return (
    <div className="app__container" style={style}>
      {props.children}
    </div >
  );
}

export default AppContainer;
