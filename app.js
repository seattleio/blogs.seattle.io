var template = require('lodash.template');
var flatsheet = require('flatsheet')();

var blogsEl = document.getElementById('blogs');
var blogsWrapper = document.createElement('div');
var blogTemplate = template(document.getElementById('blog-template').innerHTML);

flatsheet.sheet('bbn6_tq9_qcqcfb6yi1w-g', getBlogs);

function getBlogs (error, response) {
  blogsWrapper.innerHTML = blogTemplate({ blogs: response.rows });
  blogsEl.appendChild(blogsWrapper);
}