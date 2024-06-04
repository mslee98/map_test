var Skybox = function(){

    var loader = new THREE.ImageLoader();
    var getSide = function ( image, x, y, size ) {

        var canvas = document.createElement( 'canvas' );
        canvas.width = size;
        canvas.height = size;

        var context = canvas.getContext( '2d' );
        //context.drawImage( image, x * size, y * size, size, size, 0,0,size, size );
        context.drawImage( image, x * size + 1, y * size + 1, size-2, size-2, 0,0,size, size );

        return canvas;

    };

    function Skybox( url, size, scale, cb ){

        var scope = this;

        loader.load( url, function ( image ) {

            var cubeMap = new THREE.CubeTexture( [] );
            cubeMap.format = THREE.RGBFormat;
            cubeMap.flipY = true;

            cubeMap.images[ 0 ] = getSide( image, 2, 1, size ); // px
            cubeMap.images[ 1 ] = getSide( image, 0, 1, size ); // nx
            cubeMap.images[ 2 ] = getSide( image, 1, 0, size ); // py
            cubeMap.images[ 3 ] = getSide( image, 1, 2, size ); // ny
            cubeMap.images[ 4 ] = getSide( image, 1, 1, size ); // pz
            cubeMap.images[ 5 ] = getSide( image, 3, 1, size ); // nz
            cubeMap.needsUpdate = true;

            scope.cubeMap = cubeMap;

            if( Boolean( scale ) ){

                var cubeShader = THREE.ShaderLib['cube'];
                cubeShader.uniforms['tCube'].value = cubeMap;
                var material = new THREE.ShaderMaterial( {
                    fragmentShader: cubeShader.fragmentShader,
                    vertexShader: cubeShader.vertexShader,
                    uniforms: cubeShader.uniforms,
                    depthWrite: false,
                    side: THREE.BackSide
                });
                scope.mesh = new THREE.Mesh(new THREE.BoxGeometry( scale, scale, scale ),material );

            }

            if( cb ) cb();

        } );

    }

    var _p = Skybox.prototype;
    _p.constructor = Skybox;
    return Skybox;

}();
