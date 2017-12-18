import React, {Component} from 'react';
import {
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
import InfoModalAlert from "./components/InfoModalAlert.js";
import SaveModalAlert from "./components/SaveModalAlert.js";

// https://www.cryptocompare.com/api/#-api-data-price-

// import '../node_modules/fetch-jsonp/build';

import fetchJsonp from 'fetch-jsonp';

import { PulseLoader } from 'react-spinners';
import CryptoInput from "./components/CryptoInput";

class App extends Component {

    constructor() {
        super();
        this.state = {
            amountARS: 0,
            amountUSD: 0,
            amountBTC: 0,
            sellTxCost: 0.02,
            BTCARS: 0,
            BTCUSD: 0,
            loading: true,
            alertVisible: false,
            cryptos: [
                {_id:'BTC', amount: 0, priceInBTC: 1, symbolPath: 'btc'}
                // {_id:'ETH', amount: 0, priceInBTC: 1, symbolPath: 'eth'},
                // {_id:'LTC', amount: 0, priceInBTC: 1, symbolPath: 'ltc'},
                // {_id:'XMR', amount: 0, priceInBTC: 1, symbolPath: 'xmr'},
                // {_id:'BCH', amount: 0, priceInBTC: 1, symbolPath: 'bch'},
                // {_id:'XRP', amount: 0, priceInBTC: 1, symbolPath: 'xrp'},
                // {_id:'IOTA', amount: 0, priceInBTC: 1, symbolPath: 'iot'},
                // {_id:'DASH', amount: 0, priceInBTC: 1, symbolPath: 'dsh'},
                // {_id:'EOS',  amount: 0, priceInBTC: 1, symbolPath: 'eos'}
            ],
            showInfoModalAlert: false,
            showSaveModalAlert: false
        }


    }


    render() {

        console.log(this.state);

        return <div className="App">

            <Jumbotron>
                {
                    this.state.loading?
                        <h1>
                            <PulseLoader color={'#333333'} loading="true"/>
                        </h1>
                        :
                        <h1>
                            {this.getNumberWithDots(this.state.amountARS)} ARS
                        </h1>
                }
            </Jumbotron>



            <Grid>
                {
                    this.state.cryptos.map(crypto => {
                        return (
                                <Row className="show-grid">
                                    <Col xs={12} >
                                        <CryptoInput key={crypto._id}
                                                     crypto={crypto}
                                                     handleValueChange={this.handleValueChange}
                                                     handleValueSave={this.handleValueSave}
                                                     />
                                    </Col>
                                </Row>
                            )
                    })
                }

                <Row className="show-grid">
                    <Col xs={4} className="custom-black-font">
                        <h1>
                            <i className="fa fa-info" aria-hidden="true" onClick={()=>this.handleModalAlertShow('info')}></i>
                        </h1>
                    </Col>
                    <Col xs={4}>
                        <h1>
                            <a href='https://github.com/greggocabral/argie-btc'><i className="fa fa-github custom-black-font" aria-hidden="true"></i></a>
                        </h1>
                    </Col>
                    <Col xs={4}>
                        <h1>
                            <a href='https://greggocabral.github.io'> <i className="fa fa-envelope-o custom-black-font" aria-hidden="true"></i></a>
                        </h1>
                    </Col>
                </Row>


                <InfoModalAlert showModal={this.state.showInfoModalAlert} close={()=>{this.handleModalAlertDismiss('info')}}/>

                <SaveModalAlert showModal={this.state.showSaveModalAlert} close={()=>{this.handleModalAlertDismiss('save')}}/>

            </Grid>

        </div>;
    }

    componentDidMount() {
        this.getLocalStorageData();
        this.getExchangeData()
            .then(() => {
                let amountBTC = this.getAmountBTC(this.state.cryptos);
                let amountARS = this.getAmountARS(amountBTC);
                this.setState({loading: false, amountBTC, amountARS});
            })
    }

    getLocalStorageData = () => {
        let cryptos = this.state.cryptos
        cryptos.forEach(crypto => {
            crypto.amount = localStorage.getItem(crypto._id) || 0;
        });
        this.setState({cryptos});
    }

    getExchangeData = () => {

        return new Promise((resolve, reject) => {

            let BTCQuotationPromise = this.getBTCQuotation();

            let altQuotationPromise = this.getAltQuotation();

            Promise.all([BTCQuotationPromise, altQuotationPromise])
                .then(quotations => {
                    this.parseQuotationData(quotations[0], quotations[1]);
                    resolve();
                })
        })
    }

    getBTCQuotation = () => {

        return new Promise((resolve, reject) => {

            fetch('https://api.satoshitango.com/v2/ticker')
                .then(response => {
                    return response.json();
                })
                .then(response => {
                    resolve(response.data)
                })
        })
    }

    getAltQuotation = () => {

        let nPromises = 0;
        let cryptoData = [];
        let reqHeaders = new Headers();
        var reqInit = { method: 'GET',
            headers: reqHeaders,
            mode: 'cors',
            cors: true, // allow cross-origin HTTP request
            credentials: 'same-origin', // This is similar to XHR’s withCredentials flag
            cache: 'default' };

        return new Promise((resolve, reject) => {

            if (this.state.cryptos.length < 2) {
                resolve([{_id:'BTC', data: {bid:1}}]);
            }

            this.state.cryptos.forEach(crypto => {
                if (crypto._id != "BTC") {
                    let cryptoPath = crypto.symbolPath + 'btc';

                    nPromises++;
                    // fetchJsonp('https://cors-anywhere.herokuapp.com/https://api.bitfinex.com/v1/pubticker/' + cryptoPath)
                    fetch('https://api.bitfinex.com/v1/pubticker/' + cryptoPath, reqInit)
                        .then(response => {
                            return response.json();
                        })
                        .then(data => {
                            cryptoData.push({_id: crypto._id, data: JSON.parse(data.body)});
                            nPromises--;
                            if (nPromises === 0) {
                                resolve(cryptoData);
                            }
                        })
                }
            });
        })
    }

    parseQuotationData = (BTCQuotation, altQuotations) => {

        let BTCARS = BTCQuotation.venta.arsbtc;
        let BTCUSD = BTCQuotation.venta.usdbtc;
        let cryptos = this.state.cryptos;


        altQuotations.forEach(altQuotation => {
            let found = false;
            let i = 0;
            do {
                if (cryptos[i]._id === altQuotation._id){
                    cryptos[i].priceInBTC = altQuotation.data.bid;
                    found = true;
                }
                i++;
            }
            while (!found && i < cryptos.length);

        });

        this.setState({BTCARS, BTCUSD, cryptos});

    }



    handleValueSave = (cryptoId) => {
        let crypto = this.state.cryptos.filter(crypto => {
            return crypto._id === cryptoId;
        });
        localStorage.setItem(crypto[0]._id, crypto[0].amount);
        this.handleModalAlertShow('save');
    }



    handleModalAlertShow = (modal) => {
        switch(modal){
            case "info":
                this.setState({showInfoModalAlert:true});
                break;
            case "save":
                this.setState({showSaveModalAlert:true});
                break;
        }
    }

    handleModalAlertDismiss = (modal) => {
        switch(modal){
            case "info":
                this.setState({showInfoModalAlert:false});
                break;
            case "save":
                this.setState({showSaveModalAlert:false});
                break;
        }
    }

    getAmountARS = (amountBTC) => {
        return Math.round(amountBTC * this.state.BTCARS * (1-this.state.sellTxCost));

    }

    getNumberWithDots = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }


    getAmountBTC = (cryptos) => {
        return cryptos.reduce((totalBTC, crypto) => {
            return totalBTC + (crypto.amount * crypto.priceInBTC);
        }, 0);

    }

    handleValueChange = (modifiedCrypto) => {
        let cryptos = this.state.cryptos;
        cryptos.forEach(crypto => {
            if (crypto._id === modifiedCrypto._id){
                let modifiedAmount = parseFloat(modifiedCrypto.amount);
                crypto.amount = !isNaN(modifiedAmount)? modifiedAmount : 0;
            }
        });

        let amountBTC = this.getAmountBTC(cryptos);
        let amountARS = this.getAmountARS(amountBTC);
        this.setState({cryptos, amountBTC, amountARS});
    }
}

export default App;
