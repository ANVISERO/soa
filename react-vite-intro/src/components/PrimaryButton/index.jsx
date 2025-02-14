import "./index.scoped.css";

function PrimaryButton(props) {

  const style = {
    width: props.width,
    height: props.height
  }

  return (
    <div className={"button " + props.class} onClick={props.click} style={style}>
      <div className="button__text">{props.content}</div>
      <div className="button__icon">{props.children}</div>
    </div>
  )

}

export default PrimaryButton;