define([
	'underscore',
    'handlebars',
    'hljs'
], function(_, Handlebars, hljs) {


	/* ------------------------------------------------------------- */
	Handlebars.registerHelper('grouping', function(context, options) {
		return options.data.groupedBy;
	});

	/* ------------------------------------------------------------- */
	Handlebars.registerHelper('grouplabel', function(context, options) {
		return this.key;
	});

	/* ------------------------------------------------------------- */
	Handlebars.registerHelper('syntax', function(text){
		var result = hljs.highlight('scss', text, true);
		return new Handlebars.SafeString(result.value);
	});

	/* ------------------------------------------------------------- */
	Handlebars.registerHelper('sprite', function(text){
		return text.charAt(0).toLowerCase();
	});

	/* ------------------------------------------------------------- */

	/* ------------------------------------------------------------- */
	Handlebars.registerHelper('normalize', function(data){
		return encodeURI(data);
	
	});
	

	/* ------------------------------------------------------------- */
	Handlebars.registerHelper('underscoreToSpace', function(text){
		return text.replace(/(_+)/g, ' ');
	});

	/* ------------------------------------------------------------- */
	Handlebars.registerHelper('nodot', function(text){
		return text.replace(/\./g,'');
	});

	/* ------------------------------------------------------------- */
	Handlebars.registerHelper('assign', function(name) {
		if(arguments.length > 0)
		{
			var type = typeof(arguments[1]);
			var arg = null;
			if(type === 'string' || type === 'number' || type === 'boolean') arg = arguments[1];
			Handlebars.registerHelper(name, function() { return arg; });
		}
	  return '';
	});

	/* ------------------------------------------------------------- */
	Handlebars.registerHelper('nl2br', function(text) {
		return _handlebarsNewlineToBreak(text);
	});

	/* ------------------------------------------------------------- */
	Handlebars.registerHelper('if_eq', function(context, options) {
		if(context === options.hash.compare) return options.fn(this);
		return options.inverse(this);
	});


	/* ------------------------------------------------------------- */
	Handlebars.registerHelper('subTemplate', function(name, context) {
		var result = _.filter(this.items, function(item){
			return item.key == context.hash.kind;
		});

		if(result.length == 0) { return; }

		var $tmpl = $(name);
		var tmpl = Handlebars.compile($tmpl.html());

		var newcontext = {
			title: context.hash.title,
			kinds: result[0].data
		};

		return new Handlebars.SafeString(tmpl(newcontext));
	});

	/* ------------------------------------------------------------- */
	Handlebars.registerHelper('kindContext', function(options){
		var result = _.filter(this.items, function(item){
			return item.key == options.hash.name;
		});

		if(result.length == 0) { return; }
		return options.fn(result[0].data);


	});

	/* ------------------------------------------------------------- */
	Handlebars.registerHelper('toLowerCase', function(value) {
		return (value && typeof value === 'string') ? value.toLowerCase() : '';
	});

	/* ------------------------------------------------------------- */
	Handlebars.registerHelper('splitFill', function(value, splitChar, fillChar) {
		var splits = value.split(splitChar);
		
		return new Array(splits.length).join(fillChar) + splits[splits.length - 1];
	});

	/* ------------------------------------------------------------- */
	function _handlebarsNewlineToBreak(text)
	{
		return (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
	}

	return Handlebars;
});