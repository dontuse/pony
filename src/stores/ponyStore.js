"use strict";

import AppDispatcher from '../AppDispatcher';
import {EventEmitter} from 'events';
import assign from 'object-assign';
import _ from 'lodash';
//var TodoConstants = require('../constants/TodoConstants');

var CHANGE_EVENT = 'change';

let ponys = [];

/*----------------------*/

(function () {
    let names = ['Гуфи', 'Нина', 'Марина', 'Франклибукирун', 'Малышок', 'Бетман', 'Спуди'];
    let colors = ['Зеленый', 'Красный', 'Синий', 'Желтый', 'Алый'];
    let kinds = ['Земная пони', 'Единорог', 'Пегас', 'Аликорн'];
    let isNew = [true, false];

    for (let i = 0; i < 1000; i++) {
        let pony = {
            "name": names[Math.floor(Math.random() * names.length)],
            "color": colors[Math.floor(Math.random() * colors.length)],
            "kind": kinds[Math.floor(Math.random() * kinds.length)],
            "price": _.random(1, 1000000, 2).toFixed(2),
            "is_new": isNew[Math.floor(Math.random() * isNew.length)],
            "id": i
        };

        ponys.push(pony)
    }
}());

/*------------------------*/

let colors = _(ponys).pluck('color').uniq().sort().value();
let kind = _(ponys).pluck('kind').uniq().sort().value();

let filteredPonys = [];
let query = {};

function ponyFilter(query) {
    let q = {};

    query = query;

    query.minPrice = query.minPrice || 0;
    query.maxPrice = query.maxPrice || Number.MAX_SAFE_INTEGER;
    query.count = query.count || 20;

    let {maxPrice,minPrice,count,kind,color} = query;

    console.log(maxPrice,minPrice,count,kind,color);


    _.forEach(query, (val, index) => {
        if (!(val === "") && !(index === "maxPrice") && !(index === "minPrice") && !(index === "count")) {
            q[index] = val;
        }
    });

    console.log('query', q);

    filteredPonys = _.where(ponys, q).filter((pony) => {
        return (pony.price >= query.minPrice && pony.price <= query.maxPrice)
    });

    filteredPonys = _.sample(filteredPonys, query.count);

    return filteredPonys;
}

function saveFilterParams() {
    localStorage.setItem("ponyFilter", query);
}

ponyFilter({});


let PonyStore = Object.assign({}, EventEmitter.prototype, {

    getAll: function () {
        return ponys;
    },

    getFilteredPonys () {
        saveFilterParams();
        return filteredPonys;
    },

    getColors() {
        return colors;
    },

    getKinds() {
        return kind;
    },

    getSelected() {
        return query;
    },

    emitChange() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

// Register callback to handle all updates
AppDispatcher.register(function (action) {

    switch (action.actionType) {
        case "filter":
            ponyFilter(action.query);
            PonyStore.emitChange();
            break;
        default:
        // no op
    }
});

export default PonyStore;