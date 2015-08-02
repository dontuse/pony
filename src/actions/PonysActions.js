import AppDispatcher from '../AppDispatcher.js';
//var TodoConstants = require('../constants/TodoConstants');

var PonysActions = {

    filter: function(query) {
        AppDispatcher.dispatch({
            actionType: 'filter',
            query: query
        });
    }
};

export default PonysActions;