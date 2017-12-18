import React from 'react';
import {Modal, Button} from 'react-bootstrap';

class  InfoModalAlert extends React.Component{

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
                        Los cálculos se realizan en base a lo siguiente:
                        <ul>
                            {/*<li>*/}
                                {/*Ratios de conversión a BTC de <a href='https://www.bitfinex.com/'>Bitfinex</a>.*/}
                            {/*</li>*/}
                            <li>
                                Precio de venta de BTC en <a href='https://www.satoshitango.com.ar/'>SatoshiTango</a>.
                            </li>
                            <li>
                                <a href='https://www.satoshitango.com/faq#6_sellbitcoins'>Costo de transacción de venta </a> del 2%.
                            </li>
                            <li>
                                Costos de transacción de la red no considerados.
                            </li>
                        </ul>
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


export default InfoModalAlert;
