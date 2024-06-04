function degreesToDecimal( dlat, mlat, slat, dlon, mlon, slon ){

    var latsign = dlat < 0 ? - 1 : 1;
    var lonsign = dlon < 0 ? - 1 : 1;

    absdlat = Math.abs( Math.round(dlat * 1000000.));
    mlat = Math.abs(Math.round(mlat * 1000000.)/1000000);
    absmlat = Math.abs(Math.round(mlat * 1000000.));

    slat = Math.abs(Math.round(slat * 1000000.)/1000000);
    absslat = Math.abs(Math.round(slat * 1000000.));

    absdlon = Math.abs( Math.round(dlon * 1000000.));
    mlon = Math.abs(Math.round(mlon * 1000000.)/1000000);
    absmlon = Math.abs(Math.round(mlon * 1000000));

    slon = Math.abs(Math.round( slon * 1000000.)/1000000);
    absslon = Math.abs(Math.round( slon * 1000000.));

    alat = Math.round(absdlat + (absmlat/60.) + (absslat/3600.) ) * latsign/1000000;
    alon = Math.round(absdlon + (absmlon/60) + (absslon/3600) ) * lonsign/1000000;

    return [ alat, alon ];

}
/*

 <form method="POST" name="form11" enctype="application/x-www-form-urlencoded ">

 <table summary="" width="600" border="0" bgcolor='#FECBDF' cellpadding='7'>

 <tr><td><br>
 <label for="DegreesLat"><nobr>Enter Decimal Latitude:&nbsp;&nbsp;</nobr></label></td>
 <td><br>
 <nobr>
 <input name="decimalLat" type="INT" size=11 value="" maxlength="10" id="DegreesLat" style="font-size: 12pt" tabindex="11" onBlur="

 if(form11.decimalLat.value < 0)  { signlat = -1; }
 latAbs = Math.abs( Math.round(form11.decimalLat.value * 1000000.));

 //Math.round is used to eliminate the small error caused by rounding in the computer:
 //e.g. 0.2 is not the same as 0.20000000000284

 //Error checks
 if(latAbs > (90 * 1000000)) { alert(' Degrees Latitude must be in the range of -90. to 90. '); form11.decimalLat.value = '';  latAbs=0; }

 "></td></tr>

 <tr><td>
 <label for="DegreesLon"><nobr>Enter Decimal Longitude:&nbsp;&nbsp;</nobr></label></td>
 <td>

 <input name="lonDecimal" type="INT" size=11 value="" maxlength="11" id="DegreesLon" style="font-size: 12pt" tabindex="12" onBlur="

 if(form11.lonDecimal.value < 0)  { signlon = -1; }
 lonAbs = Math.abs(Math.round(form11.lonDecimal.value * 1000000.));

 //Math.round is used to eliminate the small error caused by rounding in the computer:
 //e.g. 0.2 is not the same as 0.20000000000284

 //Error checks
 if(lonAbs > (180 * 1000000)) {  alert(' Degrees Longitude must be in the range of -180 to 180. '); form11.lonDecimal.value='';  lonAbs=0; }

 ">&nbsp;</td></tr>

 <tr><td colspan=2 align="center">

 <input name="submit" type="BUTTON" tabindex="13"
 style="background-color: #DDEFFF;"   value = 'Convert to Degrees Minutes Seconds'

 onClick ="

 form11.deglat.value = ((Math.floor(latAbs / 1000000) * signlat) + '&deg; ' + Math.floor(  ((latAbs/1000000) - Math.floor(latAbs/1000000)) * 60)  + '\' ' +  ( Math.floor(((((latAbs/1000000) - Math.floor(latAbs/1000000)) * 60) - Math.floor(((latAbs/1000000) - Math.floor(latAbs/1000000)) * 60)) * 100000) *60/100000 ) + '&quot;'  );
 form11.deglon.value = ((Math.floor(lonAbs / 1000000) * signlon) + '&deg; ' + Math.floor(  ((lonAbs/1000000) - Math.floor(lonAbs/1000000)) * 60)  + '\' ' +  ( Math.floor(((((lonAbs/1000000) - Math.floor(lonAbs/1000000)) * 60) - Math.floor(((lonAbs/1000000) - Math.floor(lonAbs/1000000)) * 60)) * 100000) *60/100000 ) + '&quot;'  );
 signlat=1;
 signlon=1;

 ">&nbsp; &nbsp;<input type="reset" value="Clear Values"  tabindex ="14" onClick="

 form11.reset;
 latAbs=0;
 lonAbs=0;

 "></td></tr>

 <tr><td colspan=2 align="left"> <nobr><b>Results:</b>&nbsp; Latitude:
 <input name="deglat" type="INT" size=17 value="" maxlength="17" id="deglat" style="font-size: 12pt; background-color: #EEEEAB" tabindex='15'>&nbsp; Longitude:
 <input name="deglon" type="INT" size=19 value="" maxlength="19" id="deglon" style="font-size: 12pt; background-color: #EEEEAB" tabindex='16'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</nobr>
 <br><br></td></tr></table>

 </form><br>

 </TR></Table><br>
 </center>
 </body></html>*/