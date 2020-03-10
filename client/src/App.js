import React from "react";
import Card from "./components/Card";

const resizeOffset = 5;

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mouseX: 0,
            mouseY: 0,
            cards: [
                {
                    title: "Title",
                    html: "This is a notecard",
                    width: 500,
                    height: 300,
                    widthStatic: 500,
                    heightStatic: 300,
                    y: 30,
                    x: 30,
                    yStatic: 30,
                    xStatic: 30,
                    dragging: false,
                    resizing: false,
                    resizeHover: false,
                    hover: false
                }
            ]
        }
    }
    checkResizing(e, i) {
        const cards = this.state.cards
        const card = cards[i]
        const distanceX = e.pageX - card.x
        const distanceY = e.pageY - card.y
        const resizingNwse = (distanceX <= resizeOffset && distanceY <= resizeOffset) || (card.width - distanceX <= resizeOffset && card.height - distanceY <= resizeOffset)
        const resizingNesw = (card.width - distanceX <= resizeOffset && distanceY <= resizeOffset) || (distanceX <= resizeOffset && card.height - distanceY <= resizeOffset)
        if (resizingNwse) {
            card.resizeHover = "nwse"
            card.hover = false
        }
        else if (resizingNesw) {
            card.resizeHover = "nesw"
            card.hover = false
        }
        else {
            card.resizeHover = false 
            card.hover = true
        }
    }
    handleMouseDown(e) {
        const cards = this.state.cards
        if (cards.filter(x => { return x.resizeHover }).length === 1) {
            cards.filter(x => { return x.resizeHover })[0].resizing = true
        }
        if (cards.filter(x => { return x.hover }).length === 1) {
            cards.filter(x => { return x.hover })[0].dragging = true
        }
        this.setState({
            xStart: e.pageX,
            yStart: e.pageY,
            cards: cards
        })
    }
    handleMouseUp() {
        const cards = this.state.cards;
        cards.filter(x => { return x.resizing || x.dragging }).forEach(card => {
            card.resizing = false
            card.dragging = false
            card.heightStatic = card.height
            card.widthStatic = card.width
            card.yStatic = card.y
            card.xStatic = card.x
        })
    }
    resize(card) {
        const left = this.state.xStart <= card.xStatic + resizeOffset;
        const top = this.state.yStart <= card.yStatic + resizeOffset;
        if (top) {
            card.height = card.heightStatic + this.state.yStart - this.state.mouseY
            card.y = card.yStatic + this.state.mouseY - this.state.yStart
        }
        else {
            card.height = card.heightStatic + this.state.mouseY - this.state.yStart
        }
        if (left) {
            card.width = card.widthStatic + this.state.xStart - this.state.mouseX
            card.x = card.xStatic + this.state.mouseX - this.state.xStart
        }
        else {
            card.width = card.widthStatic + this.state.mouseX - this.state.xStart
        }
    }
    drag(card) {
        card.x = this.state.mouseX - (this.state.xStart - card.xStatic)
        card.y = this.state.mouseY - (this.state.yStart - card.yStatic)
    }
    handleMouseMove(e) {
        this.setState({
            mouseX: e.pageX,
            mouseY: e.pageY
        }, () => {
            const cards = this.state.cards
            cards.filter(x => { return x.resizing }).forEach(this.resize.bind(this))
            cards.filter(x => { return x.dragging }).forEach(this.drag.bind(this))
            this.setState({cards: cards})
        })
    }
    cardHandleMouseLeave(i) {
        const cards = this.state.cards
        cards[i].hover = false;
        cards[i].resizeHover = false;
    }
    render() {
        const style = {
            backgroundImage: "url(/assets/images/wood.jpg)",
            minHeight: "100vh"
        }
        return (
            <div onMouseDown={this.handleMouseDown.bind(this)} onMouseUp={this.handleMouseUp.bind(this)} onMouseMove={this.handleMouseMove.bind(this)} style={style}>
                {this.state.cards.map((card, i) => {
                    return <Card handleMouseLeave={() => { this.cardHandleMouseLeave(i) }} handleMouseMove={(e) => { this.checkResizing(e, i) }} handleMouseEnter={(e) => { this.checkResizing(e, i) }} id={i} key={i} {...card} mouseX={this.state.mouseX} mouseY={this.state.mouseY} />
                })}
            </div>
        )
    }
}

export default App;