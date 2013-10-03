/* // not using these yet:
var request = require('request');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
*/

var fs = require('fs');
var express = require('express');
var app = express();

app.use('/public', express.static(__dirname + '/public'));

app.use(function loadBlogs(req, res, next){
  fs.readFile('data/blogs.json', function(err, data){
    app.locals.blogs = JSON.parse(data);
    next();
  });
});

app.locals({
  name: 'Seattle Blogs',
  description: 'A directory of Seattle-focused blogs.',
  url: 'http://seattle-blogs.herokuapp.com'
})

app.get('/', function(req, res){
  res.render('index.ejs', { blogs: app.locals.blogs });
});

app.get('/api/blogs', function(req, res){
  res.jsonp({
    meta: { 
      name: app.locals.name,
      description: app.locals.description,
      url: app.locals.url,
      count: app.locals.blogs.length
    },
    blogs: app.locals.blogs 
  });
});

/*
* todo: track posts of all the blogs.
*/

app.listen(process.env.PORT || 5000);
