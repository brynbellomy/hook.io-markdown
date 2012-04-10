var Hook = require('hook.io').Hook,
    util = require('util'),
    async = require('async');

var Markdown = exports.Markdown = function (options) {

  var self = this;
  Hook.call(self, options);

  self.config.use('file', { file: './config.json' });
  
  self.on('hook::ready', function () {
    self.on('render-markdown', self.parseMarkdown);
    self.on('*::render-markdown', self.parseMarkdown);
  });
};

//
// Inherit from `hookio.Hook`
//
util.inherits(Markdown, Hook);

Markdown.prototype.parseMarkdown = function (event) {
  var self = this,
      includeCSS = false,
      processorFns = [],
      md, user, repo;


  if (!!event && typeof event == 'string') {
    md = event;
  }
  else if (!!event.markdown && typeof event.markdown == 'string') {
    md = event.markdown;

    if (event.user && event.repo) {
      user = event.user;
      repo = event.repo;
    }

    if (event.includeCSS === true) {
      includeCSS = true;
    }
  }
  else {
    return self.emit('error', { error: 'Couldn\'t find Markdown to render, genius.' });
  }

  processorFns.push(self.parseToGithubFlavoredMarkdown.bind(self, user, repo, md));
  if (includeCSS) {
    processorFns.push(self.addStylesheetsAndHTMLLayout);
  }

  var toReturn = {};
  async.waterfall(
    processorFns,
    function (err, rendered) {
      if (err) {
        return self.emit('error', { error: err });
      }
      
      return self.emit('markdown::rendered', { original: md, rendered: rendered });
    });
}

Markdown.prototype.addStylesheetsAndHTMLLayout = function (html, cb) {
  html = '<article class="markdown-body entry-content" itemprop="mainContentOfPage">' + html + '</article>';

  var css = require('fs').readFileSync(__dirname + '/github.css');
  html = '<html><head><style>' + css + '</style></head><body>' + html + '</body></html>';
  cb(null, html);
}

Markdown.prototype.parseToGithubFlavoredMarkdown = function (user, repo, md, cb) {
  var repoAndOwner = (user && repo ? [user, repo].join('/') : undefined);

  var ghm = require('github-flavored-markdown');
  var rendered = ghm.parse(md, repoAndOwner);
  cb(null, rendered);
}



