const express = require('express');
const router = express.Router();
const Author = require('../models/author')
const Book = require('../models/book')

// Show all Authors route
router.get('/', async (req, res) => {
    let searchOptions = {};
    if(req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i');
    }

    try {
        const authors = await Author.find(searchOptions);
        res.render('authors/index', { 
            authors: authors,
            searchOptions: req.query
        });
    } catch {
        res.redirect('/');
    }
});

// Show new Author page route
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() });
});

// Add new Author route
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    });

    try {
        const newAuthor = await author.save();
        res.redirect(`authors/${ newAuthor.id }`);
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        });
    }
});

// Get Author by Id route
router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        const books = await Book.find({ author: author.id }).limit(6).exec();
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })
    } catch(err) {
        console.log(err);
        res.redirect('/');
    }
});

// Show edit Author by Id route
router.get('/:id/edit', async (req, res) => {
    try{
        const author = await Author.findById(req.params.id);
        res.render('authors/edit', { author: author });
    } catch {
        res.redirect('/authors');
    }
});

// Update Author by Id route
router.put('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id);
        author.name = req.body.name;
        await author.save();
        res.redirect(`/authors/${ author.id }`);
    } catch {
        if (author == null) {
            res.redirect('/');
        } else {
            res.render('/authors/edit', {
                author: author,
                errorMessage: 'Error updating Author'
            });
        }
    }
});

// Delete Author route
router.delete('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id);
        await author.deleteOne();
        res.redirect('/authors');
    } catch {
        if (author == null) {
            res.redirect('/');
        } else {
            res.redirect(`/authors/${ author.id }`);
        }
    }
});

/* router.post('/', (req, res) => {
    const author = new Author({
        name: req.body.name
    });
    
    author.save()
    .then((newAuthor) => {
        res.render('authors');
    })
    .catch((err) => {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        });
    });
}); */

module.exports =  router;