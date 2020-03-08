import React from "react";
import Card from "./components/Card";

class App extends React.Component {
    render() {
        const style = {
            backgroundImage: "url(/assets/images/wood.jpg)",
            minHeight: "100vh"
        }
        return (
            <div style={style}>
                <Card />
            </div>
        )
    }
}

export default App;