var controls = function( exports )
{
    var maps = [];
    exports.add = function( map ){
        maps.push(map);
    };
    exports.remove = function( map ){
        if( maps.indexOf( map ) != -1 ){
            maps.splice( maps.indexOf( map ),1 );
        }
    };

    exports.RIGHT_MOUSE = 0;

    ////////////////////////////////////////////

    // mouse handling

    ////////////////////////////////////////////

    var origin = { x:0, y:0 };
    var delta = {x:0, y:0 };
    var mouseDown = false;

    function getPosition(e){

        var pos = {x:0, y:0};
        if( e == null )return {x:window.innerWidth/2, y:window.innerHeight/2};

        if( 'ontouchstart' in window )
        {
            var touch = e.targetTouches[0];
            pos.x = touch.clientX;
            pos.y = touch.clientY;
        }else
        {
            if (!e) e = window.event;
            if (e.pageX || e.pageY){
                pos.x = e.pageX;
                pos.y = e.pageY;
            }
            else if (e.clientX || e.clientY){
                pos.x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                pos.y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
        }
        var r = e.target.getBoundingClientRect();
        pos.x -= r.left;
        pos.y -= r.top;
        return pos;
    }

    exports.wheelDelta = 1;
    exports.zoom = function(e){


        //var move = true;
        //maps.forEach( function( map ){
        //    if( map.zoom + 1 >= map.maxZoom )move = false;
        //    if( map.zoom - 1 < map.minZoom )move = false;
        //});
        //if( !move )return;

        var p = getPosition( e.target == null? null : e );
        maps.forEach( function( map ){

            var op = map.pixelsToLatLon( p.x, p.y );
            map.zoom += e.wheelDelta > 0 ? exports.wheelDelta : -exports.wheelDelta;

            if( map.zoom != map.minZoom && map.zoom != map.maxZoom ) {

                var dp = map.pixelsToLatLon( p.x, p.y );
                var lat = map.latitude + ( op[0] - dp[0] );
                var lon = map.longitude + ( op[1] - dp[1] );
                map.setView(lat, lon );
            }
        });
        if( exports[e.target].onZoom != null )exports[e.target].onZoom();

        e.preventDefault();
    };

    exports.onDown = function(e){

        origin = getPosition(e);
        mouseDown = true;
        if( exports[e.target].onDown != null )exports[e.target].onDown();
        e.preventDefault();
    };

    exports.onUp = function(e){
        mouseDown = false;
        if( exports[e.target].onUp != null )exports[e.target].onUp();
        e.preventDefault();
    };

    exports.onMove = function(e){

        if( mouseDown ){


            var dest = getPosition(e);

            maps.forEach( function( map ){

                var op = map.pixelsToLatLon( origin.x, origin.y );
                var dp = map.pixelsToLatLon( dest.x, dest.y );

                var lat = map.latitude + ( op[0] - dp[0] );
                var lon = map.longitude + ( op[1] - dp[1] );

                map.setView( lat, lon );


            });
            origin = dest;
            if( exports[e.target].onMove != null )exports[e.target].onMove();
        }
        e.preventDefault();
    };

    ////////////////////////////////////////////

    // UI controls

    ////////////////////////////////////////////

    exports.zoomIn = function() {
        zoom( {wheelDelta:1} );
    };

    exports.zoomOut = function() {
        zoom( {wheelDelta:-1}  );
    };

    exports.goHome = function()
    {
        var geoSuccess = function(position) {
            maps.forEach( function( map ){
                map.latitude  = position.coords.latitude;
                map.longitude = position.coords.longitude;
                map.zoom = 17;
                map.setView();
            });
        };
        navigator.geolocation.getCurrentPosition(geoSuccess);
    };

    exports.onResize = function()
    {
        maps.forEach( function( map ) {
            map.setSize(window.innerWidth, window.innerHeight);
            map.setView();
        });
    };

    exports.addListeners = function( domElement, onDown, onUp, onMove, onZoom  ) {

        exports[ domElement ] = { onDown:onDown, onUp:onUp, onMove:onMove, onZoom:onZoom };
        if( 'ontouchstart' in window )
        {
            domElement.addEventListener('touchmove',    exports.onMove, false );
            domElement.addEventListener('touchend',     exports.onUp, false );
            domElement.addEventListener('touchstart',   exports.onDown, false );
            domElement.addEventListener('touchend',     exports.onUp, false );
        }
        else
        {
            domElement.addEventListener('mousemove',    exports.onMove, false );
            domElement.addEventListener('mouseleave',   exports.onUp, false );
            domElement.addEventListener('mousedown',    exports.onDown, false );
            domElement.addEventListener('mouseup',      exports.onUp, false );
            domElement.addEventListener('mousewheel',   exports.zoom, false );
        }

    };
    exports.removeListeners = function( domElement ){

        if( 'ontouchstart' in window )
        {
            domElement.removeEventListener('touchmove',     exports.onMove, false );
            domElement.removeEventListener('touchend',      exports.onUp, false );
            domElement.removeEventListener('touchstart',    exports.onDown, false );
            domElement.removeEventListener('touchend',      exports.onUp, false );
        }
        else
        {
            domElement.removeEventListener('mousemove',     exports.onMove, false );
            domElement.removeEventListener('mouseleave',    exports.onUp, false );
            domElement.removeEventListener('mousedown',     exports.onDown, false );
            domElement.removeEventListener('mouseup',       exports.onUp, false );
            domElement.removeEventListener('mousewheel',    exports.zoom, false );
        }

    };
    return exports;
}({});