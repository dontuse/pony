"use strict";

import React from 'react';
import {Modal,Button, Input, Grid, Row, Col, Well} from 'react-bootstrap';
import _ from 'lodash';
//import ponys from './ponys.json';
let EventEmitter = require('events').EventEmitter;

let ponys = [];

/*----------------------*/

(function () {
    let names = ['Гуфи', 'Нина', 'Марина', 'Франклибукирун', 'Малышок', 'Бетман', 'Спуди'];
    let colors = ['Зеленый', 'Красный', 'Синий', 'Желтый'];
    let kinds = ['Земная пони', 'Единорог', 'Пегас' , 'Аликорн'];
    let isNew = [true , false];

    for (let i = 0; i < 1000; i++) {
        let pony = {
            "name": names[Math.floor(Math.random() * names.length)],
            "color": colors[Math.floor(Math.random() * colors.length)],
            "kind": kinds[Math.floor(Math.random() * kinds.length)],
            "price": _.random(1, 1000000, 2).toFixed(2),
            "is_new": isNew[Math.floor(Math.random() * isNew.length)],
            "id" : i
        };

        ponys.push(pony)
    }
}());

/*------------------------*/

let actions = new EventEmitter();
let viewEmiter = new EventEmitter();


let colors = _(ponys).pluck('color').uniq().value();
let kind = _(ponys).pluck('kind').uniq().value();

console.log(colors);
console.log(kind);


function ponyFilter(where) {
    let q = {};
    let filteredPonys;

    where.minPrice = where.minPrice || 0;
    where.maxPrice = where.maxPrice || Number.MAX_SAFE_INTEGER;
    where.count = where.count || 20;


    _.forEach(where, (val, index) => {
        if (!(val === "") && !(index === "maxPrice") && !(index === "minPrice") && !(index === "count")) {
            q[index] = val;
        }
    });

    console.log('query', q);

    filteredPonys = _.where(ponys, q).filter((pony) => {
        return (pony.price >= where.minPrice && pony.price <= where.maxPrice)
    });

    filteredPonys = _.sample(filteredPonys, where.count);

    return filteredPonys;
}

actions.on('ponyFilter', (obj) => {
    let ponys = ponyFilter(obj);
    viewEmiter.emit('updateView', ponys);
});


class PonyApp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            ponys: []
        };
        this.ponyColors = colors;
        this.ponyKinds = kind;

        viewEmiter.on('updateView', (ponys)=> {
            this.setState({
                ponys: ponys
            });
        });
    }

    componentWillMount() {
        actions.emit('ponyFilter', {});
    }

    close() {
        console.log('close');
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

        if(is_new === "true") {
            is_new = true
        }
        else if (is_new === "false") {
            is_new = false
        }

        actions.emit('ponyFilter', {color, kind, maxPrice, minPrice, is_new , count});
    }

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
                                {this.ponyColors.map((color)=> {
                                    return (
                                        <option key={color} selected={color} value={color}>{color}</option>
                                    )
                                })}
                                        <option selected value=''>...</option>
                                    </Input>
                                    <Input
                                        ref='ponyKind'
                                        type='select' label='Вид' placeholder='select'>
                                {this.ponyKinds.map((kind)=> {
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
                                            {console.log(pony.is_new)}
                                            <b>новый ?</b>:{pony.is_new ? "ДА" : "НЕТ"}</div>
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



React.render(<PonyApp></PonyApp>, document.getElementById('app'));