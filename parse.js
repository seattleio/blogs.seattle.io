var fs = require('fs');
var request = require('request');
var xml2js = require('xml2js');
var exists = require('string-exists');
var neighborhoods = require('./data/neighborhoods');


fs.readFile('data/blogs.json', function(err, data){
  blogs = JSON.parse(data);
  console.log(blogs.length)
  blogs.forEach(function(blog, i){
    getBlogPosts(blog, function(posts){
      blog.posts = posts;
      //console.log(blog)
    });
  });
});

function getBlogPosts(blog, callback){
  request.get(blog.feed, function(feedError, feedRequest, feedResponse){
    var parser = new xml2js.Parser();
    var posts = [];
    var type = ''

    parser.parseString(feedResponse, function(parserError, parserResponse){
      if (parserResponse.rss){
        posts = parserResponse.rss.channel[0].item;
        type = 'rss';
      } else if (parserResponse.feed) {
        posts = parserResponse.feed.entry;
        type = 'feed';
      }

      parsePosts(posts, type, callback);
    });
  });
}

function parsePosts(posts, type, callback){
  var postsResponse = [];

  posts.forEach(function(post, i){
    postsResponse[i] = {};

    if (type === 'feed'){
      postsResponse[i].title = post.title[0]['_'];
      postsResponse[i].url = post.link[4]['$'].href;
      postsResponse[i].content = post.content[0]['_'];
    } else if (type === 'rss') {
      postsResponse[i].title = post.title[0];
      postsResponse[i].url = post.link[0];
      if (post['content:encoded']) {
        postsResponse[i].content = post['content:encoded'][0];
      } else {
        if (post.description){
          postsResponse[i].content = post.description[0];
        } else {
          postsResponse[i].content = '';
        }
      }
    }

  });

  callback(postsResponse);
}

function truncateContent(content){

}

function findAddress(text){

}

function findNeighborhood(text){
  var matches = exists(neighborhoods, text)
}