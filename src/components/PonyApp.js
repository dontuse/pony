"use strict";

import React from 'react';
import {Modal,Button, Input, Grid, Row, Col, Well} from 'react-bootstrap';

import PonyStore from '../stores/PonyStore.js';
import PonysActions from '../actions/PonysActions.js';


class PonyApp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: true,
            ponys: PonyStore.getFilteredPonys(),
            ponyColors: PonyStore.getColors(),
            ponyKinds: PonyStore.getKinds()
        };
    }

    componentWillMount() {
        PonyStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        PonyStore.removeChangeListener(this._onChange);
    }

    close() {
        this.setState({showModal: false});

    }

    open(e) {
        e.preventDefault();
        this.setState({showModal: true});
    }

    filter() {
        let color = this.refs.ponyColor.getValue();
        let kind = this.refs.ponyKind.getValue();
        let maxPrice = +this.refs.ponyMaxPrice.getValue();
        let minPrice = +this.refs.ponyMinPrice.getValue();
        let is_new = this.refs.ponyIsNew.getValue();
        let count = this.refs.ponyCount.getValue();

        if (is_new === "true") {
            is_new = true
        }
        else if (is_new === "false") {
            is_new = false
        }

        PonysActions.filter({color, kind, maxPrice, minPrice, is_new, count});
    }

    _onChange = () => {
        console.log('_change', PonyStore.getFilteredPonys());
        this.setState({
            ponys: PonyStore.getFilteredPonys()
        });
    };

    render() {
        return (
            <div>
                <a onClick={this.open.bind(this)} href="">Позови пони</a>
                <br/>
                <br/>
                <br/>
                <br/>
                <a onClick={this.open.bind(this)} href="">Позови пони Еще как то</a>

                <Modal bsSize='large' show={this.state.showModal} onHide={this.close.bind(this)}>
                    <Modal.Header>
                        <Modal.Title>Купи пони</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div onChange={this.filter.bind(this)}>


                            <Row>
                                <Col xs={6}>
                                    <Input
                                        ref="ponyColor"
                                        type='select'
                                        label='Цвет пони'
                                        placeholder='Цвет пони'>
                                {this.state.ponyColors.map((color)=> {
                                    return (
                                        <option key={color} selected={color} value={color}>{color}</option>
                                    )
                                })}
                                        <option selected value=''>...</option>
                                    </Input>
                                    <Input
                                        ref='ponyKind'
                                        type='select' label='Вид' placeholder='select'>
                                {this.state.ponyKinds.map((kind)=> {
                                    return (
                                        <option key={kind} selected={kind} value={kind}>{kind}</option>
                                    )
                                })}
                                        <option selected value=''>...</option>
                                    </Input>
                                    <Input
                                        ref='ponyIsNew'
                                        type='select' label='Новинка' placeholder='select'>
                                        <option value={true}>да</option>
                                        <option value={false}>нет</option>
                                        <option selected value=''>...</option>
                                    </Input>
                                </Col>
                                <Col xs={6}>
                                    <Input
                                        ref='ponyMinPrice'
                                        type='number' label='Цена min' placeholder=''>
                                    </Input>
                                    <Input
                                        ref='ponyMaxPrice'
                                        type='number' label='Цена max' placeholder=''>
                                    </Input>
                                    <Input
                                        ref='ponyCount'
                                        type='number' label='Сколько пони показать ?' placeholder=''>
                                    </Input>
                                </Col>
                            </Row>
                        </div>
                        <div>
                            {this.state.ponys.map((pony)=> {
                                return (
                                    <Well key={pony.id}>
                                        <div>
                                            <b>name: </b>{pony.name}</div>
                                        <div>
                                            <b>color:</b> {pony.color}</div>
                                        <div>
                                            <b>Kind:</b> {pony.kind}</div>
                                        <div>
                                            <b>Price:</b> {pony.price} рупий</div>
                                        <div>
                                            <b>новый ?</b>
                                            :{pony.is_new ? "ДА" : "НЕТ"}</div>
                                    </Well>

                                )
                            })}
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.close.bind(this)}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}


export default PonyApp;