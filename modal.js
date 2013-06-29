/*!
 * CSS Modal
 * http://drublic.github.com/css-modal
 *
 * @author Hans Christian Reinl - @drublic
 * @version 1.1.0
 */

(function (global) {

	'use strict';

	// Storage for functions and attributes
	var modal = {

		// Store for currently active element
		activeElement: undefined,
		lastActive: undefined,

		// Polyfill addEventListener for IE8 (only very basic)
		on: function (event, element, callback) {
			if (element.addEventListener) {
				element.addEventListener(event, callback, false);
			} else {
				element.attachEvent('on' + event, callback);
			}
		},

		// Convenience function to trigger event
		trigger: function (event, modal) {
			var eventTigger;

			if (!document.createEvent) {
				return;
			}

			eventTigger = document.createEvent('Event');

			eventTigger.initEvent(event, true, true);
			eventTigger.customData = { 'modal': modal };

			document.dispatchEvent(eventTigger);
		},

		// Convenience function to add a class to an element
		addClass: function (element, className) {
			if (element && !element.className.match(/className/)) {
				element.className += ' ' + className;
			}
		},

		// Convenience function to remove a class from an element
		removeClass: function (element, className) {
			element.className = element.className.replace(' ' + className, '');
		},

		// Focus modal
		setFocus: function () {
			if (modal.activeElement) {

				// Set element with last focus
				modal.lastActive = document.activeElement;

				// New focussing
				modal.activeElement.focus();
			}
		},

		// Unfocus
		removeFocus: function () {
			if (modal.lastActive) {
				modal.lastActive.focus();
			}
		},

		// Mark modal as active
		setActive: function (element) {
			modal.addClass(element, 'is-active');
			modal.activeElement = element;

			// Set the focus to the modal
			modal.setFocus(element.id);

			// Fire an event
			modal.trigger('cssmodal:show', modal.activeElement);
		},

		// Unset previous active modal
		unsetActive: function () {
			if (modal.activeElement) {
				modal.removeClass(modal.activeElement, 'is-active');

				// Fire an event
				modal.trigger('cssmodal:hide', modal.activeElement);

				// Unfocus
				modal.removeFocus();

				// Reset active element
				modal.activeElement = null;
			}
		},

		// When showing overlay, prevent background from scrolling
		mainHandler: function () {
			var hash = window.location.hash.replace('#', '');
			var modalElement = document.getElementById(hash);
			var modalChild;

			// If the hash element exists
			if (modalElement) {

				// Get first element in selected element
				modalChild = modalElement.children[0];

				// When we deal with a modal and body-class `has-overlay` is not set
				if (modalChild && modalChild.className.match(/modal-inner/)) {

					// Set an html class to prevent scrolling
					modal.addClass(document.documentElement, 'has-overlay');

					// Unmark previous active element
					modal.unsetActive(modalElement);

					// Mark the active element
					modal.setActive(modalElement);
				}
			} else {
				modal.removeClass(document.documentElement, 'has-overlay');

				// If activeElement is already defined, delete it
				modal.unsetActive();
			}
		}
	};


	// Hide overlay when ESC is pressed
	modal.on('keyup', document, function (event) {
		var hash = window.location.hash.replace('#', '');

		// If hash is not set
		if (hash === '' || hash === '!') {
			return;
		}

		// If key ESC is pressed
		if (event.keyCode === 27) {
			window.location.hash = '!';

			if (modal.lastActive) {
				return false;
			}

			// Unfocus
			modal.removeFocus();
		}
	}, false);


	// Trigger main handler on load and hashchange
	modal.on('hashchange', window, modal.mainHandler);
	modal.on('load', window, modal.mainHandler);


	// Export CSSModal into global space
	global.CSSModal = modal;

}(window));
