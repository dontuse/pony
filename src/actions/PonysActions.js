import AppDispatcher from '../AppDispatcher.js';
//var TodoConstants = require('../constants/TodoConstants');

var PonysActions = {
    filter: function(query) {
        console.log('filter action');
        AppDispatcher.dispatch({
            actionType: 'filter',
            query: query
        });
    }
};

export default PonysActions;