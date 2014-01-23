#![sassdocJs](http://sassdocjs.com/sassdocjs-g.png)

## Getting Started

sassdocJs is a [nodejs][1] command-line (CLI) app that will parse [jsDoc][2] style comments* found in your `.scss` source files, and use them to create a structured set of Html-based documentation. It's aim is to provide an easy way to catalog your growing library of sass mixins, functions, placeholders, etc, while complimenting whatever workflow, or Sass/Css/OOCSS standardization you may have adopted.   
 
I've tried to keep things extensible: there's a default set of 'language definitions', such as `@mixin`, `%placeholder`, or `#id`, but it's simple to construct custom definitions. A theme-able Html/Handlebars.js template is included. Finally, the parsed documentation result is saved as plain JSON, so you can easily work it into whatever front-end you fancy. 

>  Features

 - Document OOCSS-style naming conventions (BEM, [SMACSS][3], custom)
 - Extensible with custom doc tags
 - Saved as JSON - use the included template or your own
 
   [1]: http://nodejs.org
   [2]: http://usejsdoc.org
   [3]: http://http://smacss.com

\*currently not `//` comments - see *known issues* below.

## Installation

sassdocJs is built with nodeJs & can be installed with [npm][4] 

   [4]: https://npmjs.org/
    
```bash
$ npm install -g sassdocjs
```

#### Clone or fork on GitHub  

```bash
$ git clone git://github.com/mattbieber/sassdocjs.git
```

## Usage

To use sassdocJs, open up a shell and run the following command. 

```bash
$ sassdocjs [path] [options]
```

With no arguments , sassdocJs will recursively search the current directory for Sass source files, and output generated documentation to `./doc`

#### Options

There's a fair amount of configuration switches, see below on how to supply them via a config file.

Option       | Description
------------ | ----------------------------------------------- 
-n, –name    | name of the project
-u, –logo    | logo file url to appear in documentation header
-d, –desc    | project description
-v, –version | version of the documentation
-a, –auth    | project author(s)
-b, –contrib | project contributors
-s, –status  | project status
-x, –exclude | file pattern for exclusion
-i, –include | file pattern for inclusion
-o, –out     | path to write generated docs to
-t, –templ   | path to output template directory
-r, –recurse | recurse working directory for sass sources
-p, –prefix  | categorize by prefix (e.g. <code>m-</code> = module)
-c, –config  | save .yml config file in working directory<code>true</code>
-l, –log     | toggle logging
-y, –verbose | logging verbosity
-m, –limit   | set the allowed file parsing concurrency
-h, –help    | show sassdocjs usage options

#### Options config file

> You can simplify configuration by putting a [YAML][6] config file - `config.yml` - at the root of your projects’ 	ource folder. See the one included in the example for file’s layout, or run `sassdocjs --config` and fill out the created file. 

   [6]: http://www.yaml.org/

## Language Definitions

When parsing files, sassdocJs pulls out comments using 'definitions' found in `lib/lang/defs`. Definitions can be supplied for both in-comment tags, or for a keyword prefix character, as in `#` and `%`, for Css Ids and Sass placeholders. The following are provided: 

  * `$` Sass variable
  * `%` Sass placeholder
  * `.` Css class
  * `#` Css Id
  * `@` Sass mixin/function
  * `@module` Define a file as a module
  * `@param` Sass mixin/function argument
  * `@returns` Sass mixin/function return value
  * `@example` Code example
  * `@usedin` Location(s) the documented item can be found

It’s fairly trivial to supply your own documentation tag definitions should you wish. Any `def_*.js` file found by the parser will be included as a definition and have it's rules applied during validation. Definition files should implement `lib/lang/defs/_def.js`. 


```javascript

/**
 * language definition file for a Sass mixin
 * http://sass-lang.com/documentation/file.SASS_REFERENCE.html#mixins
 *
 * @module lib/lang/defs/def_mixin
 */

var _sd = require('../../env/const'),
    definitionBase = require('./_def').definitionBase;

/**
 * @constuctor
 */
function _lang_def() {

    /* implement base */
    definitionBase.call(this, {
        type_def: 'mixin',
        value: 64, //@
        name_position: 2,
        context: _sd.CONTEXT.FIRST_CLASS,
        canHaveValue: _sd.VALIDATION.REQUIRED,
        canHaveDescription: _sd.VALIDATION.OPTIONAL,
        canHaveMeta:  _sd.VALIDATION.OPTIONAL

    });

    /* definitions must implement validate */
    this.validate = function() {

    };


/* exports */
module.exports = new _lang_def();

```

## OOCSS Naming Conventions

With the `--prefix` option, sassdocJs will parse and group your files according to word prefix entries placed in `lib/lang/prefix.js`. I've included SMACSS-ish entries, but anything can be supplied.
    
```javascript

  module.exports = {
  
  	// smacss
  	'm-'    :   'module',
  	'l-'    :   'layout',
  	's-'    :   'state',
  	'is-'   :   'state'
  };

```    

> The prefixed grouping is called 'category' in the docs

#### More info

A few resources regarding OOCSS-style naming:   

  - [SMACSS.com][7] 
  - [Taking Sass to the Next Level with SMURF and @extend ][8] 
  - [Fifty Shades of BEM][9]
  
   [7]: http://smacss.com/
   [8]: http://railslove.com/blog/2012/11/09/taking-sass-to-the-next-level-with-smurf-and-extend
   [9]: http://blog.kaelig.fr/post/48196348743/fifty-shades-of-bem

## Use Location

You can provide an `@usedin` entry in your comment block with a comma-separated value of locations (e.g. header, shopping cart, home page). sassdocJs will include that as a grouping option in the generated docs.

> The use location grouping is called 'used' in the docs

## Template

The included Handlebars template is pretty straight-forward. It uses the generated `sassdocjs-data.js` as it's data source. I've included some rudimentary themeing ability which you can find in the `./Sass` directory. See one of the existing theme files for reference. 

If you do customize, you'll want to run `$ grunt build` in the template directory to compile the Sass and move it to the build folder. 

## Test

You can run the included test with make or grunt:
    
    $make / $grunt test

Additional fixtures can be put in `./test/parse.spec.js`

## Examples

For eample useage, please see the commented Sass source and Yaml config file in `./example`. 

## Known Issues

*I went with jsDoc-style comments for the simple reason that I prefer them to the Sass `//` variety. The (obvious) drawback is that the Sass compiler won't strip these out upon compilation. I've got some ideas in mind for this on the roadmap, but please contribute if you wish. I also decided to eschew support for the older syntax style (.sass). Feel free to fork the repo and add it. 

This is 0.1.0 code - please get in touch with any issues you encounter.

> _Note:_ This has been minimally tested in Windows

## Roadmap

Following is what's planned.

  * Add support for standard Sass `//` comment blocks.
  * Ability to strip sassdocJs comment blocks `//* */` on save so they don't end up in the pre-compiled Sass files.
  * Move name prefixing setting to config file.

## About

Licensed under the [MIT License (MIT)][lic]

  [lic]: http://opensource.org/licenses/MIT
  
Website: [sassdocjs.com][sd]
  
  [sd]: http://sassdocjs.com

            
            
