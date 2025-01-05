import "./index.css"

function AppBody(props) {
  return (
    <div className="app__content">
      {props.children}
    </div>

  );
}

export default AppBody;
