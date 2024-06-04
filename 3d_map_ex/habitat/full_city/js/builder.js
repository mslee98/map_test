var builder = function(exports){

    var buildings = {};//dictionary to prevent duplicate buildings creation

    var parent;
    exports.init = function( group ){
        parent = group;
    };
    exports.buildBlocks = function( tile, type, data, color ){

        //collects all data for this tile
        var bufferUIDs = [];
        var bufferVertices = [];
        var bufferEdges = [];
        var bufferUvs = [];
        var bufferHeights = [];

        //console.time( "build" );

        data.features.forEach( function( feat ) {


            if( type != "water" && type != "extra_land" ){

                var uid = feat.id.toString();// || feat.properties.id.toString() || feat.properties.FID.toString();
                //this feature is a single point (street names mostly)
                if( !isNaN( feat.geometry.coordinates[0] ) ) {
                    //console.log(feat);
                    return;
                }
                //the feature with this ID has already been built
                if (buildings[ uid ] != null )return;

            }
            if( type == 'landuse' ){
                if( feat.properties.area > 50000 )return;
                //console.log( feat.properties.kind, feat.properties.area );

                //if( ["garden","grass","pedestrian","playground","pitch", feat.properties.kind );
            }


            //stores the uid for this feature and prevents duplicate instanciation
            buildings[ uid ] = uid;
            bufferUIDs.push( uid );

            var valid = true;
            var edges = [];
            var vertices = [];

            feat.geometry.coordinates.forEach( function( coords, j ){

                //use only the first shape
                if( j > 0 && type != "water" )return;

                var max = coords.length - 1;
                coords.forEach( function( cs, i ){

                    //don't use duplicate first point
                    if( i == max ) return;

                    //convert lat lon to map XY coords
                    var lng = cs[0];
                    var lat = cs[1];

                    var xy = map.mercator.latLonToMeters( -lat, lng, map.zoom);
                    if( isNaN( xy[0] ) || isNaN( xy[1]))
                    {
                        valid = false;
                        return;
                    }
                    vertices.push( xy );

                    //edges
                    edges.push( [ i, ( i+1 ) % max ] );

                });

            });

            if( !valid ) return;

            //stores this feature's data
            bufferVertices.push( vertices );
            bufferEdges.push( edges );

            //random height
            var height = 1;
            if( type == "extra_land" ){
                height = 3;
            }else if( type == "landuse"  ){
                height = 4;
            }else if( type == "water" ){
                height = 2;
            }else{
                height = ( 10 + Math.random() * 100 );
                height = Math.random()>.99 ? height*2 : height;
            }
            bufferHeights.push( height );

        });

        var tileBuffer = new TileBuffer( tile, bufferVertices, bufferEdges, materials[ type ], bufferHeights, type=="water", bufferUIDs );
        parent.add( tileBuffer );

    };
    return exports;
}({});
