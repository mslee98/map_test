var taxis = function( exports ){


    var renderTaxi = false;
    var taxiCurveId = 2;
    var taxiCurves = [];
    var taxiMaterials = [];
    var taxiTime = [];
    var taxiCamera;
    var tg = new THREE.Vector3();

    var taxis = [
        '../../taxi/cabspottingdata/new_enyenewl.txt',
        '../../taxi/cabspottingdata/new_ockoac.txt',
        '../../taxi/cabspottingdata/new_ikdagcy.txt',
        '../../taxi/cabspottingdata/new_ayshekki.txt',
        '../../taxi/cabspottingdata/new_ancorjo.txt',
        '../../taxi/cabspottingdata/new_idvowwed.txt',
        '../../taxi/cabspottingdata/new_iatmeuns.txt',
        '../../taxi/cabspottingdata/new_unwrain.txt',
        '../../taxi/cabspottingdata/new_atsfiv.txt',
        '../../taxi/cabspottingdata/new_aupclik.txt',
        /*
        '../../taxi/cabspottingdata/new_afmorc.txt',
        '../../taxi/cabspottingdata/new_ochotcil.txt',
        '../../taxi/cabspottingdata/new_enkkand.txt',
        '../../taxi/cabspottingdata/new_amwibs.txt',
        '../../taxi/cabspottingdata/new_ibflsruc.txt',
        '../../taxi/cabspottingdata/new_esnddceb.txt',
        '../../taxi/cabspottingdata/new_objoyhi.txt',
        '../../taxi/cabspottingdata/new_amciuca.txt',
        '../../taxi/cabspottingdata/new_okblahed.txt',
        '../../taxi/cabspottingdata/new_arlwras.txt',
        //*/
        ///*
         '../../taxi/cabspottingdata/new_afpansh.txt',
         '../../taxi/cabspottingdata/new_oadwowd.txt',
         '../../taxi/cabspottingdata/new_arcuim.txt',
         '../../taxi/cabspottingdata/new_uggdye.txt',
         '../../taxi/cabspottingdata/new_atfrim.txt',
         //*/
         /*
         '../../taxi/cabspottingdata/new_edomboys.txt',
         '../../taxi/cabspottingdata/new_egnatab.txt',
         '../../taxi/cabspottingdata/new_oxdoghic.txt',
         '../../taxi/cabspottingdata/new_onwohyss.txt',
         '../../taxi/cabspottingdata/new_edjiye.txt',
         '../../taxi/cabspottingdata/new_osoccef.txt',
         '../../taxi/cabspottingdata/new_ifelas.txt',
         '../../taxi/cabspottingdata/new_imwrytsy.txt',
         '../../taxi/cabspottingdata/new_owbsuscs.txt',
         '../../taxi/cabspottingdata/new_ockihoba.txt',
         '../../taxi/cabspottingdata/new_aichash.txt',
         '../../taxi/cabspottingdata/new_epabcadu.txt',
         '../../taxi/cabspottingdata/new_orkbats.txt',
         '../../taxi/cabspottingdata/new_eitpem.txt',
         '../../taxi/cabspottingdata/new_eccest.txt',
         '../../taxi/cabspottingdata/new_iawxben.txt',
         '../../taxi/cabspottingdata/new_ecjeody.txt',
         '../../taxi/cabspottingdata/new_ofodwo.txt',
         '../../taxi/cabspottingdata/new_iapberci.txt',
         '../../taxi/cabspottingdata/new_oocsodpl.txt',
         '../../taxi/cabspottingdata/new_itquirla.txt',
         '../../taxi/cabspottingdata/new_adnerst.txt',
         '../../taxi/cabspottingdata/new_eenjoug.txt',
         '../../taxi/cabspottingdata/new_okquakar.txt',
         '../../taxi/cabspottingdata/new_ippfeip.txt'
         //*/
    ];
    exports.init = function( group, camera ){

        exports.taxiCamera = camera.clone();//new THREE.PerspectiveCamera( 40, camera.aspect, .1, 10000000 );

        var tot = taxis.length;
        var taxi = new XMLHttpRequest();
        taxi.onload = function(e){

            var geom = new THREE.Geometry();

            var vertices = e.target.responseText.split( '\n' ).map(function( s, i ) {
                var ll = s.split(' ');
                ll = [parseFloat(ll[0]), parseFloat(ll[1])];

                var xy = map.mercator.latLonToMeters( -ll[0], ll[1], map.zoom);
                geom.vertices.push( new THREE.Vector3( xy[0], 10 + ( tot - taxis.length  ), xy[1] ) );

                return ll;
            });

            /*
             var d, avg = 0;
             var min = Math.pow( 2,53 );
             var max = -Math.pow( 2,53 );
             vertices.forEach( function(v, i, a){
             if( i > 0 ) {
             d = distance( vertices[i - 1][0], vertices[i - 1][1], vertices[i][0], vertices[i][1]);
             //min = Math.min(d, min);
             //max = Math.max(d, max);

             if( !isNaN(d ) )avg += d;
             //console.log( d, avg )
             }
             });

             avg /= vertices.length;
             var maxDist = avg * 2;
             for( var i = 0; i < vertices.length-1; i++ ){

             d = distance( vertices[i][0], vertices[i][1], vertices[i+1][0], vertices[i+1][1]);
             if( d < maxDist ){

             var xy = map.mercator.latLonToMeters( -vertices[i][0], vertices[i][1], map.zoom);
             geom.vertices.push( new THREE.Vector3( xy[0], 5 + tot - taxis.length, xy[1] ) );

             xy = map.mercator.latLonToMeters( -vertices[i+1][0], vertices[i+1][1], map.zoom);
             geom.vertices.push( new THREE.Vector3( xy[0], 5 + tot - taxis.length, xy[1] ) );
             }
             }
             ///*/

            //var col  ="#" + ( 0xFF<<16| ~~( ( ( tot-taxis.length ) / tot ) * 0xAA ) << 8 | 0 ).toString( 16 );

            var col  = ~~( ( ( tot-taxis.length ) / tot ) *  60 );
            var taxiMaterial = new THREE.LineBasicMaterial( {
                color:new THREE.Color( "hsl("+ col +", 100%, 50%)" ),
                blending:THREE.AdditiveBlending,
                transparent:true,
                opacity:.05
            } );

            var m = new THREE.Line( geom, taxiMaterial );
            group.add( m );

            taxiCurves.push(geom.vertices );
            taxiMaterials.push(taxiMaterial);
            taxiTime.push( taxis.length / tot );

            if( taxis.length > 0 ){
                taxi.open( "GET", taxis.shift() );
                taxi.send();
            }else{
                taxiTime.sort(function( a,b){return Math.random() < .5 ? - 1 : 1; });
            }

            renderTaxi = true;
        };

        taxi.open( "GET", taxis.shift() );
        taxi.send();
    };

    exports.nextTaxi = function(t){taxiCurveId++; taxiCurveId%=taxiCurves.length; };
    exports.updateTaxiCam = function(t){

        var vertices = taxiCurves[taxiCurveId];

        var pos = getPositionAt(vertices, t);
        exports.taxiCamera.position.x += ( pos.x - exports.taxiCamera.position.x  ) * .1;
        exports.taxiCamera.position.y += ( 300   - exports.taxiCamera.position.y  ) * .1;
        exports.taxiCamera.position.z += ( pos.y - exports.taxiCamera.position.z  ) * .1;
        var xy = getPositionAt(vertices, t+0.0001);
        tg.x += ( xy.x  - tg.x ) * .95;
        tg.y += ( 25     - tg.y ) * .95;
        tg.z += ( xy.y  - tg.z ) * .95;
        exports.taxiCamera.lookAt( tg );

    };

    var start = Date.now();
    exports.update = function(){
        var t = ( Date.now() - start )  * 0.001;
        taxiMaterials.forEach(function( m, i ){
            m.opacity = ( .5 + Math.sin( t + Math.PI * 2 * taxiTime[i] ) * .5 ) * .1;
        });
    };

    exports.bright = function(){
       taxiMaterials.forEach( function(m, i){

           var col  = 150 + ~~( ( ( taxiMaterials.length - i ) / taxiMaterials.length ) *  120 );
           m.color = new THREE.Color( "hsl("+ col +", 100%, 50%)" );
           m.blending = THREE.NormalBlending;

       }) ;
    };
    exports.dark = function(){
        taxiMaterials.forEach( function(m, i){

            var col  = ~~( ( ( taxiMaterials.length - i ) / taxiMaterials.length ) *  60 );
            m.color = new THREE.Color( "hsl("+ col +", 100%, 50%)" );
            m.blending = THREE.AdditiveBlending;

        }) ;
    };
    return exports;

}({});