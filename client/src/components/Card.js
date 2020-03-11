import React from "react";
import EditCardButton from "./EditCardButton";

class Card extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            textSelect: false
        }
    }
    handleTextMouseDown() {
        // this.setState({ textSelect: true })
    }
    handleTextMouseUp() {
        // this.setState({ textSelect: false })
    }
    render() {
        const style = {
            width: this.props.width,
            height: this.props.height,
            backgroundColor: "#ffffff",
            padding: 15,
            borderRadius: 5,
            position: "absolute",
            top: this.props.y,
            left: this.props.x,
            boxShadow: "2px 2px 3px 3px rgba(0,0,0,0.3)",
            userSelect: !(!this.props.doNotHighlight || this.state.textSelect) ? "none" : "auto",
            resize: "both",
            cursor: this.props.resizeHover ? `${this.props.resizeHover}-resize` : "auto",
            zIndex: this.props.id * 2
        }
        return (
            <div onMouseMove={this.props.handleMouseMove} onMouseEnter={this.props.handleMouseEnter} onMouseDown={this.props.handleMouseDown} style={style}>
                <div style={{overflow: "scroll", height: "100%"}}>
                    <EditCardButton z={this.props.id * 2 + 1} handleClick={this.props.handleEditConfirm} editing={this.props.editing} />
                    <h3 onMouseDown={this.handleTextMouseDown.bind(this)} onMouseUp={this.handleTextMouseUp.bind(this)}>{this.props.title}</h3>
                    <div onMouseDown={this.handleTextMouseDown.bind(this)} onMouseUp={this.handleTextMouseUp.bind(this)}>
                        {this.props.html}
                    </div>
                </div>
            </div>
        )
    }
}

export default Card;