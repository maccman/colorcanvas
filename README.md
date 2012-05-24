# ColorCanvas

A canvas based color picker. [Demo](http://maccman.github.com/colorcanvas).

![ColorCanvas](http://img.svbtle.com/maccman-24081757269480-raw.png)

## Usage

Include the two scripts, `lib/colorcanvas.js` and `lib/colorcanvas.input.js` inside your page.

    <head>
      <script src="lib/colorcanvas.js"></script>
      <script src="lib/colorcanvas.input.js"></script>
    </head>

Any color inputs will now automatically be shimmed.

    <input type="color" value="#FF0000">

You may also want to include the default styles, located in `site/styles.css`.

## Building

You can build ColorCanvas using [Ruby's Bundler](http://gembundler.com/).

    bundle install
    rake build

## Acknowledgments

Many thanks to [Jeremy Apthorp](http://nornagon.net/) for advice and bug fixing.