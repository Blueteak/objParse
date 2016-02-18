"use strict";

var split = require("split");

module.exports = objParse;

//Returns an object array with 'v, vn, vt, f, fn, and ft arrays' per object
function objParse(stream, callback) {
  var obj = [];
  var index = -1;

  //Use this to tell when we get a new object
  var gotV;
  var gotF;

  var unused = ['vp', 's', 'o', 'g', 'usemtl', 'mtllib'];

  stream.pipe(split())
    .on("data", function(line) {
      // Ignore comments or blank lines
      if(line.length === 0 || line.charAt(0) === "#") {
        return
      }
      var token = line.split(" ");
      if(token[0] == "v")
      {
        if(!gotV || gotF)
        {
          gotV = true;
          gotF = false;
          index++;
          obj.push({});
          //obj[index] = {};
          obj[index].v = [];
          obj[index].vn = [];
          obj[index].vt = [];
          obj[index].f = [];
          obj[index].fn = [];
          obj[index].ft = [];
        }
        if(token.length < 3) {
          throw new Error("[Parsing Error] Invalid vertex:" + line)
        }
        obj[index].v.push([+token[1], +token[2], +token[3]])
      } else if(token[0] == "vn") {
        if(token.length < 3) {
          throw new Error("[Parsing Error] Invalid vertex normal:"+ line)
        }
        obj[index].vn.push([+token[1], +token[2], +token[3]])
      } else if(token[0] == "vt") {
        if(token.length < 2) {
          throw new Error("[Parsing Error] Invalid vertex texture coord:" + line)
        }
        obj[index].vt.push([+token[1], +token[2]]);
      } else if(token[0] == "f") {
        gotF = true;
        var position = new Array(token.length-1);
        var normal = new Array(token.length-1);
        var texCoord = new Array(token.length-1);
        for(var i=1; i<token.length; ++i) {
          var indices = token[i].split("/");
          position[i-1] = (indices[0]|0)-1;
          texCoord[i-1] = indices[1] ? (indices[1]|0)-1 : -1;
          normal[i-1] = indices[2] ? (indices[2]|0)-1 : -1;
        }
        obj[index].f.push(position);
        obj[index].fn.push(normal);
        obj[index].ft.push(texCoord);
      } else if(unused.indexOf(token[0]) != -1)
      {
        //Add cases for vp, s, o, g, usemtl, mtllib here
      }
      else {
          throw new Error("[Parsing Error] Unrecognized directive: '" + token[0] + "'");
      }

    })
    .on("error", function(err) {
        callback(err, null);
    })
    .on("end", function() {
      callback(null, obj);
    })
}