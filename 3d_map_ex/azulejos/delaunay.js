/**
 * performs a Delaunay triangulation on a set of 2D vertices [x,y]
 *
 *  https://github.com/ironwallaby/delaunay/blob/master/delaunay.js
 */
var delaunay = function( exports ){

    var EPSILON = 1.0 / 1048576.0;
    function supertriangle(vertices){
        var xmin = Number.POSITIVE_INFINITY, ymin = Number.POSITIVE_INFINITY, xmax = Number.NEGATIVE_INFINITY, ymax = Number.NEGATIVE_INFINITY, i, dx, dy, dmax, xmid, ymid;

        for(i = vertices.length; i--; ) {
            if(vertices[i].x < xmin) xmin = vertices[i].x;
            if(vertices[i].x > xmax) xmax = vertices[i].x;
            if(vertices[i].y < ymin) ymin = vertices[i].y;
            if(vertices[i].y > ymax) ymax = vertices[i].y;
        }
        dx = xmax - xmin;
        dy = ymax - ymin;
        dmax = Math.max(dx, dy);
        xmid = xmin + dx * 0.5;
        ymid = ymin + dy * 0.5;
        return [
            {x:xmid - 20 * dmax, y:ymid -      dmax},
            {x:xmid            , y:ymid + 20 * dmax},
            {x:xmid + 20 * dmax, y:ymid -      dmax}
        ];
    }
    function circumcircle(vertices, i, j, k){

        var x1 = vertices[i].x,
            y1 = vertices[i].y,
            x2 = vertices[j].x,
            y2 = vertices[j].y,
            x3 = vertices[k].x,
            y3 = vertices[k].y,
            fabsy1y2 = Math.abs(y1 - y2),
            fabsy2y3 = Math.abs(y2 - y3),
            xc, yc, m1, m2, mx1, mx2, my1, my2, dx, dy;
        if(fabsy1y2 < EPSILON && fabsy2y3 < EPSILON)throw new Error("Eek! Coincident points!");
        if(fabsy1y2 < EPSILON) {
            m2  = -((x3 - x2) / (y3 - y2));
            mx2 = (x2 + x3) / 2.0;
            my2 = (y2 + y3) / 2.0;
            xc  = (x2 + x1) / 2.0;
            yc  = m2 * (xc - mx2) + my2;
        }else if(fabsy2y3 < EPSILON) {
            m1  = -((x2 - x1) / (y2 - y1));
            mx1 = (x1 + x2) / 2.0;
            my1 = (y1 + y2) / 2.0;
            xc  = (x3 + x2) / 2.0;
            yc  = m1 * (xc - mx1) + my1;
        }else {
            m1  = -((x2 - x1) / (y2 - y1));
            m2  = -((x3 - x2) / (y3 - y2));
            mx1 = (x1 + x2) / 2.0;
            mx2 = (x2 + x3) / 2.0;
            my1 = (y1 + y2) / 2.0;
            my2 = (y2 + y3) / 2.0;
            xc  = (m1 * mx1 - m2 * mx2 + my2 - my1) / (m1 - m2);
            yc  = (fabsy1y2 > fabsy2y3) ?
            m1 * (xc - mx1) + my1 :
            m2 * (xc - mx2) + my2;
        }
        dx = x2 - xc;
        dy = y2 - yc;
        return {i: i, j: j, k: k, x: xc, y: yc, r: dx * dx + dy * dy};
    }
    function dedup(edges){
        var i, j, a, b, m, n;
        for(j = edges.length; j; ) {
            b = edges[--j];
            a = edges[--j];
            for(i = j; i; ) {
                n = edges[--i];
                m = edges[--i];

                if((a === m && b === n) || (a === n && b === m)) {
                    edges.splice(j, 2);
                    edges.splice(i, 2);
                    break;
                }
            }
        }
    }
    function compute(vertices){

        var n = vertices.length,i, j, indices, st, open, closed, edges, dx, dy, a, b, c;
        if(n < 3)return [0,1,2];
        vertices = vertices.slice(0);
        indices = new Array(n);
        for(i = n; i--; )indices[i] = i;
        indices.sort(function(i, j) { return vertices[j].x - vertices[i].x; });
        st = supertriangle(vertices);
        vertices.push(st[0], st[1], st[2]);
        open   = [circumcircle(vertices, n + 0, n + 1, n + 2)];
        closed = [];
        edges  = [];
        for(i = indices.length; i--; edges.length = 0) {
            c = indices[i];
            for(j = open.length; j--; ){
                dx = vertices[c].x - open[j].x;
                if(dx > 0.0 && dx * dx > open[j].r) {
                    closed.push(open[j]);
                    open.splice(j, 1);
                    continue;
                }
                dy = vertices[c].y - open[j].y;
                if(dx * dx + dy * dy - open[j].r > EPSILON)continue;
                edges.push(
                    open[j].i, open[j].j,
                    open[j].j, open[j].k,
                    open[j].k, open[j].i
                );
                open.splice(j, 1);
            }
            dedup(edges);
            for(j = edges.length; j; ) {
                b = edges[--j];
                a = edges[--j];
                open.push(circumcircle(vertices, a, b, c));
            }
        }
        for(i = open.length; i--; ){
            closed.push(open[i]);
        }
        open.length = 0;

        for(i = closed.length; i--; ){
            if(closed[i].i < n && closed[i].j < n && closed[i].k < n)
            {
                open.push(closed[i].i, closed[i].j, closed[i].k);
            }
        }
        return open;
    }
    function contains(tri, p){
        if((p.x< tri[0].x && p.x< tri[1].x && p.x< tri[2].x) ||
            (p.x> tri[0].x && p.x> tri[1].x && p.x> tri[2].x) ||
            (p.y< tri[0].y && p.y< tri[1].y && p.y< tri[2].y) ||
            (p.y> tri[0].y && p.y> tri[1].y && p.y> tri[2].y))
            return null;
        var a = tri[1].x - tri[0].x, b = tri[2].x - tri[0].x, c = tri[1].y - tri[0].y, d = tri[2].y - tri[0].y, i = a * d - b * c;
        if(i === 0.0) return null;
        var u = (d * (p.x- tri[0].x) - b * (p.y- tri[0].y)) / i,
            v = (a * (p.y- tri[0].y) - c * (p.x- tri[0].x)) / i;
        if(u < 0.0 || v < 0.0 || (u + v) > 1.0) return null;
        return [u, v];
    }
    exports.compute = compute;
    return exports;
}({});