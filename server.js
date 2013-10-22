var request = require('request');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();


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
  site: {
    name: 'Seattle Blogs',
    description: 'A directory of Seattle-focused blogs.',
    url: 'http://seattle-blogs.herokuapp.com',
    api_url: 'http://seattle-blogs.herokuapp.com/api'
  }
});

app.get('/', function(req, res){
  res.render('index.ejs', { blogs: app.locals.blogs, site: app.locals.site });
});

app.get('/api', function(req, res){
  res.jsonp({
    meta: app.locals.site,
    resources: {
      blogs: '/api/blogs'
    }
  });
});

app.get('/api/blogs', function(req, res){
  res.jsonp({
    meta: app.locals.site,
    blogs: app.locals.blogs 
  });
});

app.get('/api/blog/:slug', function(req, res){
  findBlog(req.params.slug, function(blog){
    res.jsonp(blog);
  });
});

app.get('/api/blog/:slug/posts', function(req, res){
  findBlog(req.params.slug, function(blog){
    request.get(blog.feed, function(error, feedRequest, feedResponse){
      parser.parseString(feedResponse, function(parserError, parserResponse){
        blog.posts = parserResponse;
        res.jsonp(blog);
      });
    });
  });
});

app.listen(process.env.PORT || 5000);

function findBlog(slug, callback){
  app.locals.blogs.forEach(function(blog){
    if (slug === blog.slug){
      callback(blog);
    }
  });
}