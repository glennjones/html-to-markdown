const { version } = require('../package.json');

module.exports = {
    swaggerOptions: {
        info: {
            title: 'HTML to Markdown',
            version: version,
        },
    }
};