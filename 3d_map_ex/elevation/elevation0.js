

var w = window.innerWidth;
var h = window.innerHeight;
var scene, camera, renderer, mesh, group, target, refEarth;
var mat, tex_map, tex_ele;

var size = 512;

var token = "pk.eyJ1IjoiZGlnaXRhbGdsb2JlIiwiYSI6ImNpeTJucHlxYjAwMnMyd2xhZGVmNWxvbGEifQ.fPmMe_YS3aMwRv-12WRQ5g";
var provider = "http://api.tiles.mapbox.com/v4/digitalglobe.nal0mpda/{z}/{x}/{y}.png?access_token=" + token;
var domains = "01,02,03,04".split( ',' );
var map = new Map( provider, domains, size, size, 2, 11 );
var ele_provider = "https://elevation-tiles-prod.s3.amazonaws.com/terrarium/{z}/{x}/{y}.png";
var ele = new Map( ele_provider, [], size, size,2,10 );


var places = [
    //lisbon
    [38.7166700, -9.1333300 ],
    //new york
    [40.7142700, -74.0059700 ],
    //fosse des mariannes
    [11.35,142.2],
    //mont everest
    [27.9833,86.9333]
];


var start = 0;
var sl = new ShaderLoader();
sl.loadShaders( {
    elevation_0_fs:"",
    elevation_0_vs:""
}, "glsl/elevation/", onShadersLoaded );

function onShadersLoaded() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 40, w / h, 10, 10000 );
    camera.position.y = 750;
    camera.position.z = 1250;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(w, h);
    document.body.appendChild(renderer.domElement);

    map.eventEmitter.on( Map.ON_TEXTURE_UPDATE, onTextureUpdate );
    ele.eventEmitter.on( Map.ON_TEXTURE_UPDATE, onTextureUpdate );

    controls.add( map );
    controls.add( ele );
    controls.addListeners(renderer.domElement);


    tex_map = new THREE.Texture( map.canvas, null, THREE.wrapS, THREE.wrapT, THREE.LinearFilter, THREE.LinearFilter  );
    tex_ele = new THREE.Texture( ele.canvas, null, THREE.wrapS, THREE.wrapT, THREE.LinearFilter, THREE.LinearFilter  );

    mat = new THREE.ShaderMaterial({
        uniforms: {
            map: {type: "t", value: tex_map },
            ele: {type: "t", value: tex_ele },
            scale: {type: "f", value: 0 }
        },
        vertexShader: ShaderLoader.get("elevation_0_vs"),
        fragmentShader: ShaderLoader.get("elevation_0_fs")
    });

    group = new THREE.Group();

    var geom = new THREE.PlaneBufferGeometry( 1024,1024, 256,256 );
    mesh = new THREE.Mesh( geom, mat );
    mesh.rotateX( -Math.PI/2 );
    group.add(mesh);
    scene.add( group );

    target = new THREE.Vector3(0,-150,0);
    refEarth = new THREE.Mesh( new THREE.IcosahedronGeometry( 6371000, 5 ), new THREE.MeshBasicMaterial( {color:0xFFFFFF, transparent:true, opacity:.5} ) );
    group.add( refEarth );

    ele.setView( places[0][0], places[0][1], document.getElementById( 'zoom').value );
    map.setView( places[0][0], places[0][1], document.getElementById( 'zoom').value );

    renderer.domElement.addEventListener( "mousemove", function(e){
        group.rotation.y = ( window.innerWidth / 2 -e.clientX )/window.innerWidth  * Math.PI / 180 * 90;
    });
    document.getElementById( 'zoom' ).addEventListener( "change", function(e){ map.zoom = ele.zoom = e.target.value; goto(); },false );

    document.getElementById( 'lisbon'   ).addEventListener( "mousedown", function(e){ goto( places[0][0], places[0][1] ); },false );
    document.getElementById( 'new_york' ).addEventListener( "mousedown", function(e){ goto( places[1][0], places[1][1] ); },false );
    document.getElementById( 'mariannes'    ).addEventListener( "mousedown", function(e){ goto( places[2][0], places[2][1] ); },false );
    document.getElementById( 'everest'  ).addEventListener( "mousedown", function(e){ goto( places[3][0], places[3][1] ); },false );

    update();


}
function goto( lat, lng ){

    ele.setView( lat, lng );
    map.setView( lat, lng );
}

window.onresize = function(e)
{
    w = window.innerWidth;
    h = window.innerHeight;
    renderer.setSize( w,h );
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
};

function onTextureUpdate()
{
    tex_map.needsUpdate = true;
    tex_ele.needsUpdate = true;
}

function update(){

    requestAnimationFrame(update);
    //map.setView( ele.latitude, ele.longitude, ele.zoom );

    var s =  1 / map.resolution( Math.min( map.maxZoom-1, map.zoom ) );
    refEarth.scale.set( s,s,s );
    refEarth.position.y = - ( s * ( 6371000 ) + 2 );
    mat.uniforms.scale.value = s * document.getElementById( 'scale').value;

    camera.lookAt( target );

    renderer.render( scene, camera );

}