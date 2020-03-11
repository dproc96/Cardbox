import React from "react";

class EditCardButton extends React.Component {
    render() {
        return (
            <i onClick={this.props.handleClick} style={{ float: "right", zIndex: this.props.z }} className={`btn fas fa-${this.props.editing ? "check" : "pen"}`}></i>
        )
    }
}

export default EditCardButton