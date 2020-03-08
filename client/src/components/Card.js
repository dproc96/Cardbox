import React from "react";

class Card extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: "Title",
            html: "This is a notecard",
            width: 500,
            height: 300,
            y: 30,
            x: 30,
            dragging: false
        }
    }
    _onMouseMove(e) {
        if (this.state.dragging) {
            console.log(this.state.offsetY)
            console.log(e.pageY)
            this.setState({ x: e.pageX - this.state.offsetX, y: e.pageY - this.state.offsetY });
        }
    }
    handleMouseDown(e) {
        this.setState({ 
            offsetX: e.pageX - this.state.x,
            offsetY: e.pageY - this.state.y,
            dragging: true 
        })
    }
    handleMouseUp() {
        this.setState({ dragging: false })
    }
    render() {
        const style = {
            width: this.state.width,
            height: this.state.height,
            backgroundColor: "#ffffff",
            padding: 15,
            borderRadius: 5,
            position: "absolute",
            top: this.state.y,
            left: this.state.x,
            boxShadow: "2px 2px 2px 2px rgba(0,0,0,0.3)",
            userSelect: this.state.dragging ? "none" : "auto",
            resize: "both"
        }
        return (
            <div onMouseDown={this.handleMouseDown.bind(this)} onMouseUp={this.handleMouseUp.bind(this)} onMouseMove={this._onMouseMove.bind(this)} style={style}>
                <h3>{this.state.title}</h3>
                <div>
                    {this.state.html}
                </div>
            </div>
        )
    }
}

export default Card;