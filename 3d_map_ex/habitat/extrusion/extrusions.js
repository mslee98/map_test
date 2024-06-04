
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
    //if( id++ == 0 )
        req.send();
});

var buildings = {};
var colors = [0xFFCC000, 0xCC0000, 0x00CC99, 0x0066CC ];
function build( tile, json ) {



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

        var edges = [];
        var vertices = [];
        var offset = 0;
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

        //random uvs
        var uvTileSize = 1 / 9;
        var u = ( parseInt( Math.random() * 7 ) / 8 );
        var v = ( parseInt( Math.random() * 7 ) / 8 );
        var uvMin = new THREE.Vector2( u, v );
        var uvMax = new THREE.Vector2( u + uvTileSize, v + uvTileSize );

        //random height
        var height = 10 + Math.random() * 50;
        
        var extrusion = new Extrusion( vertices, edges, buildingMaterial, height, uvMin, uvMax );
        group.add( extrusion );
        // buildings[ uid ] = extrusion;

    });
}

var buildingMaterial = new THREE.MeshLambertMaterial({color:0xFFFFFF});

var mat, depth, light;
var tex_map;

var lat  = 48.87391397959806;
var lng  = 2.308752868652376;
//senlis...
//lat = 49.20685965504833;
//lng = 2.5831550292968415;

var zl  = 17;
var start = 0;
window.onload = function(){

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 40, w / h,.1, 10000 );
    camera.position.y = 600;
    camera.position.z = 0;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(w, h);

    document.body.appendChild(renderer.domElement);

    new THREE.OrbitControls( camera );

    light = new THREE.PointLight( 0xffffff, 1, 0 );
    light.position.set( 0, 2000, 0 );
    scene.add( light );

    group = new THREE.Group();

    var colors = [0xFF0000, 0xFFCC00, 0x00CC33, 0x0033CC];
    var positions = [
    new THREE.Vector3( 20819.238863890278, 25000,  -23479.49413746898),
    new THREE.Vector3( -6103.645617745213, 25000,  -12166.417218486891),
    new THREE.Vector3( 10271.873471438554, 25000,  -1758.0006370502276),
    new THREE.Vector3( 5298.859743652851,  25000,  9954.392474829909 ) ];

    for( var i  = 0; i< colors.length; i++ ){
        var col = colors[i];
        var l = new THREE.PointLight( col, .35, 0, Math.PI / 4 );
        l.position.copy( positions[ i ] );
        group.add( l );
    }

    var geom = new THREE.PlaneBufferGeometry( size * 4,size * 4, 1,1 );
    mesh = new THREE.Mesh( geom, buildingMaterial );
    mesh.rotateX( -Math.PI/2 );
    group.add(mesh);
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
    light.position.y += 1000;

    renderer.render( scene, camera );

}
