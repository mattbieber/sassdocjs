define({
	project: {"name":"sassdocJs Example","logo":"http://sassdocjs.com/example1.png","description":"The example project.","version":"0.1.2","authors":["Matt Bieber<matt@daftscholars.com>"],"contributors":[""],"status":"In Testing","created":"2014-01-19T22:50:39.397Z","sassdocjs_version":"0.0.1"},
	data: [
    {
        "buffer": [],
        "items": [],
        "id": "test01.scss.1",
        "typeName": "SassDoclet",
        "name": "fixtures/test01.scss",
        "kind": "module",
        "filename": "test01.scss",
        "lineno": 5,
        "expectedItemCount": 1,
        "description": "Test fixture for sassdocjs tests\n",
        "prefix": null,
        "raw": [
            "",
            "Test fixture for sassdocjs tests",
            "@module fixtures/test01.scss"
        ],
        "sass": [],
        "context": 1
    },
    {
        "buffer": [],
        "items": [],
        "id": "test01.scss.2",
        "typeName": "SassDoclet",
        "name": "icon-sprite",
        "kind": "var",
        "filename": "test01.scss",
        "lineno": 7,
        "expectedItemCount": 1,
        "description": "backround image path to sprite file",
        "prefix": null,
        "raw": [
            " @var {String} backround image path to sprite file "
        ],
        "sass": "$icon-sprite:                           url('/images/sprite.png') no-repeat;",
        "type": "String",
        "context": 1
    },
    {
        "buffer": [],
        "items": [
            {
                "id": 2,
                "kind": "usedin",
                "type": "",
                "name": "header, shopping cart, sidebar",
                "description": "",
                "src": "@usedin header, shopping cart, sidebar",
                "paraminfo": {}
            }
        ],
        "id": "test01.scss.3",
        "typeName": "SassDoclet",
        "name": "sprite-count",
        "kind": "var",
        "filename": "test01.scss",
        "lineno": 13,
        "usedin": [
            "header",
            "shopping cart",
            "sidebar"
        ],
        "expectedItemCount": 2,
        "description": "number of sprites to expect in file",
        "prefix": null,
        "raw": [
            "",
            "@var {Number} number of sprites to expect in file",
            "@usedin header, shopping cart, sidebar"
        ],
        "sass": "$sprite-count:                          23;",
        "type": "Number",
        "context": 0
    },
    {
        "buffer": [],
        "items": [],
        "id": "test01.scss.4",
        "typeName": "SassDoclet",
        "name": "default-sprite",
        "kind": "var",
        "filename": "test01.scss",
        "lineno": 16,
        "expectedItemCount": 1,
        "description": "default sprite file to use",
        "prefix": null,
        "raw": [
            " @var {String} default sprite file to use "
        ],
        "sass": "$default-sprite:                        $icon-sprite;",
        "type": "String",
        "context": 1
    },
    {
        "buffer": [],
        "items": [
            {
                "id": 2,
                "kind": "usedin",
                "type": "",
                "name": "shopping cart",
                "description": "",
                "src": "@usedin shopping cart",
                "paraminfo": {}
            }
        ],
        "id": "test01.scss.5",
        "typeName": "SassDoclet",
        "name": "default-sprite-element-width",
        "kind": "var",
        "filename": "test01.scss",
        "lineno": 22,
        "usedin": [
            "shopping cart"
        ],
        "expectedItemCount": 2,
        "description": "with of sprited elements",
        "prefix": null,
        "raw": [
            "",
            "@var {Number} with of sprited elements",
            "@usedin shopping cart"
        ],
        "sass": "$default-sprite-element-width:          $icon-sprite-element-width;",
        "type": "Number",
        "context": 0
    },
    {
        "buffer": [],
        "items": [],
        "id": "test01.scss.6",
        "typeName": "SassDoclet",
        "name": "default-sprite-element-height",
        "kind": "var",
        "filename": "test01.scss",
        "lineno": 25,
        "expectedItemCount": 1,
        "description": "height of sprited elements",
        "prefix": null,
        "raw": [
            " @var {Number} height of sprited elements "
        ],
        "sass": "$default-sprite-element-height:         $icon-sprite-element-height;",
        "type": "Number",
        "context": 1
    },
    {
        "buffer": [],
        "items": [
            {
                "id": 1,
                "kind": "param",
                "type": "String",
                "name": "$item-position",
                "description": "acceptable values are horizontal or vertical",
                "src": "@param     $item-position {String} acceptable values are horizontal or vertical",
                "paraminfo": {}
            },
            {
                "id": 4,
                "kind": "param",
                "type": "Number",
                "name": "$sprite-width",
                "description": "optional if supplied this should be the number of total elements",
                "src": "@param     $sprite-width {Number} optional if supplied this should be the number of total elements",
                "paraminfo": {}
            },
            {
                "id": 5,
                "kind": "param",
                "type": "Bool",
                "name": "$sprite-height",
                "description": "use float vs. inline-block",
                "src": "@param     $sprite-height {Bool} use float vs. inline-block",
                "paraminfo": {}
            },
            {
                "id": 6,
                "kind": "example",
                "type": "",
                "name": "",
                "description": "background: sprite(24px, gray, mapicon);\n&:hover {\nbackground: sprite(24px, orange, mapicon);\n}\n",
                "src": "@example",
                "paraminfo": {}
            }
        ],
        "id": "test01.scss.7",
        "typeName": "SassDoclet",
        "name": "sprite",
        "kind": "mixin",
        "filename": "test01.scss",
        "lineno": 42,
        "expectedItemCount": 6,
        "description": "mixin for creating horizontal or vertical list of items\ne.g. floated DIV or LI elemenents for navigation or grouping\n",
        "prefix": null,
        "raw": [
            "",
            "mixin for creating horizontal or vertical list of items",
            "e.g. floated DIV or LI elemenents for navigation or grouping",
            "",
            "@param     $item-position {String} acceptable values are horizontal or vertical",
            "@param     $style-position {Number} margin to apply to right (horizontal) or bottom (vertical)",
            "@param     $image-file {Number} optional width",
            "@param     $sprite-width {Number} optional if supplied this should be the number of total elements",
            "@param     $sprite-height {Bool} use float vs. inline-block",
            "@example",
            "  background: sprite(24px, gray, mapicon);",
            "  &:hover {",
            "    background: sprite(24px, orange, mapicon);",
            "  }"
        ],
        "sass": "@mixin sprite($item-position: 0,\n              $style-position: 0,\n              $image-file: $default-sprite,\n              $sprite-width:  $default-sprite-element-width,\n              $sprite-height: $default-sprite-element-height)\n{\n  $pos-x: -1 * ($style-position * $sprite-width);\n  $pos-y: -1 * ($item-position * $sprite-height);\n\n  @debug $pos-x;\n  @debug $pos-y;\n  background: $image-file $pos-x $pos-y;\n}",
        "context": 0
    },
    {
        "buffer": [],
        "items": [
            {
                "id": 3,
                "kind": "param",
                "type": "String",
                "name": "$background-image",
                "description": "a background image url",
                "src": "@param      $background-image {String} a background image url",
                "paraminfo": {}
            },
            {
                "id": 2,
                "kind": "param",
                "type": "String|Color",
                "name": "$color",
                "description": "a string or hex/rgba color value to use for the border",
                "src": "@param      $color {String|Color} a string or hex/rgba color value to use for the border",
                "paraminfo": {}
            },
            {
                "id": 4,
                "kind": "returns",
                "type": "Style",
                "name": "",
                "description": "bordered left content",
                "src": "@returns {Style} bordered left content",
                "paraminfo": {}
            },
            {
                "id": 5,
                "kind": "example",
                "type": "",
                "name": "",
                "description": "makeborder($lastname: something);\n",
                "src": "@example",
                "paraminfo": {}
            }
        ],
        "id": "test01.scss.8",
        "typeName": "SassDoclet",
        "name": "makeborder",
        "kind": "mixin",
        "filename": "test01.scss",
        "lineno": 67,
        "expectedItemCount": 5,
        "description": "Creates a repeated border from an image\n",
        "prefix": null,
        "raw": [
            "",
            "Creates a repeated border from an image",
            "",
            "@param      $location {String} acceptable values are horizontal or vertical",
            "@param      $color {String|Color} a string or hex/rgba color value to use for the border",
            "@param      $background-image {String} a background image url",
            "",
            "@returns {Style} bordered left content",
            "@example",
            "  makeborder($lastname: something);"
        ],
        "sass": "@function makeborder($location,\n                     $color: transparent,\n                     $background-image: none)\n{\n  @return $color $background-image repeat-x $location;\n}",
        "context": 0
    },
    {
        "buffer": [],
        "items": [
            {
                "id": 1,
                "kind": "extends",
                "type": "",
                "name": "",
                "description": "%l-cleared-container",
                "src": "@extends %l-cleared-container",
                "paraminfo": {}
            }
        ],
        "id": "test01.scss.9",
        "typeName": "SassDoclet",
        "name": "listitem-base",
        "kind": "placeholder",
        "filename": "test01.scss",
        "lineno": 78,
        "expectedItemCount": 1,
        "description": "description for m-listitem-base.\n",
        "prefix": "module",
        "raw": [
            "",
            "description for m-listitem-base.",
            "@extends %l-cleared-container"
        ],
        "sass": "%m-listitem-base {\n  @extend %l-cleared-container;\n  width: 100%;\n  h3 {\n    margin: 12px 0px 10px 0px;\n    text-transform: uppercase;\n    font: fontconfig(22px, 400);\n  }\n}",
        "context": 0
    },
    {
        "buffer": [],
        "items": [],
        "id": "test01.scss.10",
        "typeName": "SassDoclet",
        "name": "listitem-location",
        "kind": "class",
        "filename": "test01.scss",
        "lineno": 91,
        "expectedItemCount": 0,
        "description": "description poop stuff it does\n",
        "prefix": "module",
        "raw": [
            "",
            "description poop stuff it does"
        ],
        "sass": ".m-listitem-location {\n  font: swt-fontconfig(72%, 600);\n  margin-top: 8px;\n}"
    },
    {
        "buffer": [],
        "items": [
            {
                "id": 1,
                "kind": "extends",
                "type": "",
                "name": "",
                "description": "%swm-ul-navigation",
                "src": "@extends %swm-ul-navigation",
                "paraminfo": {}
            }
        ],
        "id": "test01.scss.11",
        "typeName": "SassDoclet",
        "name": "menu-links",
        "kind": "id",
        "filename": "test01.scss",
        "lineno": 100,
        "expectedItemCount": 1,
        "description": "description poop stuff it does\n",
        "prefix": null,
        "raw": [
            "",
            "description poop stuff it does",
            "@extends %swm-ul-navigation"
        ],
        "sass": "#menu-links {\n  @extend %swm-ul-navigation;\n  position: absolute;\n  bottom:8px;\n  left: 294px;\n}",
        "context": 0
    },
    {
        "buffer": [],
        "items": [],
        "id": "test02.scss.1",
        "typeName": "SassDoclet",
        "name": "fixtures/test02.scss",
        "kind": "module",
        "filename": "test02.scss",
        "lineno": 7,
        "expectedItemCount": 1,
        "description": "Test fixture for sassdocjs tests\n",
        "prefix": null,
        "raw": [
            "",
            "",
            "Test fixture for sassdocjs tests",
            "",
            "@module fixtures/test02.scss"
        ],
        "sass": [],
        "context": 1
    },
    {
        "buffer": [],
        "items": [],
        "id": "test02.scss.2",
        "typeName": "SassDoclet",
        "name": "sprites-hash",
        "kind": "var",
        "filename": "test02.scss",
        "lineno": 9,
        "expectedItemCount": 1,
        "description": "lookup list for sprite positions",
        "prefix": null,
        "raw": [
            " @var {Object} lookup list for sprite positions "
        ],
        "sass": "$sprites-hash:",
        "type": "Object",
        "context": 1
    },
    {
        "buffer": [],
        "items": [
            {
                "id": 2,
                "kind": "param",
                "type": "String",
                "name": "$size",
                "description": "acceptable values are horizontal or vertical",
                "src": "@param     $size {String} acceptable values are horizontal or vertical",
                "paraminfo": {}
            },
            {
                "id": 5,
                "kind": "param",
                "type": "Number",
                "name": "$placement",
                "description": "optional if supplied this should be the number of total elements",
                "src": "@param     $placement {Number} optional if supplied this should be the number of total elements",
                "paraminfo": {}
            },
            {
                "id": 6,
                "kind": "param",
                "type": "Bool",
                "name": "$index-only",
                "description": "use float vs. inline-block",
                "src": "@param     $index-only {Bool} use float vs. inline-block",
                "paraminfo": {}
            }
        ],
        "id": "test02.scss.3",
        "typeName": "SassDoclet",
        "name": "sprite",
        "kind": "mixin",
        "filename": "test02.scss",
        "lineno": 44,
        "expectedItemCount": 6,
        "description": "mixin for creating horizontal or vertical list of items\ne.g. floated DIV or LI elemenents for navigation or grouping\n",
        "prefix": null,
        "raw": [
            "",
            "mixin for creating horizontal or vertical list of items",
            " e.g. floated DIV or LI elemenents for navigation or grouping",
            "",
            "@mixin     sprite",
            "@param     $size {String} acceptable values are horizontal or vertical",
            "@param     $color {Number} margin to apply to right (horizontal) or bottom (vertical)",
            "@param     $name {Number} optional width",
            "@param     $placement {Number} optional if supplied this should be the number of total elements",
            "@param     $index-only {Bool} use float vs. inline-block"
        ],
        "sass": "@function sprite(\n\n$size:      32px,\n$color:     black,\n$name:      none,\n$placement: left,\n$index-only: false\n) {\n\n  $image: transparent url('/Content/Images/sprites-#{$size}.png') no-repeat;\n  $offset: $size;\n  $icon-multipliers: black 0, gray 1, orange 2;\n\n  $multiplier: 1;\n\n  @each $m in $icon-multipliers {\n    @if $color == nth($m, 1) {\n      $multiplier: nth($m, 2);\n    }\n  }\n\n  $position: -1;\n\n  @each $s in $sprites-hash {\n    @if $name == nth($s, 1) { $position: nth($s, 2); }\n  }\n\n  $p: $position - 1;\n  $a: $offset * 2;\n  $x: $a * $p;\n  $y: ($a * $sprite-count) * $multiplier;\n  $z: ($y + $x) * -1;\n\n  @if $name == arrowback {\n    @debug $name;\n    @debug $color;\n    @debug $position;\n    // @debug $offset;\n    @debug $p;\n    @debug $multiplier;\n    @debug $x;\n    @debug $y;\n    @debug $z;\n  }\n  //@debug $z;\n\n  @if($index-only == true) {\n    @return $z;\n  } @else {\n    @return $image 0px $z;\n  }\n}",
        "context": 0
    }
],
	readme: "<h1 id=\"about\">About</h1>\n<p>Documentation for sassdocjs example with some pointers.</p>\n<h2 id=\"readme\">Readme</h2>\n<p>Include a README.md (this document) at the root of your sass project &amp; it will be used as an initial page in the documentation output. Maybe a good place for a style guide or other such thing (although a style guide is on the sassdocjs roadmap).    </p>\n<p><img src=\"http://sassdocjs.com/readme-example.png\" alt=\"alt text\" title=\"Our Project\">    </p>\n<h2 id=\"themes\">Themes</h2>\n<p>There&#39;s     a very modest theming implementation, essentially editing some colors &amp; fonts in .  Additionally  </p>\n"
});