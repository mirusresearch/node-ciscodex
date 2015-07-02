
#STYLE
------
4 space indents.  Use `babel-eslint` for static analysis.  Not picky about quotes.

#TRANSPILING
-----------
The source of this project is ES6 and meant to be transpiled to ES5 via Babel.

To that end, the ES6 source is kept in the `src` directory, and the transpiled source is kept in the `lib` directory.  The transpiled source is also used as the basis of the NPM distribution.

For development, here's the command used for transpilation:

     $ cd path/to/ciscodex
     $ babel ./src --watch --out-dir ./lib

Once you're transpiling like a fool, you can run the tests on change
of any file in the `lib` directory.  Just spin up `nodemon` in a separate
terminal.  Like so:

    nodemon --watch ./lib --exec jest ./lib/

And you're off to the races.  Godspeed!
