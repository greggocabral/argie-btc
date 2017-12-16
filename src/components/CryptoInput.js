import React from 'react';
import {FormGroup,FormControl, InputGroup, Button} from 'react-bootstrap';
import '../../node_modules/cryptocoins-icons/webfont/cryptocoins.css';


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
                    <InputGroup.Addon><i className={this.state.cryptoClass} title={this.props.crypto._id}></i></InputGroup.Addon>
                    <FormControl type="number" placeholder={this.state.cryptoPlaceholder} onChange={this.handleAmountChange}/>
                    <InputGroup.Button>
                        <Button bsSize="large" >
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



}


export default CryptoInput;
