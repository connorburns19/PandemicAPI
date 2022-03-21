const res = require('express/lib/response');
const Papa = require('papaparse');

exports.Parse = (csvstring) => {
    const parsedbody = Papa.parse(csvstring).data;
    

    let rowstoadd = []
    let firstRowLength = parsedbody[0].length
    console.log(parsedbody[0])
    if (JSON.stringify(parsedbody[0]) != JSON.stringify( [
      'FIPS',
      'Admin2',
      'Province_State',
      'Country_Region',
      'LastUpdate',
      'Lat',
      'Long',
      'Confirmed',
      'Deaths',
      'Recovered',
      'Active',
      'Combined_Key',
      'Incidence_Rate',
      'Case-Fatality_Ratio'
    ])){
      return "INVALID"
    }
    for(let i = 1; i < parsedbody.length; i+=1){
      let row = parsedbody[i]
      
      if(row.length != firstRowLength){
        return "INVALID"
      }

      let provincestate = row[2];
      let countryregion = row[3]
      let confirmed = row[7];
      let deaths = row[8];
      let recovered = row[9];
      let active = row[10];
      let combinedkey = row[11];

      try{if( (parseInt(deaths) < 0 || isNaN(parseInt(deaths)) || parseInt(confirmed)) < 0 || isNaN(parseInt(confirmed)) 
        || parseInt(recovered)< 0 || isNaN(parseInt(recovered)) || parseInt(active)< 0 || isNaN(parseInt(active))){
          return "MALFORMED"
      }}catch{return "MALFORMED"}

      let rowtoadd = {provincestate: provincestate, countryregion: countryregion, confirmed: confirmed, deaths: deaths, recovered: recovered, active: active, combinedkey: combinedkey}
      rowstoadd.push(rowtoadd);
      
      }
      
      return rowstoadd;
}