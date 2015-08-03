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
    let colors = ['Зеленый', 'Красный', 'Синий', 'Желтый'];
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

let colors = _(ponys).pluck('color').uniq().value();
let kind = _(ponys).pluck('kind').uniq().value();
let filteredPonys = [];
let query = {};

function ponyFilter(where) {
    let q = {};

    query = where;

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

ponyFilter({});


let PonyStore = Object.assign({}, EventEmitter.prototype, {

    /**
     * Get the entire collection of TODOs.
     * @return {array}
     */
    getAll: function () {
        return ponys;
    },

    getFilteredPonys: function () {
        return filteredPonys;
    },

    getColors: function () {
        return colors;
    },

    getKinds: function () {
        return kind;
    },

    getSelected() {
        return query;
    },

    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },

    /**
     * @param {function} callback
     */
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