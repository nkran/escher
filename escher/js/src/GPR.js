define(["utils", "Input", "ZoomContainer", "Map", "CobraModel", "Brush", "CallbackManager", "ui", "SearchBar", "Settings", "SettingsBar"], function(utils, Input, ZoomContainer, Map, CobraModel, Brush, CallbackManager, ui, SearchBar, Settings, SettingsBar) {
    /** A Builder object contains all the ui and logic to generate a map builder or viewer.

     Builder(options)

     options: An object.

     */
    var Builder = utils.make_class();
    Builder.prototype = { init: init,
			  reload_builder: reload_builder,
			  set_mode: set_mode,
			  view_mode: view_mode,
			  build_mode: build_mode,
			  brush_mode: brush_mode,
			  zoom_mode: zoom_mode,
			  rotate_mode: rotate_mode,
			  _toggle_direction_buttons: _toggle_direction_buttons,
			  _setup_menu: _setup_menu,
			  _setup_simple_zoom_buttons: _setup_simple_zoom_buttons,
			  _setup_status: _setup_status,
			  _setup_modes: _setup_modes,
			  _get_keys: _get_keys };

    return Builder;

    // definitions
    function init(options) {
    }
});
