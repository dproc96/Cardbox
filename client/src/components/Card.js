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
    checkResizing(e) {
        const distanceX = e.pageX - this.state.x
        const distanceY = e.pageY - this.state.y
        const resizingNwse = (distanceX <= 5 && distanceY <= 5) || (this.state.width - distanceX <= 5 && this.state.height - distanceY <= 5)
        const resizingNesw = (this.state.width - distanceX <= 5 && distanceY <= 5) || (distanceX <= 5 && this.state.height - distanceY <= 5)
        if (resizingNwse) {
            this.setState({ resizeHover: "nwse" })
        }
        else if (resizingNesw) {
            this.setState({ resizeHover: "nesw" })
        }
        else {
            this.setState({ resizeHover: false })
        }
    }
    handleMouseMove(e) {
        if (this.state.dragging) {
            console.log(this.state.offsetY)
            console.log(e.pageY)
            this.setState({ x: e.pageX - this.state.offsetX, y: e.pageY - this.state.offsetY });
        }
        this.checkResizing(e)
    }
    handleMouseDown(e) {
        if (this.state.resizeHover) {
            console.log("resizing")
        }
        else {
            this.setState({ 
                offsetX: e.pageX - this.state.x,
                offsetY: e.pageY - this.state.y,
                dragging: true 
            })
        }
    }
    handleMouseUp() {
        this.setState({ dragging: false })
    }
    handleMouseEnter(e) {
        this.checkResizing(e)
    }
    handleMouseLeave() {
        this.setState({ 
            resizeHover: false,
            dragging: false
        })
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
            userSelect: (this.state.dragging || this.state.resizeHover) ? "none" : "auto",
            resize: "both",
            cursor: this.state.resizeHover ? `${this.state.resizeHover}-resize` : "auto"
        }
        return (
            <div onMouseDown={this.handleMouseDown.bind(this)} onMouseUp={this.handleMouseUp.bind(this)} onMouseMove={this.handleMouseMove.bind(this)} onMouseEnter={this.handleMouseEnter.bind(this)} onMouseLeave={this.handleMouseLeave.bind(this)} style={style}>
                <h3>{this.state.title}</h3>
                <div>
                    {this.state.html}
                </div>
            </div>
        )
    }
}

export default Card;