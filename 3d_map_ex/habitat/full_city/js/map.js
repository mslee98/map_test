var map = function(exports){


    var id = 0;
    var map = new Map( '', null, 256,256, 0, 18 );
    map.init = function( size, load ){

        map.setSize( size, size );
        map.render = false;//not rendering to canvas
        map.loadTiles = false;//will not load the images

        map.eventEmitter.on( Map.ON_TILE_LOADED, function( t ){

            if( !Boolean( load ) )return;

            var x = t.tx;
            var y = t.ty;
            var z = map.zoom;

            //check if we have a local copy
            /*
            var checkBuilding = new XMLHttpRequest();
            checkBuilding.onload = function(check){

                var buildings = new XMLHttpRequest();
                buildings.onload = function(e){
                    if (buildings.readyState === 4) {
                        if (buildings.status === 200) {

                            if( e.target.responseText == '' ){
                                console.log( "empty JSON", url );
                                return
                            }
                            var json = JSON.parse(e.target.responseText );
                            builder.buildBlocks( t, "buildings", json );
                        }else{
                            console.log("error loading buildings");
                        }
                    }
                };

                var url;
                //if file doesn't exist locally
                if(check.target.responseText == '0' ){

                    //fetch from server
                    // url = 'http://tile.openstreetmap.us/vectiles-buildings/'+z+'/'+x+'/'+y+'.json';

                    url = 'http://tile.mapzen.com/mapzen/vector/v1/buildings/'+z+'/'+x+'/'+y+'.json?api_key=mapzen-foW3wh2';

                    //stores a local copy
                    var folder = 'data/vectiles-buildings/'+z+'/'+x+'/';
                    var savebuildings = new XMLHttpRequest();
                    savebuildings.onload = function(){
                        if (savebuildings.readyState === 4) {if (savebuildings.status === 200) {
                            console.log( "buildings saved locally" );
                        } }
                    };
                    savebuildings.open( "GET", 'fileSaver.php?remote='+url+'&folder='+folder+'&file='+y+'.json' );
                    savebuildings.send();
                }
                else
                {
                    //fetch the local copy
                    url = 'data/vectiles-buildings/'+z+'/'+x+'/'+y+'.json';
                    buildings.open( "GET", url );
                    buildings.send();
                }

            };
            checkBuilding.open( "GET", 'fileExist.php?url=data/vectiles-buildings/'+z+'/'+x+'/'+y+'.json' );
            checkBuilding.send();
            //*/
            var buildings = new XMLHttpRequest();
            buildings.onload = function(e){
                if (buildings.readyState === 4) {
                    if (buildings.status === 200) {

                        if( e.target.responseText == '' ){
                            console.log( "empty JSON", url );
                            return
                        }
                        var json = JSON.parse(e.target.responseText );
                        builder.buildBlocks( t, "buildings", json );
                    }else{
                        console.log("error loading buildings");
                    }
                }
            };
            //buildings.open( "GET", 'http://tile.openstreetmap.us/vectiles-buildings/'+z+'/'+x+'/'+y+'.json' );
            buildings.open( "GET", 'https://1718017694.rsc.cdn77.org/cartography/habitat/full_city/data/vectiles-buildings/'+z+'/'+x+'/'+y+'.json' );
            buildings.send();
            /*
            var checkLandUse = new XMLHttpRequest();
            checkLandUse.onload = function(e){

                var landuse = new XMLHttpRequest();
                landuse.onload = function(e){
                    if (landuse.readyState === 4) {
                        if (landuse.status === 200) {

                            if( e.target.responseText == '' ){
                                console.log( "empty JSON", url );
                                return
                            }
                            var json = JSON.parse(e.target.responseText );
                            builder.buildBlocks( t, "landuse", json );
                        }else{
                            console.log("error loading land usage");
                        }
                    }
                };

                var url;
                if(e.target.responseText == '0'  ) {

                    //fetch from server
                    // url = 'http://tile.openstreetmap.us/vectiles-land-usages/'+z+'/'+x+'/'+y+'.json';
                    url = 'http://tile.mapzen.com/mapzen/vector/v1/landuse/'+z+'/'+x+'/'+y+'.json?api_key=mapzen-foW3wh2';


                    //stores a local copy
                    var folder = 'data/vectiles-land-usages/'+z+'/'+x+'/';
                    var savelanduse = new XMLHttpRequest();
                    savelanduse.onload = function(){
                        if (savelanduse.readyState === 4) {if (savelanduse.status === 200) {
                            console.log( "land use saved locally" );
                        } }
                    };
                    savelanduse.open( "GET", 'fileSaver.php?remote='+url+'&folder='+folder+'&file='+y+'.json' );
                    savelanduse.send();
                }
                else
                {
                    url = 'data/vectiles-land-usages/'+z+'/'+x+'/'+y+'.json';
                    landuse.open( "GET", url );
                    landuse.send();
                }
            };
            checkLandUse.open( "GET", 'fileExist.php?url=data/vectiles-land-usages/'+z+'/'+x+'/'+y+'.json' );
            checkLandUse.send();
            //*/
            var landuse = new XMLHttpRequest();
            landuse.onload = function(e){
                if (landuse.readyState === 4) {
                    if (landuse.status === 200) {

                        if( e.target.responseText == '' ){
                            console.log( "empty JSON", url );
                            return
                        }
                        var json = JSON.parse(e.target.responseText );
                        builder.buildBlocks( t, "landuse", json );
                    }else{
                        console.log("error loading land usage");
                    }
                }
            };
            //landuse.open( "GET", 'http://tile.openstreetmap.us/vectiles-land-usages/'+z+'/'+x+'/'+y+'.json' );
            landuse.open( "GET", 'https://1718017694.rsc.cdn77.org/cartography/habitat/full_city/data/vectiles-land-usages/'+z+'/'+x+'/'+y+'.json' );
            landuse.send();
        });

    };
    return map;
}();