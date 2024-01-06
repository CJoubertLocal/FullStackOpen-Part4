const blogRouter = require('express').Router()
const Blog = require('../models/blogs')

blogRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
})

blogRouter.post('/', (request, response) => {
    console.log("req body", request.body)
    const blog = new Blog(request.body)
    console.log("blog", blog)

    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })
})

module.exports = blogRouter