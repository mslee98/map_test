var map = function(exports){

    var id = 0;
    var map = new Map( '', null, 512,512, 0, 16 );

    let removeTile;

    map.init = function( size, load ){

        map.setSize( size, size );
        map.render = false;//not rendering to canvas
        map.loadTiles = false;//will not load the images

        map.eventEmitter.on( Map.ON_TILE_LOADED, function( t ){

            if( !Boolean( load ) )return;

            var x = t.tx;
            var y = t.ty;
            var z = map.zoom;

            var req = new XMLHttpRequest();
            req.onload = function(e){
                if (req.readyState === 4) {
                    if (req.status === 200) {

                        if( e.target.responseText == '' ){
                            console.log( "empty JSON", url );
                            return
                        }
                        var json = JSON.parse(e.target.responseText );
                        builder.buildBlocks( t, "req", json );
                    }else{
                        console.log("error loading buildings");
                    }
                }
            };

            req.open( "GET", 'https://tile.nextzen.org/tilezen/vector/v1/512/all/'+z+'/'+x+'/'+y+'.json?api_key=K8i0iT__Qsq5_JzJflm_vw' );
            req.send();

            removeTile = t;
            //fn_removeTile(t);
            
            // var landuse = new XMLHttpRequest();
            // landuse.onload = function(e){
            //     if (landuse.readyState === 4) {
            //         if (landuse.status === 200) {

            //             if( e.target.responseText == '' ){
            //                 console.log( "empty JSON", url );
            //                 return
            //             }
            //             var json = JSON.parse(e.target.responseText );
            //             builder.buildBlocks( t, "landuse", json );
            //         }else{
            //             console.log("error loading land usage");
            //         }
            //     }
            // };
            // landuse.open( "GET", 'https://tile.nextzen.org/tilezen/vector/v1/512/all/'+z+'/'+x+'/'+y+'.json?api_key=K8i0iT__Qsq5_JzJflm_vw' );
            // landuse.send();
        });

    };

    function fn_removeTile(t) {
        map.eventEmitter.removeListener(Map.ON_LOAD_COMPLETE, t);
    }

    return map;
}();