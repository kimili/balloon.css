(function(){

    'use strict';

    var body, overlay, scrim, close;

    function bindEvents() {
        body.addEventListener('click', handleBalloonClick, true);
    }

    function handleBalloonClick(e) {
        var tooltip_text;

        if ( e.target.hasAttribute('data-balloon') && e.target.hasAttribute('data-balloon-smallscreen-overlay') ) {
            tooltip_text = e.target.getAttribute('data-balloon');
            showOverlay(tooltip_text);
        }
    }

    function showOverlay(text) {
        var p;

        overlay = document.createElement('div');
        scrim = document.createElement('div');
        close = document.createElement('button');
        p = document.createElement('p');

        overlay.className = 'balloon-overlay';
        scrim.className = 'balloon-overlay-scrim';

        close.type = 'button';
        close.className = 'close icon-close';
        close.textContent = '×';

        p.textContent = text;

        overlay.appendChild(close);
        overlay.appendChild(p);

        close.addEventListener('click', hideOverlay, true);
        overlay.addEventListener('click', hideOverlay, true);

        scrim.appendChild(overlay);
        body.appendChild(scrim);

        window.setTimeout(function(){
            scrim.className += ' visible';
        }, 10);
    }

    function hideOverlay(e) {
        e.stopPropagation();

        // Clean up event handlers.
        close.removeEventListener('click');
        overlay.removeEventListener('click');

        body.removeChild(scrim);
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
