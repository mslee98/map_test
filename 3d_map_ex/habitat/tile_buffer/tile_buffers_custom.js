
//https://github.com/mapbox/earcut
var w = window.innerWidth;
var h = window.innerHeight;
var scene, camera, renderer, mesh, group;

var lat  = 48.87391397959806;
var lng  = 2.308752868652376;
//senlis...
//lat = 49.20685965504833;
//lng = 2.5831550292968415;

var zl  = 15;
var size = 1024;
var map = new Map( '', null, size, size, 0, 18 );

map.eventEmitter.on( Map.ON_TILE_LOADED, function( t, s ){

    var x = t.tx;
    var y = t.ty;
    var z = map.zoom;
    var req = new XMLHttpRequest();
    var url = 'http://tile.mapzen.com/mapzen/vector/v1/buildings/'+z+'/'+x+'/'+y+'.json?api_key=mapzen-foW3wh2';
    req.open( "GET", url );
    req.onload = function(e){
        var json = JSON.parse(e.target.responseText );
        build( t, json );
    };
    req.send();

});



var count = 0;
var buildings_count = 0;
var time = 0;

var buildings = {};//dictionary not to create multiple instances

//happens when a tile was loaded, json is what we'll have to parse
function build( tile, json ) {

    var start = Date.now();

    //collects all data for this tile
    var UIDBuffer = [];
    var verticesBuffer = [];
    var edgesBuffer = [];
    var uvsBuffer = [];
    var heightsBuffer = [];

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
        buildings_count++;
        //stores the uid for this feature and prevents duplicate instanciation
        // buildings[ uid ] = uid;
        // UIDBuffer.push( uid );

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
                var x = ( xy[0] ) - size / 2;
                var y = ( xy[1] ) - size / 2;
                vertices.push( [x,y] );

                if( isNaN(x) || isNaN(y))valid = false;
                //edges
                edges.push( [ i, ( i+1 ) % max ] );

            });

        });

        if( !valid )return;

        //stores this feature's data
        verticesBuffer.push( vertices );
        edgesBuffer.push( edges );

        //random uvs
        var uvTileSize = 1 / 9;
        var u = ( parseInt( Math.random() * 3 ) / 4 );
        var v = ( parseInt( Math.random() * 3 ) / 4 );
        uvsBuffer.push( new THREE.Vector4( u, v, uvTileSize, uvTileSize ) );

        //random height
        heightsBuffer.push( ( 5 + Math.random() * 35 ) * ( 1 / map.resolution( map.zoom ) ) );

    });

    if( verticesBuffer.length == 0 )return;

    var tileBuffer = new TileBuffer( tile, verticesBuffer, edgesBuffer, buildingMaterial, heightsBuffer, uvsBuffer, UIDBuffer );
    group.add( tileBuffer );

    count++;
    time += Date.now() - start;
    console.log( "tile", count, "buildings", buildings_count, "total time", Math.round( time ),'ms', "average", Math.round( time / count ) , 'ms')

}


var mat, tex_map, buildingMaterial, start = 0;

var sl = new ShaderLoader();
sl.loadShaders( {
    tile_fs:"",
    tile_vs:""
}, "", onShadersLoaded );


function onShadersLoaded() {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 60, w / h,.1, 10000 );
    camera.position.y = 600;
    camera.position.z = -400;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(w, h);
    document.body.appendChild(renderer.domElement);
    new THREE.OrbitControls( camera );

    buildingMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: {type: "f", value: 0 }
        },
        vertexShader: ShaderLoader.get("tile_vs"),
        fragmentShader: ShaderLoader.get("tile_fs"),
        side: THREE.DoubleSide,
        shading:THREE.FlatShading,
        transparent:true
    });

    group = new THREE.Group();
    scene.add( group );
    camera.lookAt( group.position );

    map.setView( lat, lng, zl );

    start = Date.now();
    update();

}

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

    buildingMaterial.uniforms.time.value  = ( Date.now() - start ) * .001;

    renderer.render( scene, camera );

}
