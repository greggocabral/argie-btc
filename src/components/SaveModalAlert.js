import React from 'react';
import {Modal, Button} from 'react-bootstrap';

class  SaveModalAlert extends React.Component{

    constructor(props){
        super(props);

    }

    componentDidMount() {

    }

    render() {

        return (

            <Modal show={this.props.showModal} onHide={this.close}>
                <Modal.Body>
                    <p>
                        Se guardó tu tenencia de esta criptomoneda localmente en tu dispositivo.
                    </p>
                    <p>
                        De esta manera vas a poder chequear rapidamente tus ganancias en cada vez que inicies la aplicación.
                    </p>
                    <p>
                        Recordá mantener actualizada tu tenencia cada vez que realices compras o ventas.
                    </p>
                    <Button block onClick={this.close}>OK</Button>
                </Modal.Body>
            </Modal>

        );
    }


    close = () => {
        this.props.close();
    }

}


export default SaveModalAlert;
