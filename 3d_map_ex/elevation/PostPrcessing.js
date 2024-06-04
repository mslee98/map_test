var PostPrcessing = function( exports ){

    var orthoCamera, rtScene, rtt, rttMesh, depth, startTime;
    exports.init = function( width, height, scene, camera, renderer ){

        rtscene = new THREE.Scene();
        orthoCamera = new THREE.OrthographicCamera(-1,1,1,-1,1/Math.pow( 2, 53 ),1 );

        var options = {
            minFilter: THREE.LinearFilter,//important as we want to sample square pixels
            magFilter: THREE.LinearFilter,//
            format: THREE.RGBAFormat,//could be RGBAFormat
            type:THREE.FloatType//important as we need precise coordinates (not ints)
        };
        rtt = new THREE.WebGLRenderTarget( width,height, options);
        depth = new THREE.WebGLRenderTarget( width,height, options);

        //default
        exports.fxMaterial = new THREE.ShaderMaterial({
            uniforms : {
                texture : {type:"t", value:rtt},
                depth : {type:"t", value:depth},
                time : {type:"f", value:0},

                //offset: {type: "fv1", value: [ 0.0, 1.0, 2.0, 3.0, 4.0 ] },
                //weight: {type: "fv1", value: [ 0.2270270270, 0.1945945946, 0.1216216216, 0.0540540541, 0.0162162162 ] },

                offset: {type: "fv1", value: [ 0.0, 1.3846153846, 3.2307692308 ] },
                weight: {type: "fv1", value: [ 0.2270270270, 0.3162162162, 0.0702702703 ] },

                resolution: {type:"v2", value:new THREE.Vector2( width, height ) }
            },
            vertexShader : "void main(){ gl_Position =  projectionMatrix * modelViewMatrix * vec4( position, 1. ); }",
            fragmentShader : ShaderLoader.get( "fx_fs" ),
            transparent : true
        });

        //create a bi-unit quadrilateral and uses the simulation material to update the Float Texture
        var geom = new THREE.BufferGeometry();
        geom.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array([   -1,-1,0, 1,-1,0, 1,1,0, -1,-1, 0, 1, 1, 0, -1,1,0 ]), 3 ) );
        geom.addAttribute( 'uv', new THREE.BufferAttribute( new Float32Array([   0,1, 1,1, 1,0,     0,1, 1,0, 0,0 ]), 2 ) );
        rttMesh = new THREE.Mesh( geom, exports.fxMaterial );

        rtscene.add( rttMesh );

        exports.scene = scene;
        exports.camera = camera;
        exports.renderer = renderer;
        exports.depthMaterial = null;
        startTime = Date.now();
    };

    exports.resize = function( w,h ){

        rtt.setSize( w,h );
        depth.setSize(w,h);

        exports.fxMaterial.uniforms.resolution.value.x = w;
        exports.fxMaterial.uniforms.resolution.value.y = h;

    };

    exports.render = function(){

        //render scene and store to renderTarget
        exports.scene.overrideMaterial = null;
        exports.renderer.render( exports.scene, exports.camera, rtt, true );
        exports.fxMaterial.uniforms.texture.value = rtt;
        exports.fxMaterial.uniforms.time.value = ( Date.now() - startTime ) *.001;
        rtt.needsUpdate = true;

        //render depth
        if( exports.depthMaterial )
        {
            exports.scene.overrideMaterial = exports.depthMaterial;
            exports.renderer.render( exports.scene, exports.camera, depth, true );
            exports.fxMaterial.uniforms.depth.value = depth;
            depth.needsUpdate = true;
            exports.scene.overrideMaterial = null;
        }


        //render composite
        exports.renderer.render( rtscene, orthoCamera );

    };
    return exports;
}({});