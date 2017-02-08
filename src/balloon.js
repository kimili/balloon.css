(function () {

    'use strict';

    /**
     *     some element reference variables.
     */
    var body, overlay, scrim, triggers, html_toolips;

    /**
     *     Variable: overlay_open
     *        A boolean flag to keep track of whether an overlay balloon is open or not.
     */
    var overlay_open = false;

    /**
     *     Variable: max_width
     *        The maximum window width to display an overlay balloon
     */
    var max_width = 979;

    /**
     *     Function: bindEvents
     *        Sets up event binding for the balloon module
     *
     *    Returns:
     *        nothing
     */
    function bindEvents() {
        triggers.forEach(function(item) {
            item.addEventListener('click', handleBalloonClick, true);
        });
    }

    /**
     *     Function: handleBalloonClick
     *        Figures out whether to display a balloon on trigger click. Bound to a click event on the body
     *
     *    Arguments:
     *        e - *(Object)* The event object
     *
     *    Returns:
     *        nothing
     */
    function handleBalloonClick(e) {
        var trigger_el, tooltip_text, header_text;

        if (overlay_open) {
            return;
        }

        if (window.innerWidth > max_width) {
            trigger_el = (e.target.hasAttribute('data-balloon')) ? e.target : isChildOfTrigger(e.target);
        } else {
            trigger_el = (e.target.hasAttribute('data-balloon') && e.target.hasAttribute('data-balloon-smallscreen-overlay')) ? e.target : isChildOfTrigger(e.target);
        }

        if (!trigger_el) {
            return;
        }

        e.stopPropagation();
        e.preventDefault();

        if (window.innerWidth > max_width) {
            return;
        }
        tooltip_text = trigger_el.getAttribute('data-balloon');
        header_text = trigger_el.getAttribute('data-balloon-title') || trigger_el.textContent.trim();
        showOverlay(tooltip_text, header_text);
    }

    /**
     *     Function: isChildOfTrigger
     *        Determines whether or not an element is contained within an overlay trigger.
     *
     *    Arguments:
     *        el - *(element)* The element to check if it's a descendent or not.
     *
     *    Returns:
     *        *(Object)* The smallscreen overlay trigger, if the element passed in is a child node of that trigger, otherwise null
     */
    function isChildOfTrigger(el) {
        while (el) {
            if (el.hasAttribute && el.hasAttribute('data-balloon-smallscreen-overlay')) {
                return el;
            }
            el = el.parentElement;
        }
        return null;
    }

    /**
     *     Function: generateHTMLTooltips
     *        For any tooltips marked as having HTML content, this builds an HTML version of the tooltip.
     *
     *    Returns:
     *        nothing
     */
    function generateHTMLTooltips() {
        var i, container, tooltip, header, header_text, p;
        for (i = 0; i < html_toolips.length; i++) {
            container = html_toolips[i];

            tooltip = document.createElement('span');
            p = document.createElement('p');

            tooltip.className = 'balloon';

            header_text = container.getAttribute('data-balloon-title') || container.textContent.trim();
            if (header_text) {
                header = document.createElement('h5');
                header.textContent = header_text;
                tooltip.appendChild(header);
            }

            p.innerHTML = container.getAttribute('data-balloon');
            tooltip.appendChild(p);
            container.appendChild(tooltip);
        }
    }

    /**
     *     Function: showOverlay
     *        Builds and displays an overlay tooltip
     *
     *    Arguments:
     *        text - *(String)* The text content to display in the overlay tooltip
     *        header_text - *(String)* The text to display as a header in the overlay tooltip
     *
     *    Returns:
     *        nothing
     */
    function showOverlay(text, header_text) {
        var header, p;

        overlay = document.createElement('div');
        scrim = document.createElement('div');
        p = document.createElement('p');

        if (header_text) {
            header = document.createElement('h5');
            header.textContent = header_text;
        }

        overlay.className = 'balloon-overlay';
        scrim.className = 'balloon-overlay-scrim';

        p.innerHTML = text;

        if (header) {
            overlay.appendChild(header);
        }
        overlay.appendChild(p);

        scrim.appendChild(overlay);
        body.appendChild(scrim);

        window.setTimeout(function () {
            scrim.className += ' visible';
        }, 10);

        scrim.addEventListener('click', hideOverlay, true);
        window.addEventListener('scroll', hideOverlay);

        overlay_open = true;
    }

    /**
     *     Function: hideOverlay
     *        Removes the overlay if its visible. Bound to the window scroll and body click events when an overlay tooltip is rendered.
     *
     *    Arguments:
     *        e - *(Object)* The event object
     *
     *    Returns:
     *        nothing
     */
    function hideOverlay(e) {

        if (e.type === 'scroll' || e.type === 'click' && e.target === scrim) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.preventDefault();

            // Clean up event handlers.
            scrim.removeEventListener('click', hideOverlay);
            window.removeEventListener('scroll', hideOverlay);

            scrim.className = scrim.className.replace(/\bvisible\b/g, '');

            window.setTimeout(function () {
                body.removeChild(scrim);
                overlay_open = false;
            }, 180);
        }
    }

    /**
     *     Function: initialize
     *        Sets up the balloon module.
     *
     *    Returns:
     *        nothing
     */
    function initialize() {
        body = document.querySelector('body');
        triggers = document.querySelectorAll('[data-balloon]');
        html_toolips = document.querySelectorAll('[data-balloon-html-content]');
        generateHTMLTooltips();
        bindEvents();
    }

    /**
     *     Function: ready
     *        A cross browser wrapper for hooking into the domready event.
     *
     *    Arguments:
     *        fn - *(Function)* The function to fire on document ready.
     *
     *    Returns:
     *        nothing
     */
    function ready(fn) {
        if (document.readyState != 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    /**
     *    Fire it up.
     */
    ready(initialize);

})();
