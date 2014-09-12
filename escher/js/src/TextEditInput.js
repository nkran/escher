define(['utils', 'PlacedDiv', 'Map', 'ZoomContainer', 'CallbackManager', 'build'], function(utils, PlacedDiv, Map, ZoomContainer, CallbackManager, build) {
    /**
     */

    var TextEditInput = utils.make_class();
    // instance methods
    TextEditInput.prototype = { init: init,
				setup_map_callbacks: setup_map_callbacks,
				setup_zoom_callbacks: setup_zoom_callbacks,
				is_visible: is_visible,
				show: show,
				hide: hide,
				_accept_changes: _accept_changes,
				_add_and_edit: _add_and_edit };

    return TextEditInput;

    // definitions
    function init(selection, map, zoom_container) {
	var div = selection.append('div')
		.attr('id', 'text-edit-input');
	this.placed_div = PlacedDiv(div, map);
	this.placed_div.hide();
	this.input = div.append('input');

	if (map instanceof Map) {
	    this.map = map;
	    this.setup_map_callbacks(map);
	} else {
	    throw new Error('Cannot set the map. It is not an instance of ' + 
			    'Map');
	}
	if (zoom_container instanceof ZoomContainer) {
	    this.zoom_container = zoom_container;
	    this.setup_zoom_callbacks(zoom_container);
	} else {
	    throw new Error('Cannot set the zoom_container. It is not an ' +
			    'instance of ZoomContainer');
	}
    }

    function setup_map_callbacks(map) {
	// input
	map.callback_manager.set('edit_text_label.text_edit_input', function(target, coords) {
	    this.show(target, coords);
	}.bind(this));

	// new text_label
	map.callback_manager.set('new_text_label.text_edit_input', function(coords) {
	    if (this.active_target !== null)
		this._accept_changes(this.active_target.target);
	    this.hide();
	    this._add_and_edit(coords);
	}.bind(this));
    }

    function setup_zoom_callbacks(zoom_container) {
	zoom_container.callback_manager.set('zoom.text_edit_input', function() {
	    if (this.active_target)
		this._accept_changes(this.active_target.target);
	    this.hide();
	}.bind(this));
	zoom_container.callback_manager.set('go_to.text_edit_input', function() {
	    if (this.active_target)
		this._accept_changes(this.active_target.target);
	    this.hide();
	}.bind(this));
    }

    function is_visible() {
	return this.placed_div.is_visible();
    }

    function show(target, coords) {
	// save any existing edit
	if (this.active_target) {
	    this._accept_changes(this.active_target.target);
	}

	// set the current target
	this.active_target = { target: target,
			       coords: coords };

	// set the new value
	target.each(function(d) {
	    this.input.node().value = d.text;
	}.bind(this));

	// place the input
	this.placed_div.place(coords);
	this.input.node().focus();

	// escape key
	this.escape = this.map.key_manager
	    .add_escape_listener(function() {
		this.hide();
	    }.bind(this));
	// enter key
	this.enter = this.map.key_manager
	    .add_enter_listener(function(target) {
		this._accept_changes(target);
		this.hide();
	    }.bind(this, target));
    }

    function hide() {
	// hide the input
	this.placed_div.hide();

	// clear the value
	this.input.attr('value', '');
	this.active_target = null;

	// clear escape
	if (this.escape)
	    this.escape.clear();
	this.escape = null;
	// clear enter
	if (this.enter)
	    this.enter.clear();
	this.enter = null;
	// turn off click listener
	// this.map.sel.on('click.', null);
    }

    function _accept_changes(target) {
	if (this.input.node().value == '') {
	    // delete the label
	    target.each(function(d) {
		var selected = {};
		selected[d.text_label_id] = this.map.text_labels[d.text_label_id];
		this.map.delete_selectable({}, selected, true);
	    }.bind(this));
	} else {
	    // set the text
	    var text_label_ids = [];
	    target.each(function(d) {
		this.map.edit_text_label(d.text_label_id, this.input.node().value, true);
		text_label_ids.push(d.text_label_id);
	    }.bind(this));
	}
    }

    function _add_and_edit(coords) {
	var out = build.new_text_label(this.map.largest_ids, '', coords);
	this.map.text_labels[out.id] = out.label;
	sel = this.map.draw_these_text_labels([out.id]);
	// TODO wait here?
	var sel = this.map.sel.select('#text-labels').selectAll('.text-label')
		.filter(function(d) { return d.text_label_id==out.id; });
	// apply the cursor to the new label
	sel.select('text').classed('edit-text-cursor', true);
	this.show(sel, coords);
    }
});
