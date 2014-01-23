require.config({
	paths: {
		jquery: 	  	'../lib/jquery/jquery',
		underscore: 	'../lib/underscore-amd/underscore',
		handlebars: 	'../lib/handlebars/handlebars',
		handlebarsEx: 	'./helpers',
		appdata: 		'./app-data',
		hljs: 			'./highlight/highlight.pack'
	},
	shim: {
		handlebars: {
			exports: 'Handlebars'
		},
		handlebarsEx: {
			deps: ['handlebars', 'hljs'],
			exports: 'Handlebars'
		}	
	},
	urlArgs: 'v=' + (new Date()).getTime()
});

/**
 *
 */
require([
	'jquery',
	'underscore',
	'handlebarsEx',
	'appdata',
	'sassdocjs-data.js',
	'js/themes.js'
], function($, _, Handlebars, appdata, sassdocjs, themes) {

	appdata.init(sassdocjs.data);

	$.fn.render = function(html, callback) {
    	this.html(html);
    	if(callback) { callback(); }
    };

	var GROUPINGS = {
		KIND: 'kind',
		NAME: 'name',
		FILENAME: 'filename',
		PREFIX: 'prefix',
		USEDIN: 'usedin'
	};

	var $frame  = $('html, body'),
		$themecss = $('#themecss'),
		$settingsThemeLinks = $('.settings-themelink');

	var $pageProject = $('#project'),
		$pageGroups = $('#groups'),
		$pageSideNav = $('#sidebar'),
		$pageoverview = $('#overview');


	var $tmplProject = $('#tmpl-project'),
		$tmplGroups =  $('#tmpl-groups'),
		$tmplSideNav = $('#tmpl-sidebar');

	/* partials */
	var $partParams = $('#part-params'),
		$partReturns = $('#part-returns'),
		$partExample = $('#part-example');
		
	Handlebars.registerPartial('params', $partParams.html());
	Handlebars.registerPartial('returns', $partReturns.html());
	Handlebars.registerPartial('example', $partExample.html());

	var tmplProject  = Handlebars.compile($tmplProject.html());
	var	tmplSideNav  = Handlebars.compile($tmplSideNav.html());
	var	tmplGroups   = Handlebars.compile($tmplGroups.html());

	var filters = {
		settings: { label: 'Settings', property: 'settings', abbr: 'S', icon: 'icon-cog', current: false },
		overview: { label: 'Overview', property: 'overview', abbr: 'R', icon: 'icon-info-large', current: true },
		kind: { label: 'Kind', property: 'kind', abbr: 'K', icon: 'icon-uniF57B', current: false },
		name: { label: 'Name', property: 'name', abbr: 'N', icon: 'icon-sort-alphabetically', current: false },
		filename: { label: 'File', property: 'filename', abbr: 'F', icon: 'icon-copy', current: false },
		prefix: { label: 'Category', property: 'prefix', abbr: 'C', icon: 'icon-point-of-interest', current: false },
		usedin: { label: 'Used', property: 'usedin', abbr: 'U', icon: 'icon-location-arrow', current: false }
	};

	var _byKind   = appdata.groupProp('kind');
	var _byName   = appdata.groupAlpha('name');
	var _byFile   = appdata.groupProp('filename');
	var _byPrefix = appdata.groupProp('prefix');
	var _byUsedIn = appdata.groupContains('usedin');

	var _byUsedIn = _.filter(_byUsedIn, function(group){
		if(group.key == 'null') { return false; };
		if(group.key == 'undefined') { return false; };
		return true;
	});

	var _byPrefix = _.filter(_byPrefix, function(group){
		if(group.key == 'null') { return false; }
		if(group.key == 'undefined') { return false; }
		return true;
	});


	var sectiondata = {
		kind: packageSection(_byKind),
		name: packageSection(_byName),
		prefix: packageSection(_byPrefix),
		usedin: packageSection(_byUsedIn),
		filename: packageSection(_byFile)
	};

	var _navdata = {
		kind: packageNav(_byKind),
		name: packageNav(_byName),
		filename: packageNav(_byFile),
		prefix: packageNav(_byPrefix),
		usedin: packageNav(_byUsedIn)
	};

	var navdata = {
		current: '',
		justify: 'j6',
		project: sassdocjs.project,
		themes: themes,
		filter: filters,
		data: _navdata
	};

	if(!localStorage.sjstheme) { localStorage.setItem('sjstheme', 'css/theme-default.css'); }
	if(!localStorage.sjsshowcode) { localStorage.setItem('sjsshowcode', 'no'); }

    /** package nav
     * --------------------------------------------- */
	function packageNav(data) {

		var result = [];
		_.each(data, function(group) {
			var k = group.key;
			result.push({
				name: k,
				kind: k,
				id: k,
				file: null
			});
			_.each(group.data, function(item) {
				result.push({
					name: item.name,
					kind: item.kind,
					id: item.id,
					file: item.filename
				});
			});
		});

		return result;
	}

    /** package section
     * --------------------------------------------- */
	function packageSection(data) {
  		return(data);
    }

    /** set group
     * --------------------------------------------- */
    function set_group(name, callback) {
    	
    	var label = filters[name].label;
	    var $page = $('.l-page');

	    $page.removeClass('disabled');

        if(name == 'overview') {
            $pageGroups.hide();
        	$pageoverview.html(sassdocjs.readme).show();
        } else {
            $pageoverview.hide();
            if(name == 'settings') { $page.addClass('disabled'); }
	        $pageGroups.html(tmplGroups(sectiondata[name], { data: { groupedBy: label }})).show(function(){
                $('.entry-code-link').on('click', function(e){
                    var _this = $(e.currentTarget);
                    var _txt = _this.find('.code-linktext');
                	var hidden = _txt.text() == 'hide' ? false : true;
                    if(hidden) {
                    	_this.next().slideDown(400);
                    	_txt.text('hide');
                    } else {
                    	_this.next().slideUp(400);
                    	_txt.text('show');
                    }



                    

                });
	            set_code(localStorage.sjsshowcode, function(){});
            });
        }

        var sidelabel = '#nav-' + name;
        $('#navtab-'+name).find('h3').text(label);
        $(sidelabel).addClass('active');

        callback();
    }

    /** set theme
     * --------------------------------------------- */
	function set_theme(theme, callback) {
		document.getElementById('themecss').setAttribute('href', theme);
		$('.settings-themelink').removeClass('selecteditem');
		$('.settings-themelink[data-theme="' + theme + '"]').addClass('selecteditem');
		callback();
	}

    /** code blocks
     * --------------------------------------------- */
	function set_code(val, callback) {
		var $indicator = $('.switch-selection');
		var $els = $('.entry-article-code');
		var $txt = $('.code-linktext');
		$indicator.removeClass('switch-selection-yes');
		$els.removeClass('code-open');

		if(val == 'yes') {
			$indicator.addClass('switch-selection-yes');
			$els.addClass('code-open');
			$txt.html('hide');
		} else {
			$txt.html('show');
		}

		callback();
	}

	$pageSideNav.render(tmplSideNav(navdata), function(){});
	$pageProject.append(tmplProject(sassdocjs.project));

	/* ------------------------------------------------------ */
	$(function() {
		set_theme(localStorage.getItem('sjstheme'), function(){});

		$('.options-closeclick').on('click', function(e){
			$('.clicknav').removeClass('active');
			$('.m-nav-toc-current').removeClass('m-nav-toc-current');
			set_group('overview', function() {
				$('#navtab-overview').addClass('m-nav-toc-current');
				$('#nav-overview').addClass('active');
			});
		});

		$('.clicknav').on('click', function(e){
			var tab = $(e.currentTarget).data('group');
			$('.clicknav').removeClass('active');
			$('.m-nav-toc-current').removeClass('m-nav-toc-current');

			set_group(tab, function() {
				$('#navtab-'+tab).addClass('m-nav-toc-current');
			});
		});

		$('.nav-href').on('click', function(e){

				e.preventDefault();
				
				var link = this.hash;
				var target = $(link);

				target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
				if (target.length) {
					$frame.animate({
						scrollTop: target.offset().top
					},{ duration: 450
					});
				}

				return false;
		});
		$('.settings-themelink').on('click', function(e){
			var theme = $(e.currentTarget).data('theme');
			set_theme(theme, function(){
				localStorage.setItem('sjstheme', theme);
			});
		});
		$('.switch-link').on('click', function(e){
			var showcode = $(e.currentTarget).data('val');
			set_code(showcode, function(){
				localStorage.setItem('sjsshowcode', showcode);
			});
		});

		var startgroup = 'overview';
		set_group(startgroup, function(){
			$('#navtab-' + startgroup).addClass('m-nav-toc-current');
		});
	});
});
