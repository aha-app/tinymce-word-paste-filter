/**
 * ToolbarGroup.js
 *
 * Copyright 2010, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */

(function(tinymce) {
// Shorten class names
var dom = tinymce.DOM, each = tinymce.each, Event = tinymce.dom.Event;
/**
 * This class is used to group a set of toolbars together and control the keyboard navigation and focus.
 *
 * @class tinymce.ui.ToolbarGroup
 * @extends tinymce.ui.Container
 */
tinymce.create('tinymce.ui.ToolbarGroup:tinymce.ui.Container', {
	/**
	 * Renders the toolbar group as a HTML string.
	 *
	 * @method renderHTML
	 * @return {String} HTML for the toolbar control.
	 */
	renderHTML : function() {
		var t = this, h = [], controls = t.controls, each = tinymce.each, settings = t.settings;
		h.push('<div id="' + t.id + '" role="group" aria-label="' + settings.name + '">');
		each(controls, function(toolbar) {
			h.push(toolbar.renderHTML());
		});
		h.push('</div>');
		return h.join('');
	},
	
	focus : function() {
		dom.get(dom.getAttrib(this.id, 'aria-activedescendant')).focus();
	},
	
	postRender : function() {
		var t = this, items = [], tabFocusToolbar = t.settings.tab_focus_toolbar;;
		each(t.controls, function(toolbar) {
			each (toolbar.controls, function(control) {
				if (control.id) {
					items.push(control);
					if (!tabFocusToolbar) {
						dom.bind(control.id, 'blur', function() {
							dom.setAttrib(control.id, 'tabindex', '-1');
						});
					}
				}
			});
		});
		new tinymce.ui.KeyboardNavigation({
			root: t.id,
			items: items,
			onCancel: function() {
				t.editor.focus();
			}
		});
		if (!tabFocusToolbar) {
			dom.setAttrib(items[0].id, 'tabindex', '-1');
			dom.setAttrib(t.id, 'tabindex', '-1');
		}
	},
	
	destroy : function() {
		this.parent();
		Event.clear(t.id);
	}
});
})(tinymce);
