import React from "react";
import Card from "./components/Card";

const resizeOffset = 5;

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mouseX: 0,
            mouseY: 0,
            doNotHighlight: false,
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
                    resizeHover: false
                },
                {
                    title: "Title 2",
                    html: "This is a second notecard",
                    width: 500,
                    height: 300,
                    widthStatic: 500,
                    heightStatic: 300,
                    y: 200,
                    x: 700,
                    yStatic: 200,
                    xStatic: 700,
                    dragging: false,
                    resizing: false,
                    resizeHover: false
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
        }
        else if (resizingNesw) {
            card.resizeHover = "nesw"
        }
        else {
            card.resizeHover = false 
        }
    }
    handleMouseDown(e) {
        this.setState({
            xStart: e.pageX,
            yStart: e.pageY,
            doNotHighlight: true
        })
    }
    handleMouseUp() {
        const cards = this.state.cards;
        cards.forEach(card => {
            card.resizing = false
            card.dragging = false
            card.resizeHover = false
            card.heightStatic = card.height
            card.widthStatic = card.width
            card.yStatic = card.y
            card.xStatic = card.x
        })
        this.setState({
            cards: cards,
            doNotHighlight: false
        })
    }
    resize(card) {
        if (card.resizing) {
            const left = this.state.xStart <= card.xStatic + resizeOffset;
            const top = this.state.yStart <= card.yStatic + resizeOffset;
            if (top) {
                card.height = Math.max(card.heightStatic + this.state.yStart - this.state.mouseY, 50)
                if (card.height !== 50) {
                    card.y = card.yStatic + this.state.mouseY - this.state.yStart
                }
            }
            else {
                card.height = Math.max(card.heightStatic + this.state.mouseY - this.state.yStart, 50)
            }
            if (left) {
                card.width = Math.max(card.widthStatic + this.state.xStart - this.state.mouseX, 50)
                if (card.width !== 50) {
                    card.x = card.xStatic + this.state.mouseX - this.state.xStart
                }
            }
            else {
                card.width = Math.max(card.widthStatic + this.state.mouseX - this.state.xStart, 50)
            }
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
        cards[i].resizeHover = false;
    }
    cardHandleMouseDown(i) {
        const cards = this.state.cards
        const card = cards[i]
        if (!card.resizeHover) {
            card.dragging = true
        }
        else {
            card.resizing = true
        }
        cards.push(cards.splice(i, 1)[0])
        this.setState({ cards: cards })
    }
    render() {
        const style = {
            backgroundImage: "url(/assets/images/wood.jpg)",
            minHeight: "100vh"
        }
        return (
            <div onMouseDown={this.handleMouseDown.bind(this)} onMouseUp={this.handleMouseUp.bind(this)} onMouseMove={this.handleMouseMove.bind(this)} style={style}>
                {this.state.cards.map((card, i) => {
                    return <Card doNotHighlight={this.state.doNotHighlight} handleMouseDown={() => { this.cardHandleMouseDown(i) }} handleMouseMove={(e) => { this.checkResizing(e, i) }} handleMouseEnter={(e) => { this.checkResizing(e, i) }} id={i} key={i} {...card} mouseX={this.state.mouseX} mouseY={this.state.mouseY} />
                })}
            </div>
        )
    }
}

export default App;