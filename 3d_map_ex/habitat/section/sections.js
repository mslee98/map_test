
var w = window.innerWidth;
var h = window.innerHeight;
var scene, camera, renderer, mesh, group;

var size = 512;
var map = new Map( '', '', size, size, 0, 18 );
var id = 0;

map.eventEmitter.on( Map.ON_TILE_LOADED, function( t ){

    var x = t.tx;
    var y = t.ty;
    var z = map.zoom;
    var req = new XMLHttpRequest();
    req.onload = function(e){
        var json = JSON.parse(e.target.responseText );
        build( json );
    };
    var url = 'http://tile.mapzen.com/mapzen/vector/v1/buildings/'+z+'/'+x+'/'+y+'.json?api_key=mapzen-foW3wh2';
    req.open( "GET", url );
    req.send();
});

var buildings = {};
var colors = [0xFFCC000, 0xCC0000, 0x00CC99, 0x0066CC ];
var materials = colors.map( function( col, i ){return new THREE.MeshBasicMaterial({ color:col, side:THREE.DoubleSide, wireframe:i%2==0 });});

function build( json ) {

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

        var height = 10;
        var section = new Section( vertices, edges, materials[id++%materials.length], height );
        group.add( section );
        // buildings[ uid ] = section;

    });
}


var lat  = 48.87391397959806;
var lng  = 2.308752868652376;

//senlis...
lat = 49.20685965504833;
lng = 2.5831550292968415;

var zl  = 17;
window.onload = function(){

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 40, w / h,.1, 10000 );
    camera.position.y = 600;
    camera.position.z = 0;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(w, h);
    document.body.appendChild(renderer.domElement);
    new THREE.OrbitControls( camera );

    group = new THREE.Group();
    scene.add(group);
    camera.lookAt( group.position );
    map.setView( lat, lng, zl );

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
    renderer.render( scene, camera );

}
