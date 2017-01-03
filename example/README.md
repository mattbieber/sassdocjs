
# About

Documentation for sassdocjs example with some pointers.

## Template
The included Handlebars template is pretty straight-forward.  Feel free to create your own and reference `sassdocjs-data.js` as your datasource.

## Readme

Include a README.md (this document) at the root of your sass project and it will be used as the initial page in the documentation output.  It's a good place for a style guide or other such things (although a style guide is on the sassdocjs roadmap).    


![alt text](http://sassdocjs.com/readme-example.png "Our Project")	
## Themes
There's	 a very modest theming implementation, essentially editing some color & fonts.  Additionally, for now you'll need to add an entry in the templates' `js/themes.js` file.  See any of the `theme-*.scss` files for usage. 