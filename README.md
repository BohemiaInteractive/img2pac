[![Build Status](https://travis-ci.org/BohemiaInteractive/img2pac.svg?branch=master)](https://travis-ci.org/BohemiaInteractive/img2pac)  

Converts `jpg` & `png` images to `paa` & `pac` proprietary image format as described by the [public PAA file format specs](https://community.bistudio.com/wiki/PAA_File_Format).

> npm i img2pac


#### CLI interface

```bash
> img2pac <source-file> <destination-file>
```

#### Module interface

```javascript

const toPAC = require('img2pac');

return toPAC(source, destination); //returns a Promsie
```
