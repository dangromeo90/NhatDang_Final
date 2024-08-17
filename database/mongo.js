const mongoose = require('mongoose');

class Mongo {
    constructor() {
        this._connect();
    }

    _connect() {
        mongoose.connect('mongodb://localhost:27017/finalGraphql', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => {
            console.log('Kết nối CSDL thành công');
        })
        .catch(err => {
            console.error('Lỗi kết nối CSDL:', err.message);
        });
    }
}

module.exports = new Mongo();
