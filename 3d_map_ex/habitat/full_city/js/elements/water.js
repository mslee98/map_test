var water = function(exports){

    exports.init = function( cb ){

        var water = new XMLHttpRequest();
        water.onload = function(e){
            var json = JSON.parse(e.target.responseText );
            builder.buildBlocks( null, "water", json );
            if( cb )cb();
        };
        water.open( "GET", 'data/extracts/sf_water.geojson' );
        water.send();

    };
    return exports;

}({});