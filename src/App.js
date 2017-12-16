import React, {Component} from 'react';
import {
    Button,
    Jumbotron,
    h1,
    p,
    Grid,
    Row,
    Col,
    Alert
} from 'react-bootstrap';
import './App.css';
import '../node_modules/cryptocoins-icons/webfont/cryptocoins.css';

import { PulseLoader } from 'react-spinners';
import CryptoInput from "./components/CryptoInput";

class App extends Component {

    constructor() {
        super();
        this.state = {
            amountPesos: 0,
            amountBTC: 0,
            priceBTC: 0,
            alertVisible: false,
            cryptos: [
                {_id:'BTC', amount: 0, priceInBTC: 1},
                {_id:'ETH', amount: 0, priceInBTC: 1},
                {_id:'LTC', amount: 0, priceInBTC: 1},
                {_id:'XMR', amount: 0, priceInBTC: 1},
                {_id:'BCH', amount: 0, priceInBTC: 1},
                {_id:'XRP', amount: 0, priceInBTC: 1},
                {_id:'IOTA', amount: 0, priceInBTC: 1},
                {_id:'DASH', amount: 0, priceInBTC: 1},
                {_id:'EOS',  amount: 0, priceInBTC: 1}
            ]
        }
    }


    render() {

        return <div className="App">

            <Jumbotron>
                {
                    this.state.priceBTC === 0 ?
                        <h1>
                            <PulseLoader color={'#333333'} loading="true"/>
                        </h1>
                        :
                        <h1>
                            {this.getNumberWithDots(this.state.amountPesos)} ARS
                        </h1>
                }
            </Jumbotron>



            <Grid>
                {
                    this.state.cryptos.map(crypto => {
                        return (
                                <Row className="show-grid">
                                    <Col xs={12}>
                                        <CryptoInput key={crypto._id}
                                                     crypto={crypto}
                                                     handleValueChange={this.handleValueChange}
                                                     />
                                    </Col>
                                </Row>
                            )
                    })
                }

                <Row className="show-grid">
                    <Col xs={12}>
                        <small>
                            Cálculos realizados utilizando ratios de conversión a BTC de <a href='https://www.bitfinex.com/'>Bitfinex</a>
                             y precio de venta de BTC en <a href='https://www.satoshitango.com.ar/'>SatoshiTango</a>
                            {
                                this.state.priceBTC === 0 ?
                                    <span>... </span>
                                    :
                                    <span> {this.getNumberWithDots(Math.round(this.state.priceBTC))} ARS </span>

                            }
                        </small>

                    </Col>
                </Row>
                <Row className="show-grid">
                    {
                        this.state.alertVisible ?

                            <Alert bsStyle="info" onDismiss={this.handleAlertDismiss}>
                                <h4>Datos guardados</h4>
                                <p>
                                    Se guardó tu tenencia de bitcoin localmente en tu dispositivo.
                                </p>
                                <p>
                                    De esta manera vas a poder chequear rapidamente tus ganancias en cada vez que inicies la aplicación.
                                </p>
                                <p>
                                    Recordá mantener actualizada tu tenencia cada vez que realices compras o ventas.
                                </p>
                            </Alert>
                            :
                            <span></span>

                    }
                </Row>
            </Grid>

        </div>;
    }

    componentDidMount() {
        let lsAmountBTC = localStorage.getItem('amountBTC');
        let amountBTC = lsAmountBTC || 0;
        this.setState({amountBTC});
        this.getExchangePrices();
            .then(() => {
                this.updateAmountPesos(amountBTC)
            })
    }



    getExchangePrices = () => {
        let BTCARSPromise = fetch('https://api.satoshitango.com/v2/ticker');

        let cryptoExchangePromises = [];

        this.state.cryptos.forEach(crypto => {
            if (crypto._id != "BTC"){
                let cryptoPath = crypto._id.toLowerCase() + 'btc';
                cryptoExchangePromises.push(fetch('https://api.bitfinex.com/v1/pubticker/' + cryptoPath));
            }
        });

        Promise.all(cryptoExchangePromises)
            .then(cryptoExchangeResponses => {
                return cryptoExchangeResponses.map(cryptoExchangeResponse => {
                    return cryptoExchangeResponse.json();
                })
            })
            .then(cryptoExchangeRatios => {
                console.log(cryptoExchangeRatios)
            })

    }

    handleBTCAmountChange = (event) => {
        let amountBTC = !isNaN(parseFloat(event.target.value))? parseFloat(event.target.value) : 0;
        this.setState({amountBTC});
        this.updateAmountPesos(amountBTC);
    }

    handleBTCAmountSave = () => {
        localStorage.setItem('amountBTC', this.state.amountBTC);
        this.handleAlertShow();
    }

    handleAlertDismiss = () => {
        this.setState({ alertVisible: false });
    }

    handleAlertShow = () => {
        this.setState({ alertVisible: true });
    }

    updateAmountPesos = (amountBTC) => {
        this.setState({amountPesos: Math.round(amountBTC * this.state.priceBTC)});
    }

    getNumberWithDots = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }


    updateAmountBTC = () => {
        let amountBTC = this.state.cryptos.reduce(function(totalBTC, crypto){
            return totalBTC + (crypto.amount * crypto.priceInBTC);
        });

        this.setState({amountBTC});
    }

    handleValueChange = (modifiedCrypto) => {
        console.log('handleValueCahnge ', modifiedCrypto );
        let cryptos = this.state.cryptos;
        cryptos.forEach(crypto => {
            if (crypto._id === modifiedCrypto._id){
                let modifiedAmount = parseFloat(modifiedCrypto.amount);
                crypto.amount = !isNaN(modifiedAmount)? modifiedAmount : 0;
            }
        });
        console.log('updated cryptos', cryptos);
        this.setState({cryptos});
    }
}

export default App;
