import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';

const w = window.innerWidth;
const h = window.innerHeight;
let scene, camera, renderer, light, group;
let controls;

//seoul
//const lat = 37.5666805;
//const lng = 126.9784147;

//SAN FRANCISCO
var lat = 37.773972;
var lng = -122.431297;

const zl = 16;

let meshScale = 2;
let size = 512;
const id = 0;

const map = new Map( '', null, size, size, 0, 16);
map.eventEmitter.on(Map.ON_TILE_LOADED, function( t ) {
    // console.log(t);
    let x = t.tx;
    let y = t.ty;
    let z = map.zoom;
    
    // console.log(x,y,z);
    
    const req = new XMLHttpRequest();
    req.onload = function(e) {
        if(req.readyState === 4) {
            let json = JSON.parse(e.target.responseText);
            build(t, json);
        }
    };
    let url = 'https://tile.nextzen.org/tilezen/vector/v1/512/all/'+z+'/'+x+'/'+y+'.json?api_key=K8i0iT__Qsq5_JzJflm_vw';
    req.open("GET", url);
    req.send();
});

let start = 0;
var buildingMaterial = new THREE.MeshLambertMaterial( {color:0xFFFFFF} );

window.onload = function(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 40, w / h,.1, 40000 );

    renderer = new THREE.WebGLRenderer({logarithmicDepthBuffer:true});
    renderer.setSize(w, h);

    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    //controls.maxPolarAngle = (Math.PI/2)/2;

    scene.add( new THREE.AmbientLight(0x101010) );
    light = new THREE.PointLight( 0xffffff, 1, 0 );
    scene.add( light );
    
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array( [
        -1.0, -1.0,  1.0,
         1.0, -1.0,  1.0,
         1.0,  1.0,  1.0,
    
         1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0, -1.0,  1.0
    ] );
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    const mesh = new THREE.Mesh( geometry, material );
    scene.add(mesh);

    group = new THREE.Group();

    var xy = map.mercator.latLonToMeters( -lat, lng, map.zoom);

    camera.position.x = 14136800.808392255;
    camera.position.y = 5683.565400638121;
    camera.position.z = -4494748.458770682;

    controls.target.x = xy[0];
    controls.target.z = xy[1];

    camera.lookAt( controls.target );

    scene.add( group );
    camera.lookAt(group.position);
    map.setView( -lat, lng, zl);

    start = Date.now();

    update();
};

function build( tile, json ) {
    // console.log(json);
    json.buildings.features.forEach( function( feat ) {
        if( !isNaN( feat.geometry.coordinates[0] ) ){
            return;
        }

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

                //var xy = map.latLonToPixels( lat, lng, map.zoom);
                var xy = map.mercator.latLonToMeters(-lat, lng, map.zoom);

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
        
        var extrusion = Extrusion( vertices, edges, buildingMaterial, height, uvMin, uvMax );

        group.add( extrusion );
        // buildings[ uid ] = extrusion;

    });
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

    var ll = map.mercator.metersToLatLon( controls.target.x, -controls.target.z, map.zoom);
    map.setView(ll[0], ll[1]);

    light.position.copy( camera.position );
    light.position.y += 1000;

    renderer.setClearColor(0x6C7A8C, 1);
    renderer.render( scene, camera );

}

function Extrusion(points, edges, material, height, uvMin, uvMax) {
    
    var inc = 0, p, i;

        //vertex pool
        var vertices = new Float32Array( points.length * 3 * 2  );
        for ( i = 0; i < points.length*2; i++ ) {
            p = points[ i % points.length ];
            vertices[inc++] = p[0];
            vertices[inc++] = i >= points.length ? height : 0;
            vertices[inc++] = p[1];
        }

        //uvs
        var uvs = new Float32Array( points.length * 2 * 2 );
        if( uvMin == null )uvMin = new THREE.Vector2(0,0);
        if( uvMax == null )uvMax = new THREE.Vector2(1,1);

        //get uv bounds
        var min = new THREE.Vector2( Math.POSITIVE_INFINITY, Math.POSITIVE_INFINITY );
        var max = new THREE.Vector2( Math.NEGATIVE_INFINITY, Math.NEGATIVE_INFINITY );
        inc = 0;
        for ( i = 0; i < points.length; i++ ){

            p = points[ i ];
            min.x = Math.min( p[0], min.x );
            min.y = Math.min( p[1], min.y );
            max.x = Math.max( p[0], max.x );
            max.y = Math.max( p[1], max.y );
        }

        //map uvs
        var uDelta = uvMax.x - uvMin.x;
        var vDelta = uvMax.y - uvMin.y;
        inc = 0;
        for( i = 0; i < points.length * 2; i++){
            p = points[ i % points.length ];
            uvs[ inc++ ] = uvMin.x + ( ( p[0] - min.x ) / ( max.x - min.x ) ) * uDelta;
            uvs[ inc++ ] = uvMin.y + ( ( p[1] - min.y ) / ( max.y - min.y ) ) * vDelta;
        }

        //tesselation: top
        cleanPSLG( points, edges );
        var result = cdt2d( points, edges, {exterior: false} );

        var capIndices = new Uint32Array( result.length * 3 );
        inc = 0;
        for ( i = 0; i < result.length; i++) {
            capIndices[inc++] = result[i][ 0 ] + points.length;
            capIndices[inc++] = result[i][ 1 ] + points.length;
            capIndices[inc++] = result[i][ 2 ] + points.length;
        }
        capIndices.reverse();

        //tesselation sides: extrusion
        var sideIndices = new Uint32Array( points.length * 3 * 2 );
        var sides = points.length;
        var step = 0, back, j, i0, i1, i2, i3;
        inc = 0;
        for ( i = 0; i < 2; i++ ){

            //create faces
            if ( step > 0 )
            {
                back = step - sides;
                for ( j = 0; j < sides; j++ ){

                    i0 = back + j;
                    i1 = back + ( j + 1 ) % sides;
                    i2 = step + j;
                    i3 = step + ( j + 1 ) % sides;

                    sideIndices[inc++] = i1;
                    sideIndices[inc++] = i0;
                    sideIndices[inc++] = i2;

                    sideIndices[inc++] = i1;
                    sideIndices[inc++] = i2;
                    sideIndices[inc++] = i3;

                }
            }
            step += sides;
        }

        //merging faces indices
        var indices = new Uint32Array( sideIndices.length + capIndices.length );
        indices.set( sideIndices );
        indices.set( capIndices, sideIndices.length );

        //build geometry
        var geom = new THREE.BufferGeometry();
        geom.setIndex( new THREE.BufferAttribute( indices, 1 ) );
        geom.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        geom.setAttribute( 'normal', new THREE.BufferAttribute( vertices, 3 ) );
        geom.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );

        geom.needsUpdate = true;
        geom.computeBoundingSphere();
        geom.computeVertexNormals();

        const buildings_3dobject = new THREE.Mesh( geom, material );
        group.add(buildings_3dobject);
}
