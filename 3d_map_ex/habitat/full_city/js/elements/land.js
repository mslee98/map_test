/**
 * Created by nico on 09/03/2016.
 */
var land = function(exports){

    exports.init = function( scene, size, xy, cb ){


        var ground = new THREE.Mesh( new THREE.PlaneBufferGeometry(size * 100000, size * 100000, 10,10), materials[ "extra_land" ] );
        ground.rotateX( - Math.PI / 2 );
        ground.position.x = xy[0];
        ground.position.y = -50;
        ground.position.z = xy[1];
        scene.add( ground );

        var land = new XMLHttpRequest();
        land.onload = function(e){


            var json = JSON.parse(e.target.responseText );
            builder.buildBlocks( null, "extra_land", json );
            if( cb ) cb();
        };
        land.open( "GET", 'data/extracts/sf_land.geojson' );
        land.send();

    };

    return exports;

}({});
