import React from "react";

// const resizeOffset = 5;

class Card extends React.Component {
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
            boxShadow: "2px 2px 2px 2px rgba(0,0,0,0.3)",
            userSelect: (this.props.dragging || this.props.resizeHover) ? "none" : "auto",
            resize: "both",
            cursor: this.props.resizeHover ? `${this.props.resizeHover}-resize` : "auto"
        }
        return (
            <div onMouseMove={this.props.handleMouseMove} onMouseEnter={this.props.handleMouseEnter} style={style}>
                <h3>{this.props.title}</h3>
                <div>
                    {this.props.html}
                </div>
            </div>
        )
    }
}

export default Card;