/**
 * grouping & sorting
 */

define(['underscore'], function(_) {

	var _data = null;

	 var _init = function(data) {
        _.each(data, function(doc){
                if(doc.items.length > 0) {
				var _groupeditems = _group_prop_handler('kind', doc.items);
                doc.items = _groupeditems;
            }
        });
        _data = data;
    };

	/** basic sort ----------------------------------------------------- */
	var _sort = function(prop) {
        return _data.sort(function(a,b) { return a[prop].localeCompare(b[prop]); });
	};

	/** _group_fields ----------------------------------------------------- */
	var _group_fields = function(prop) {
		var result = _.pluck(_data, prop);
		return _.uniq(result, true);
	};

	/** _group_alpha ----------------------------------------------------- */
	var _group_alpha = function(prop){

		var result = [],
			_keys = [],
			_names = _.pluck(_data, prop);
			
		_.each(_names, function(n) { _keys.push(n.charAt(0).toUpperCase()); });
		_.each(_.uniq(_keys), function(k) {
			result.push({
				key: k,
				data: _.filter(_data, function(item){
					return item.name.charAt(0).toUpperCase() == k;
				})
			});
		});

		return result;
	};
	
	/** _group_prop ----------------------------------------------------- */
	var _group_prop = function(prop) {
		return _group_prop_handler(prop, _data);
	};

	/** _group_prop_handler ----------------------------------------------------- */
	var _group_prop_handler = function(prop, d)  {
		var _grouped = _.groupBy(d, function(item) { return item[prop]; });
		var _keys = Object.keys(_grouped);
		var result = [];
		_.each(_keys, function(k) {
			result.push({
				key: k,
				data: _grouped[k].sort(function(a,b){ return a.name.	localeCompare(b.name); })
			});
		});

		return result;

	};

	/** _group_contains ----------------------------------------------------- */
	var _group_contains = function(prop){

		var result = [],
			_keys = [],
			_names = _.filter(_.pluck(_data, prop), function(p) {
				return(p);
			});
		_keys = _.uniq(_.flatten(_names));


		_.each(_keys, function(k) {
			result.push({
				key: k,
				data: _.filter(_data, function(item){
					return _.indexOf(item[prop], k) > -1;
				})
			});
		});

		return result;
	};

	/** exports*/
	return {
		init: _init,
		groupFields: _group_fields,
		groupProp: _group_prop,
		groupAlpha: _group_alpha,
		groupContains: _group_contains,
		sort: _sort
	}
});