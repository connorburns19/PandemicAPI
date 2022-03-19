const Papa = require('papaparse');

exports.Parse = (csvstring) => {
    const parsedbody = Papa.parse(csvstring).data;
    const dataskeleton = []
    for(let i = 4; i< parsedbody[0].length; i+=1){
      dataskeleton.push([parsedbody[0][i], 0]);

    }
  

    let rowstoadd = []
    for(let i = 1; i < parsedbody.length; i+=1){
      let row = parsedbody[i]
      let provincestate = row[0];
      let countryregion = row[1]
      let data = dataskeleton;

      for(let i = 4; i < row.length; i+=1){
        data[i - 4][1] = row[i];
      }
      let rowtoadd = {provincestate: provincestate, countryregion: countryregion, data: data}
      rowstoadd.push(rowtoadd);
      
      }
      
      return rowstoadd;
}