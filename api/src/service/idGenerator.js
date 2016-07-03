var uuid = require('uuid4');
var config = require('../config');

var uuidGenerator = {
    generate: function () {
        return uuid();
    }
};

var increment = 1;
var incrementalTestGenerator = {
    generate: function () {
        return increment ++;
    }
};


module.exports = config.test ? incrementalTestGenerator : uuidGenerator;
