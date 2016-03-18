(function(){

    'use strict';

    var body, overlay, scrim;

    var overlay_open = false;

    var max_width = 767;

    function bindEvents() {
        body.addEventListener('click', handleBalloonClick, true);
    }

    function handleBalloonClick(e) {
        var trigger_el, tooltip_text, header_text;

        if ( overlay_open || window.innerWidth > max_width ) {
            return;
        }

        trigger_el = ( e.target.hasAttribute('data-balloon') && e.target.hasAttribute('data-balloon-smallscreen-overlay') ) ? e.target : isChildOfTrigger(e.target);

        if ( ! trigger_el ) {
            return;
        }

        tooltip_text = trigger_el.getAttribute('data-balloon');
        header_text = trigger_el.textContent.trim();
        showOverlay(tooltip_text, header_text);
    }

    function isChildOfTrigger(el) {
        while ( el ) {
            if ( el.hasAttribute && el.hasAttribute('data-balloon-smallscreen-overlay') ) {
                return el;
            }
            el = el.parentElement;
        }
        return null;
    }

    function showOverlay(text, header_text) {
        var header, p;

        overlay = document.createElement('div');
        scrim = document.createElement('div');
        p = document.createElement('p');

        if ( header_text ) {
            header = document.createElement('h5');
            header.textContent = header_text;
        }

        overlay.className = 'balloon-overlay';
        scrim.className = 'balloon-overlay-scrim';

        p.textContent = text;

        if ( header ) {
            overlay.appendChild(header);
        }
        overlay.appendChild(p);

        scrim.appendChild(overlay);
        body.appendChild(scrim);

        window.setTimeout(function(){
            scrim.className += ' visible';
        }, 10);

        body.addEventListener('click', hideOverlay, true);
        window.addEventListener('scroll', hideOverlay);

        overlay_open = true;
    }

    function hideOverlay(e) {

        if ( e.type === 'scroll' ||  e.type === 'click' && e.target === scrim ) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.preventDefault();

            // Clean up event handlers.
            body.removeEventListener('click', hideOverlay);
            window.removeEventListener('scroll', hideOverlay);

            scrim.className = scrim.className.replace(/\bvisible\b/g,'');

            window.setTimeout(function(){
                body.removeChild(scrim);
                overlay_open = false;
            }, 180);


        }
    }

    function initialize() {
        body = document.querySelector('body');
        bindEvents();
    }

    function ready(fn) {
        if (document.readyState != 'loading'){
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(initialize);

})();
