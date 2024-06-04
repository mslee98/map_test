/**
 * Created by nico on 09/03/2016.
 */
var dino = function(exports){

    var explosions = [];
    var planeGeom = new THREE.PlaneBufferGeometry(512,512, 1,1);
    function getRandomBoom(xy, scale, radius){

        var t = exports.boom.clone();
        t.needsUpdate = true;
        var mat = new THREE.MeshBasicMaterial({transparent:true, map:t, blending:THREE.AdditiveBlending, side:THREE.DoubleSide });
        t.repeat.x = 1 / 4;
        t.repeat.y = 1 / 4;

        var m = new THREE.Mesh( planeGeom, mat );

        var offset = new THREE.Vector2( (Math.random()-.5 )* radius , ( Math.random()-.5 ) * radius );
        m.position.x = xy[0] + offset.x;
        m.position.y = 100 + Math.random() * 500;
        m.position.z = xy[1] + offset.y;
        m.scale.multiplyScalar( scale );

        //storing props like there's no tomorrow
        m.xy = xy;
        m.t = t;
        m.radius = radius;
        m.time = parseInt( Math.random() * 16 );

        return m;

    }

    exports.bright = function() {
        exports.material.reflectivity = .05;
        exports.material.shininess = 1;
        exports.material.emissive = new THREE.Color(0x202020);
        explosions.forEach( function( m ){m.blending = THREE.NormalBlending; })
    };

    exports.dark = function() {
        exports.material.reflectivity = .95;
        exports.material.shininess = 15;
        exports.material.emissive = new THREE.Color(0x000000);
        explosions.forEach( function( m ){m.blending = THREE.AdditiveBlending; })
    };

    exports.update = function() {

        explosions.forEach(function (m) {

            m.time %= 16;
            m.t.offset.x = parseInt(m.time % 4) * .25;
            m.t.offset.y = 1 - parseInt(m.time / 4) * .25 - .25;
            m.lookAt(exports.camera.position);
            m.time++;
            if (m.time == 16) {

                var offset = new THREE.Vector2((Math.random() - .5 ) * m.radius, ( Math.random() - .5 ) * m.radius);
                m.position.x = m.xy[0] + offset.x;
                m.position.y = 100 + Math.random() * 500;
                m.position.z = m.xy[1] + offset.y;

                m.scale.set(1,1,1);
                m.scale.multiplyScalar(.5 + Math.random() * 2 );

            }
        });
    };

    exports.init = function( scene, camera, xy, cubeMap, cb ){


        var bl = new THREE.BinaryLoader();
        var tl = new THREE.TextureLoader();

        exports.camera = camera;

        var diffuse = tl.load( "data/models/diffuse.jpg", function(){diffuse.needsUpdat = true; });
        var bump = tl.load( "data/models/bump.jpg", function(){bump.needsUpdat = true; });
        exports.material = new THREE.MeshPhongMaterial( {

            color:0xFFFFFF,
            map:diffuse,

            bumpMap:bump,
            bumpScale: 15,
            shininess: 15,

            envMap:cubeMap,
            reflectivity:.95

        } );
        bl.load( 'data/models/trex.js', function(e){


            var m = new THREE.Mesh( e, exports.material );

            m.position.x = xy[0];
            m.position.z = xy[1];
            m.scale.multiplyScalar( 150 );

            scene.add( m );
            exports.mesh = m;

            ///BOOM !
            exports.boom = tl.load( "img/boom.png", function(){
                exports.boom.needsUpdat = true;

                for( var i = 0; i < 25; i++ ){
                    var boom = getRandomBoom( xy, 1, 10000 );
                    explosions.push( boom );
                    scene.add( boom );
                }
            });

            if( cb ) cb();
        } );
    };

    return exports;

}({});
