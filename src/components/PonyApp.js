"use strict";

import React from 'react';
import {Modal,Button, Input, Grid, Row, Col, Well, PageHeader , Nav, NavItem} from 'react-bootstrap';

import PonyStore from '../stores/PonyStore.js';
import PonysActions from '../actions/PonysActions.js';


class PonyApp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            selected: PonyStore.getSelected(),
            ponys: PonyStore.getFilteredPonys(),
            ponyColors: PonyStore.getColors(),
            ponyKinds: PonyStore.getKinds()
        };

        console.log(this.state.selected);
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
            <section className="container">
                <PageHeader>Pony Land</PageHeader>
                <div className="row">

                    <div className="col-md-3">
                        <Nav bsStyle='pills' stacked activeKey={1} onSelect={function () {
                        }}>
                            <NavItem eventKey={1} href='/home'>NavItem 1 content</NavItem>
                            <NavItem eventKey={2} title='Item'>NavItem 2 content</NavItem>
                            <NavItem eventKey={3} disabled>NavItem 3 content</NavItem>
                        </Nav>
                    </div>
                    <div className="col-md-9">
                        <Well>
                            <a onClick={this.open.bind(this)} href="">Позови пони</a>

                            <a onClick={this.open.bind(this)} href="">Позови пони Еще как то</a>
                        </Well>


                        <div onChange={this.filter.bind(this)}>


                            <Row>
                                <Col xs={6}>
                                    <Input
                                        defaultValue={this.state.selected.color}
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
                                        defaultValue={this.state.selected.kind}
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
                                        defaultValue={this.state.selected.is_new}
                                        ref='ponyIsNew'
                                        type='select' label='Новинка' placeholder='select'>
                                        <option value={true}>да</option>
                                        <option value={false}>нет</option>
                                        <option selected value=''>...</option>
                                    </Input>
                                </Col>
                                <Col xs={6}>
                                    <Input
                                        defaultValue={this.state.selected.minPrice}
                                        ref='ponyMinPrice'
                                        type='number' label='Цена min' placeholder=''>
                                    </Input>
                                    <Input
                                        defaultValue={this.state.selected.maxPrice}
                                        ref='ponyMaxPrice'
                                        type='number' label='Цена max' placeholder=''>
                                    </Input>
                                    <Input
                                        defaultValue={this.state.selected.count}
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


                        <Modal bsSize='large' show={this.state.showModal} onHide={this.close.bind(this)}>
                            <Modal.Header>
                                <Modal.Title>Купи пони</Modal.Title>
                            </Modal.Header>

                            <Modal.Body>
                                d
                            </Modal.Body>

                            <Modal.Footer>
                                <Button onClick={this.close.bind(this)}>Close</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
            </section>
        );
    }
}


export default PonyApp;