const Papa = require('papaparse');

exports.Parse = (csvstring) => {
    const parsedbody = Papa.parse(csvstring).data;
    const dataskeleton = []
    for(let i = 4; i< parsedbody[0].length; i+=1){
      dataskeleton.push([parsedbody[0][i], 0]);

    }
  

    let rowstoadd = []
    let headerLength = parsedbody[0].length;
    
    for(let i = 1; i < parsedbody.length; i+=1){
      
      let row = parsedbody[i]
      if(row.length != headerLength){
        return "INVALID"
      }
      
      let provincestate = row[0];
      let countryregion = row[1]
      let data = dataskeleton;

      try{
        for(let i = 4; i < headerLength; i+=1){
          data[i - 4][1] = parseInt(row[i], 10);
        }
      } catch(error) {
        //checks if the data is not of the right length
        return "INVALID"
      }
        
      let rowtoadd = {provincestate: provincestate, countryregion: countryregion, data: data}
      rowstoadd.push(rowtoadd);
      
      }
      
      return rowstoadd;
}