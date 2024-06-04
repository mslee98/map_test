var w = window.innerWidth;
var h = window.innerHeight;
var scene, camera, renderer, mesh, group;

var size = 512;
var meshScale = 2;
var map = new Map( '', null, size, size, 0, 18 );
var id = 0;

map.eventEmitter.on( Map.ON_TILE_LOADED, function( t ){

    var x = t.tx;
    var y = t.ty;
    var z = map.zoom;
    var req = new XMLHttpRequest();
    req.onload = function(e)
    {
        var json = JSON.parse(e.target.responseText );
        build( t, json );
    };

    var url = 'http://tile.mapzen.com/mapzen/vector/v1/buildings/'+z+'/'+x+'/'+y+'.json?api_key=mapzen-foW3wh2';
    req.open( "GET", url );//'http://tile.openstreetmap.us/vectiles-buildings/'+z+'/'+x+'/'+y+'.json' );
    req.send();
});


var buildings = {};
var colors = [0xFFCC000, 0xCC0000, 0x00CC99, 0x0066CC ];
var red = new THREE.LineBasicMaterial({color: 0xFF0000 });
var white = new THREE.LineBasicMaterial({color: 0xFFFFFF });
function build( tile, json ) {

    json.features.forEach( function( feat ) {

        // if (buildings[feat.id] != null)return;

        var geometry = new THREE.Geometry();

        if (feat.geometry.coordinates.length > 1) {

            var material = new THREE.LineBasicMaterial({color: colors[( id++ % colors.length )]});

            console.log(feat.geometry.coordinates);
            feat.geometry.coordinates.forEach(function (coordinates) {

                coordinates.forEach(function (coords) {

                    var lng = coords[0];
                    var lat = coords[1];
                    var xy = map.latLonToPixels(lat, lng, map.zoom);

                    var x = meshScale * ( xy[0] - size / 2 );
                    var y = meshScale * 5;
                    var z = meshScale * ( xy[1] - size / 2 );

                    geometry.vertices.push(new THREE.Vector3(x, y, z));

                });
                var line = new THREE.Line(geometry, red );
                group.add(line);

                buildings[feat.id] = line;
            });
        }
        else
        {
            feat.geometry.coordinates[0].forEach( function( coords ){

                var lng = coords[0];
                var lat = coords[1];
                var xy = map.latLonToPixels(  lat,lng, map.zoom );

                var x = meshScale * ( xy[0] - size / 2 );
                var y = meshScale * 5;
                var z = meshScale * ( xy[1] - size / 2 );

                geometry.vertices.push( new THREE.Vector3(x,y,z ) );

            });

            var line = new THREE.Line( geometry, white );
            group.add( line );
            buildings[ feat.id ] = line;

        }


    });

}



var mat, depth;
var tex_map;

var lat  = 48.87391397959806;
var lng  = 2.328752868652376;
//senlis...
//lat = 49.20685965504833;
//lng = 2.5831550292968415;

var zl  = 17;
var start = 0;
window.onload = function() {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 40, w / h,.1, 10000 );
    camera.position.y = 500;
    camera.position.z = 450;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(w, h);

    document.body.appendChild(renderer.domElement);
    new THREE.OrbitControls( camera );

    group = new THREE.Group();
    scene.add( group );

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
