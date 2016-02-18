# objParse
Node Wavefront OBJ parsing for multi-object files

## Example Usage
```javascript
fs          = require('fs'),
parseObj    = require('parseObj');

parseObj(fs.createReadStream('myObject.obj'), function(err, res) {
    if(err) throw new Error("Error parsing OBJ file: " + err)
    else
    {
      console.log(res.length + ' objects in file');
      for(var i=0; i<res.length; i++)
      {
        console.log('Obj ' + (i+1) + ', vertex 1: ' + res[i].v[0]);
      }
    }
});
```
## Data
Pass in a read stream, on `finish` event, callback is returned with an object array.<br /><br />
Each object in the object array has an array of:
+ `v` vertex positions
+ `vn` vertex normals
+ `vt` vertex UVs
+ `f` face position indices
+ `fn` face normal indices
+ `ft` face texture coordinate indices
<br /><br />
`obj[n].v[m]` will get the mth vertex of the nth object as a vector of x, y, and z coordinates.
