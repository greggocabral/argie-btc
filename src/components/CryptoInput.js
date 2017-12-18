import React from 'react';
import {FormGroup,FormControl, InputGroup, Button} from 'react-bootstrap';
import '../../node_modules/cryptocoins-icons/webfont/cryptocoins.css';
import '../App.css';


class  CryptoInput extends React.Component{

    constructor(props){

        super(props);

        this.state = {
            cryptoClass : "cc "+props.crypto._id,
            cryptoPlaceholder : "Tenencia de " + props.crypto._id
        }
    }

    componentDidMount (){

    }

    render() {

        return (

            <FormGroup bsSize="large">
                <InputGroup>
                    <InputGroup.Addon className="custom-crypto-addon-label">

                        <span className="custom-crypto-symbol">
                            <i className={this.state.cryptoClass} title={this.props.crypto._id}> </i>
                        </span>
                        {" "+this.props.crypto._id}
                    </InputGroup.Addon>
                    <FormControl type="number" placeholder={this.state.cryptoPlaceholder} onChange={this.handleAmountChange} value={this.props.crypto.amount}/>
                    <InputGroup.Button>
                        <Button bsSize="large" onClick={this.handleValueSave}>
                            <i className="fa fa-floppy-o" aria-hidden="true"></i>

                        </Button>
                    </InputGroup.Button>
                </InputGroup>
            </FormGroup>
        );
    }

    handleAmountChange = (event) => {
        let crypto = this.props.crypto;
        console.log('crypto to change: ', crypto);
        crypto.amount = event.target.value;
        console.log('crypto changed: ', crypto);
        this.props.handleValueChange(crypto);
    }

    handleValueSave = () => {
        this.props.handleValueSave(this.props.crypto._id);
    }



}


export default CryptoInput;
