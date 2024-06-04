
//https://github.com/mapbox/earcut
var w = window.innerWidth;
var h = window.innerHeight;
var scene, camera, renderer, mesh, group;


var size = 512;
var map = new Map(  '', null, size, size, 0, 18 );
var id = 0;

map.eventEmitter.on( Map.ON_TILE_LOADED, function( t ){

    var x = t.tx;
    var y = t.ty;
    var z = map.zoom;
    var req = new XMLHttpRequest();
    req.onload = function(e){
        var json = JSON.parse(e.target.responseText );
        build( t, json );
    };

    var url = 'http://tile.mapzen.com/mapzen/vector/v1/buildings/'+z+'/'+x+'/'+y+'.json?api_key=mapzen-foW3wh2';
    req.open( "GET", url );
    req.send();
});

var buildings = {};
var colors = [0xFFCC000, 0xCC0000, 0x00CC99, 0x0066CC ];
function build( tile, json ) {
    console.time("build");
    //collects all data for this tile
    var bufferUIDs = [];
    var bufferVertices = [];
    var bufferEdges = [];
    var bufferUvs = [];
    var bufferHeights = [];
    json.features.forEach( function( feat ) {

        //var uid = feat.properties.id.toString();
        // var uid = feat.id.toString();

        //this feature is a single point (street names mostly)
        if( !isNaN( feat.geometry.coordinates[0] ) ){
            //console.log(feat);
            return;
        }

        //the feature with this ID has already been built
        // if (buildings[ uid ] != null )return;

        //stores the uid for this feature and prevents duplicate instanciation
        // buildings[ uid ] = uid;
        // bufferUIDs.push( uid );

        var valid = true;
        var edges = [];
        var vertices = [];
        feat.geometry.coordinates.forEach( function( coords, j ){

            //use only the first shape
            if( j > 0 )return;

            var max = coords.length - 1;
            coords.forEach( function( cs,i ){

                //don't use duplicate first point
                if( i == max ) return;

                //convert lat lon to map XY coords
                var lng = cs[0];
                var lat = cs[1];
                var xy = map.latLonToPixels(  lat,lng, map.zoom );

                //XY map coords to elevation mesh coords
                var x = ( xy[0] - size / 2 );
                var y = ( xy[1] - size / 2 );
                vertices.push( [x,y] );

                //edges
                edges.push( [ i, ( i+1 ) % max ] );

            });

        });

        if( !valid ) return;

        //stores this feature's data
        bufferVertices.push( vertices );
        bufferEdges.push( edges );

        //random uvs
        var uvTileSize = 1 / 9;
        var u = ( parseInt( Math.random() * 7 ) / 8 );
        var v = ( parseInt( Math.random() * 7 ) / 8 );
        bufferUvs.push( new THREE.Vector4( u, v, uvTileSize, uvTileSize ) );

        //random height
        bufferHeights.push( 10 + Math.random() * 50 );

    });

    var buildingMaterial = new THREE.MeshLambertMaterial({color:colors[id++%colors.length] });
    var tileBuffer = new TileBuffer( tile, bufferVertices, bufferEdges, buildingMaterial, bufferHeights, bufferUvs, bufferUIDs );
    group.add( tileBuffer );
    console.timeEnd("build");

}

var mat, light;

var lat  = 48.87391397959806;
var lng  = 2.308752868652376;
//senlis...
//lat = 49.20685965504833;
//lng = 2.5831550292968415;

var zl  = 17;
var start = 0;
window.onload = function() {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 40, w / h,.1, 10000 );
    camera.position.y = 600;
    camera.position.z = 0;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(w, h);
    document.body.appendChild(renderer.domElement);
    new THREE.OrbitControls( camera );


    light = new THREE.SpotLight( 0xffffff, 2, 0 );
    light.position.set( 0, 2000, 0 );
    scene.add( light );

    group = new THREE.Group();
    scene.add( group );

    camera.lookAt( group.position );
    map.setView( lat, lng, zl );

    start = Date.now();
    update();

};

window.onresize = function()
{
    w = window.innerWidth;
    h = window.innerHeight;
    renderer.setSize( w,h );
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
};

function update(){

    requestAnimationFrame(update);

    light.position.copy( camera.position );
    renderer.render( scene, camera );

}
