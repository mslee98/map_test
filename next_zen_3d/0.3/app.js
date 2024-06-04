//https://github.com/mapbox/earcut
var w = window.innerWidth;
var h = window.innerHeight;
var scene, camera, renderer, mesh, group;

var meshScale = 2;
var size = 512;

var mat, depth, light;
var tex_map;

//var lat = 37.5666805;
//var lng = 126.9784147;

//SAN FRANCISCO
var lat = 37.773972;
var lng = -122.431297;

//seoul
var lat = 37.5666805;
var lng = 126.9784147;

var zl  = 16;
var start = 0;

var controls;

window.onload = function(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 40, w / h,.1, 40000 );

    renderer = new THREE.WebGLRenderer({logarithmicDepthBuffer:true});
    renderer.setSize(w, h);

    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls( camera );
    controls.maxPolarAngle = (Math.PI);

    scene.add( new THREE.AmbientLight(0x101010) );
    light = new THREE.PointLight( 0xffffff, 1, 0 );
    scene.add( light );
    
    scene.fog = new THREE.Fog(0xffffff,10, 100);

    group = new THREE.Group();

    var xy = map.mercator.latLonToMeters( -lat, lng, map.zoom);
    //camera.position.x = -13640768.438104622;
    //camera.position.y = 14615.668647974027;
    //camera.position.z = -4528503.340282675;
    camera.position.x = 14136800.808392255;
    camera.position.y = 5683.565400638121;
    camera.position.z = -4494748.458770682;
    controls.target.x = xy[0];
    controls.target.z = xy[1];
    camera.lookAt( controls.target );

    // var test_geo = new THREE.BoxGeometry(100,100,100,1,1,1);
    // var test_mar = new THREE.MeshPhongMaterial({color : 0x515151});
    // var test_mesh = new THREE.Mesh(test_geo, test_mar);
    // test_mesh.position.set(14135172.466141123,0,-4518391.85948968)
    // group.add(test_mesh);
    // scene.add( group );


    const loader = new THREE.OBJLoader();

    loader.load('/Sting-Sword-lowpoly.obj', function(object) {
        console.log("gltf", object)
        object.position.x = 14135172.466141123;
        object.position.y = 400
        object.position.z = -4518391.85948968;
        object.scale.x = 6;
        object.scale.y = 6;
        object.scale.z = 6;
        object.rotation.x = -Math.PI/2;
        object.traverse(function(child) {
            child.material = new THREE.MeshPhongMaterial({color : 0x515151});
        });
        


        group.add(object);
    });

    scene.add(group);

    camera.lookAt(group.position);
    
    builder.init(scene);

    map.init(size, true);
    map.setView( -lat, lng, zl );

    start = Date.now();
    //materials.dark();
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

    var ll = map.mercator.metersToLatLon( controls.target.x, -controls.target.z, map.zoom);
    map.setView(ll[0], ll[1]);

    light.position.copy( camera.position );
    light.position.y += 1000;

    renderer.setClearColor(0x6C7A8C, 1);
    renderer.render( scene, camera );

}