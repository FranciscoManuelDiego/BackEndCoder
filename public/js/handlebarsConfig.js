const exphbs = require('express-handlebars');

const handlebars = exphbs.create({
        runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    helpers: {
        getProperty: function(obj, key) {
            return obj[key];
        },
    },
});

module.exports = handlebars;