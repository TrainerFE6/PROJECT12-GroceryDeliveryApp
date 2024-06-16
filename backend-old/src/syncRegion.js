var request = require("request");
const { Provinces, Cities } = require('./models');
const config = require("./config/config");

var optionsProvince = {
  method: 'GET',
  url: 'https://api.rajaongkir.com/starter/province',
  headers: {key: config.rajaOngkir.key}
};
var optionsCity = {
  method: 'GET',
  url: 'https://api.rajaongkir.com/starter/city',
  headers: {key: config.rajaOngkir.key }
};

request(optionsProvince, function (error, response, body) {
  if (error) throw new Error(error);

  const data = JSON.parse(response.body);
  const result = data.rajaongkir.results;

  const dataProvince = result.map(province => {
    return {
      id: parseInt(province.province_id),
      name: province.province
    }
  });

  Provinces.bulkCreate(dataProvince);
  console.log("Province data has been synchronized");

  request(optionsCity, function (error, response, body) {
    if (error) throw new Error(error);

    const data = JSON.parse(response.body);
    const result = data.rajaongkir.results;

    const dataCity = result.map(city => {
      return {
        id: parseInt(city.city_id),
        province_id: parseInt(city.province_id),
        type: city.type,
        name: city.city_name,
        postal_code: city.postal_code
      }
    });

    Cities.bulkCreate(dataCity);
    console.log("City data has been synchronized");
  });
});
