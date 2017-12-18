import React from 'react';
import {Modal, Button} from 'react-bootstrap';

class  ModalAlert extends React.Component{

    constructor(props){
        super(props);

    }

    componentDidMount() {

    }

    render() {

        return (

            <Modal show={this.props.showModal} onHide={this.close}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{this.props.description}</p>

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.close}>{this.props.okButton}</Button>
                </Modal.Footer>
            </Modal>

        );
    }


    close = () => {
        this.props.close();
    }

}


export default ModalAlert;
