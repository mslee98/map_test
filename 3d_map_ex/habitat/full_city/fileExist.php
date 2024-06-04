<?php

    $url = isset( $_GET[ "url" ] ) ? $_GET[ 'url' ] : "";

    if( file_exists( $url ) ){

        if ( 0 == filesize( $url ) ){

            echo '0';

        }else{

            echo '1';

        }

    } else {

        echo '0';
    }
?>