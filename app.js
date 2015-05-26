var template = require('lodash.template')
var flatsheet = require('flatsheet-api-client')({
  host: 'http://data.seattle.io'
})

var blogsEl = document.getElementById('blogs')
var blogsWrapper = document.createElement('div')
var blogTemplate = template(document.getElementById('blog-template').innerHTML)

flatsheet.sheets.get('d19c8820-da46-11e4-8984-3b8d08e7c37f', getBlogs)

function getBlogs (error, response) {
  response.rows.sort(function (a, b) {
    var nameA = a.name.toLowerCase()
    var nameB = b.name.toLowerCase()
    if (nameA < nameB) return -1
    if (nameA > nameB) return 1
    return 0
  })
  blogsWrapper.innerHTML = blogTemplate({ blogs: response.rows })
  blogsEl.appendChild(blogsWrapper)
}