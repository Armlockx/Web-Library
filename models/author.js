const mongoose = require('mongoose');
const Book = require('./book');

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})
/*
authorSchema.pre('remove', function(next) {
    Book.find({ author: this.id }, (err, books) => {
        if (err) {
            next(err)
        } else if (books.length > 0) {
            next(new Error('Author has books still'));
        } else {
            next()
        }
    })
})
*/
authorSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    try {
        //const query = this.getFilter();
        const books = await Book.find({ author: this.id }).exec();
        console.log(books);
        if (books.length > 0) {
            next(new Error('Author has books still'));
        } else {
            next();
        }
    } catch (err) {
        console.log(err);
        next(err);
    }
});

module.exports = mongoose.model('Author', authorSchema);