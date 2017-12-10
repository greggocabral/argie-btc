import React, {Component} from 'react';
import {
    Button,
    Jumbotron,
    h1,
    p,
    Grid,
    Row,
    Col,
    FormGroup,
    InputGroup,
    FormControl
} from 'react-bootstrap';
import './App.css';

class App extends Component {

    constructor() {
        super();
        this.state = {
            amountPesos: 0,
            amountBTC: 0,
            priceBTC: 0
        }
    }


    render() {
        return (
            <div className="App">
                <Jumbotron>
                    {
                        this.state.priceBTC === 0 ?
                            <h1>Cargando...</h1>
                            :
                            <h1>
                                {this.getNumberWithDots(this.state.amountPesos)} ARS
                            </h1>
                    }
                </Jumbotron>
                <Grid>
                    <Row className="show-grid">
                        <Col xs={12}>
                            <FormGroup bsSize="large">
                                <InputGroup>
                                    <InputGroup.Addon><i className="fa fa-btc" aria-hidden="true"></i></InputGroup.Addon>
                                    <FormControl type="number" placeholder="Cantidad de bitcoin" value={this.state.amountBTC} onChange={this.handleBTCAmountChange}/>
                                    <InputGroup.Button>
                                        <Button bsSize="large" onClick={this.handleBTCAmountSave}>
                                            <i className="fa fa-floppy-o" aria-hidden="true"></i>
                                        </Button>
                                    </InputGroup.Button>
                                </InputGroup>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row className="show-grid">
                        <Col xs={12}>
                            <p>Utilizando precio de venta en SatoshiTango</p>
                            {
                                this.state.priceBTC === 0 ?
                                    <p>Cargando...</p>
                                    :
                                    <p>1 <i className="fa fa-btc" aria-hidden="true"></i> = {this.getNumberWithDots(Math.round(this.state.priceBTC))} ARS</p>
                            }

                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }

    componentDidMount() {
        let lsAmountBTC = localStorage.getItem('amountBTC');
        let amountBTC = lsAmountBTC || 0;
        this.setState({amountBTC});
        this.getExchangePrices()
            .then(() => {
                this.updateAmountPesos(amountBTC)
            })
    }



    getExchangePrices = () => {
        let satoshiTangoPromise = fetch('https://api.satoshitango.com/v2/ticker');
        return satoshiTangoPromise
            .then(satoshiTangoResponse => {
                return satoshiTangoResponse.json();
            })
            .then(satoshiTangoData => {
                let satoshiTangoPrice = satoshiTangoData.data.compra.arsbtc;
                this.setState({priceBTC:  satoshiTangoPrice});
            })
    }

    handleBTCAmountChange = (event) => {
        let amountBTC = !isNaN(parseFloat(event.target.value))? parseFloat(event.target.value) : 0;
        this.setState({amountBTC});
        this.updateAmountPesos(amountBTC);
    }

    handleBTCAmountSave = () => {
        localStorage.setItem('amountBTC', this.state.amountBTC);
    }


    updateAmountPesos = (amountBTC) => {
        this.setState({amountPesos: Math.round(amountBTC * this.state.priceBTC)});
    }

    getNumberWithDots = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
}

export default App;
