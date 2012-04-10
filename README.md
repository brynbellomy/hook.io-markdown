# hook.io-markdown

Extremely straightforward hook.io hook, but a few notes are in order --

1. Right now it only does GitHub-Flavored Markdown.
2. But on the bright side, at least it comes packaged with a copy of GitHub's
Markdown CSS.
3. The rendering is entirely courtesy of [isaacs/github-flavored-markdown](https://github.com/isaacs/github-flavored-markdown).  Thanks, bro.

To get started, either run `./bin/markdown --repl` or use the following code (which, for the record, is the contents of `./bin/markdown` verbatim):

```javascript
var MarkdownHook = require('../lib/markdown').Markdown;

var myhook = new MarkdownHook({
  name: "the-markdown-hook",
  debug: true
});

myhook.start();
```

Now spin up a vanilla hook in another terminal (should be simply `hookio --repl` from the terminal) and enter something like the following:

```javascript
hook.on('markdown::rendered', function(event) {
  console.log('Response:', event);
});

hook.emit('render-markdown',
  { markdown:'oh, but this is just my **favorite** time of year!',
    user:'some-github-user', repo:'some-repo', includeCSS:true });
```

You can omit any of the parameters for different effects.  You can even pass a string of Markdown instead of the config {object}.

