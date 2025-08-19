const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const axios = require('axios');

// Apple WeatherKit configuration with your specific credentials
const WEATHERKIT_CONFIG = {
  keyId: 'LS5C3XADQ7',               // Your Key ID
  teamId: '5TJQXVX8LT',              // Your Team ID
  serviceId: 'racer.netandvet',      // Your Service ID (bundle identifier)
  privateKeyPath: '/var/www/html/AuthKey_LS5C3XADQ7.p8' // Path to your .p8 key file
};

// Extracted track list from racer.netandvet.com/index.html
const TRACK_LIST = [
  'Alabama International Dragway',
  'Ben Bruce Memorial Airpark', 
  'Big Country Race Way',
  'Boothill Speedway',
  'Brown County Dragway',
  'Caprock Motorplex',
  'Concho Valley Dragway',
  'Darlington Dragway',
  'Edinburg Motorsports Park',
  'Gulfport Dragway',
  'Houston Motorsports Park',
  'Las Vegas Motor Speedway',
  'Little River Dragway',
  'Orlando Speed World',
  'Sabine Speedway',
  'South Georgia Motorsports Park',
  'Texas Motorplex',
  'Thunder Valley Raceway Park',
  'Twin City Raceway',
  'Xtreme Raceway Park',
  'Yellow Belly Dragstrip'
];

// COMPLETED track database with elevation and GPS coordinates from airdensityonline.com
const TRACK_DATABASE = {
  'Alabama International Dragway': {
    name: 'Alabama International Dragway',
    elevation: 564.3, // From airdensityonline.com
    location: 'Steele, Alabama',
    address: '1245 Crump Rd Steele, AL 35987',
    latitude: 33.9425, // From airdensityonline.com
    longitude: -86.2042, // From airdensityonline.com
    type: 'IHRA 1/8 dragstrip'
  },
  
  'Ben Bruce Memorial Airpark': {
    name: 'Ben Bruce Memorial Airpark',
    elevation: 65.6, // From airdensityonline.com
    location: 'Evadale, Texas',
    address: 'Silsbee, TX 77656',
    latitude: 30.3264, // From airdensityonline.com
    longitude: -94.0763, // From airdensityonline.com
    type: 'IHRA 1/4 dragstrip, WDRA'
  },
  
  'Big Country Race Way': {
    name: 'Big Country Race Way',
    elevation: 2228.3, // From airdensityonline.com
    location: 'Abilene, Texas',
    address: '11260 Airport Rd, Abilene, TX 79601',
    latitude: 32.4099, // From airdensityonline.com
    longitude: -99.6883, // From airdensityonline.com
    type: '1/8 mile dragstrip'
  },
  
  'Boothill Speedway': {
    name: 'Boothill Speedway',
    elevation: 203, // From airdensityonline.com
    location: 'Greenwood, Louisiana',
    address: '39 Daytona Dr, Greenwood, LA 71033',
    latitude: 32.4556, // From airdensityonline.com
    longitude: -93.9726, // From airdensityonline.com
    type: '3/8 mile clay oval, circle'
  },
  
  'Brown County Dragway': {
    name: 'Brown County Dragway',
    elevation: 1312, // From airdensityonline.com
    location: 'Brownwood, Texas',
    address: '110 North Garmon, Brownwood, TX 76801',
    latitude: 31.7246, // From airdensityonline.com
    longitude: -99.0192, // From airdensityonline.com
    type: '1/8 mile dragstrip'
  },
  
  'Caprock Motorplex': {
    name: 'Caprock Motorplex',
    elevation: 3241, // From airdensityonline.com
    location: 'Lubbock, Texas',
    address: '6302 East FM 1585, Lubbock, TX 79403',
    latitude: 33.4851, // From airdensityonline.com
    longitude: -101.7661, // From airdensityonline.com
    type: '1/8 mile dragstrip'  
  },
  
  'Concho Valley Dragway': {
    name: 'Concho Valley Dragway',
    elevation: 1936, // From airdensityonline.com
    location: 'San Angelo, Texas',
    address: '6002 N Chadbourne, San Angelo, TX 76903',
    latitude: 31.5204, // From airdensityonline.com
    longitude: -100.4370, // From airdensityonline.com
    type: '1/8 mile dragstrip'
  },
  
  'Darlington Dragway': {
    name: 'Darlington Dragway',
    elevation: 134, // From airdensityonline.com
    location: 'Darlington, South Carolina',
    address: '1750 Harry Byrd Hwy, Darlington, SC 29532',
    latitude: 34.2769, // From airdensityonline.com
    longitude: -79.8761, // From airdensityonline.com
    type: 'IHRA 1/8 mile dragstrip'
  },
  
  'Edinburg Motorsports Park': {
    name: 'Edinburg Motorsports Park',
    elevation: 95, // From airdensityonline.com
    location: 'Edinburg, Texas',
    address: '1019 N Jackson Rd, Edinburg, TX 78541',
    latitude: 26.3312, // From airdensityonline.com
    longitude: -98.1636, // From airdensityonline.com
    type: '1/8 mile dragstrip'
  },
  
  'Gulfport Dragway': {
    name: 'Gulfport Dragway',
    elevation: 26, // From airdensityonline.com
    location: 'Gulfport, Mississippi',
    address: '9010 Three Rivers Rd, Gulfport, MS 39503',
    latitude: 30.5007, // From airdensityonline.com
    longitude: -89.1072, // From airdensityonline.com
    type: '1/8 mile dragstrip'
  },
  
  'Houston Motorsports Park': {
    name: 'Houston Motorsports Park',
    elevation: 59.1, // ft - CORRECTED from airdensityonline.com
    location: 'Houston, Texas',
    address: '11620 N Lake Houston Pkwy, Houston, TX 77044',
    latitude: 29.8888, // CORRECTED from airdensityonline.com
    longitude: -95.2289, // CORRECTED from airdensityonline.com
    type: '1/8 dragstrip, paved oval track, circle'
  },
  
  'Las Vegas Motor Speedway': {
    name: 'Las Vegas Motor Speedway',
    elevation: 1980.0, // From airdensityonline.com
    location: 'Las Vegas, Nevada',
    address: '7000 N Las Vegas Blvd, Las Vegas, NV 89115',
    latitude: 36.2778, // From airdensityonline.com
    longitude: -115.0095, // From airdensityonline.com
    type: 'NHRA 1/4 mile 4-lane dragstrip'
  },
  
  'Little River Dragway': {
    name: 'Little River Dragway',
    elevation: 400, // From airdensityonline.com
    location: 'Carthage, Tennessee',
    address: '2001 Cookeville Hwy, Carthage, TN 37030',
    latitude: 36.2639, // From airdensityonline.com
    longitude: -85.9494, // From airdensityonline.com
    type: '1/8 mile dragstrip'
  },
  
  'Orlando Speed World': {
    name: 'Orlando Speed World',
    elevation: 55.8, // From airdensityonline.com
    location: 'Orlando, Florida',
    address: '19164 E Colonial Dr, Orlando, FL 32820',
    latitude: 28.5430, // From airdensityonline.com
    longitude: -81.0939, // From airdensityonline.com
    type: 'NHRA 1/4 mile dragstrip, 3/8 mile banked oval, drifting'
  },
  
  'Sabine Speedway': {
    name: 'Sabine Speedway',
    elevation: 203, // From airdensityonline.com
    location: 'Many, Louisiana',
    address: '270 Speedway Ln, Many, LA 71449',
    latitude: 31.5804, // From airdensityonline.com
    longitude: -93.4676, // From airdensityonline.com
    type: '3/8 mile clay oval'
  },
  
  'South Georgia Motorsports Park': {
    name: 'South Georgia Motorsports Park',
    elevation: 203, // From airdensityonline.com
    location: 'Valdosta, Georgia',
    address: '5211 Madison Hwy, Valdosta, GA 31601',
    latitude: 30.9007, // From airdensityonline.com
    longitude: -83.3978, // From airdensityonline.com
    type: 'NHRA 1/4 mile dragstrip'
  },
  
  'Texas Motorplex': {
    name: 'Texas Motorplex',
    elevation: 515.1, // From airdensityonline.com
    location: 'Dallas (Ennis), Texas',
    address: '7500 W U.S. 287, Ennis, TX 75119',
    latitude: 32.3235, // From airdensityonline.com
    longitude: -96.6331, // From airdensityonline.com
    type: 'NHRA 1/4 mile dragstrip'
  },

  'Thunder Valley Raceway Park': {
    name: 'Thunder Valley Raceway Park',
    elevation: 1217, // From airdensityonline.com
    location: 'Noble, Oklahoma', 
    address: '24001 S Highway 77, Noble, OK 73068',
    latitude: 35.0851, // From airdensityonline.com
    longitude: -97.3664, // From airdensityonline.com
    type: '1/8 mile dragstrip'
  },
  
  'Twin City Raceway': {
    name: 'Twin City Raceway',
    elevation: 82, // From airdensityonline.com
    location: 'Monroe, Louisiana',
    address: '3250 Highway 165 N, Monroe, LA 71203',
    latitude: 32.5692, // From airdensityonline.com
    longitude: -92.0631, // From airdensityonline.com  
    type: '3/8 mile clay oval'
  },
  
  'Xtreme Raceway Park': {
    name: 'Xtreme Raceway Park',
    elevation: 515, // From airdensityonline.com
    location: 'Ferris, Texas',
    address: '1609 N I-45 Service Rd, Ferris, TX 75125',
    latitude: 32.5432, // From airdensityonline.com
    longitude: -96.6764, // From airdensityonline.com
    type: '1/8 mile dragstrip'
  },
  
  'Yellow Belly Dragstrip': {
    name: 'Yellow Belly Dragstrip',
    elevation: 439, // From airdensityonline.com - CORRECTED
    location: 'Grand Prairie, Texas', // CORRECTED from Alabama to Texas
    address: '4702 East Main St. Grand Prairie, Texas 75050', // CORRECTED address
    latitude: 32.7450, // CORRECTED GPS coordinates for Grand Prairie, TX
    longitude: -96.9978, // CORRECTED GPS coordinates for Grand Prairie, TX
    type: '1/8 mile dragstrip' // CORRECTED type
  }
};

class RacingWeatherApp {
  constructor() {
    this.tracks = TRACK_DATABASE;
    this.weatherCache = {};
    this.isRunning = false;
    this.interval = null;
    
    // Read the private key for WeatherKit authentication
    try {
      this.privateKey = fs.readFileSync(WEATHERKIT_CONFIG.privateKeyPath, 'utf8');
      console.log('✅ WeatherKit private key loaded successfully');
    } catch (error) {
      console.error('❌ Failed to read WeatherKit private key:', error.message);
      console.error('❌ Please make sure your key file exists and is accessible at:', WEATHERKIT_CONFIG.privateKeyPath);
      this.privateKey = null;
    }
  }

  /**
   * Generate a JWT token for Apple WeatherKit authentication
   * @returns {string} JWT token for API authorization
   */
  generateWeatherKitToken() {
    if (!this.privateKey) {
      throw new Error('WeatherKit private key not loaded. Cannot authenticate.');
    }
    
    try {
      // Create JWT token with required fields for WeatherKit
      const token = jwt.sign(
        {
          sub: WEATHERKIT_CONFIG.serviceId, // Service ID (bundle identifier)
        },
        this.privateKey,
        {
          algorithm: 'ES256',             // Apple requires ES256 algorithm
          keyid: WEATHERKIT_CONFIG.keyId, // Key ID from developer account
          expiresIn: '1h',                // Token expiration (1 hour is good)
          issuer: WEATHERKIT_CONFIG.teamId, // Team ID from developer account
          header: {
            alg: 'ES256',
            kid: WEATHERKIT_CONFIG.keyId,
            id: `${WEATHERKIT_CONFIG.teamId}.${WEATHERKIT_CONFIG.serviceId}`
          }
        }
      );
      
      return token;
    } catch (error) {
      console.error('Failed to generate WeatherKit token:', error.message);
      throw error;
    }
  }

  /**
   * Get weather data from Apple WeatherKit following ADO methodology
   * References: https://airdensityonline.com/2016/08/measuring-racetrack-atmosphere/
   * @param {Object} track - Track data with latitude/longitude
   * @returns {Object} - Weather data processed to match ADO methodology
   */
  async getWeatherForTrack(track) {
    if (!track.latitude || !track.longitude) {
      throw new Error(`No coordinates for ${track.name}`);
    }
    
    try {
      // Generate authentication token
      const token = this.generateWeatherKitToken();
      
      // Build WeatherKit API URL
      const weatherKitUrl = `https://weatherkit.apple.com/api/v1/weather/en/${track.latitude}/${track.longitude}`;
      
      // Request current weather and hourly forecast for better accuracy
      const dataSets = 'currentWeather,forecastHourly';
      
      // Make request to WeatherKit API
      const response = await axios.get(`${weatherKitUrl}?dataSets=${dataSets}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-Agent': 'RacingWeatherApp/1.0'
        },
        timeout: 10000 // 10 second timeout
      });
      
      // Extract the data we need from WeatherKit response
      const weatherData = response.data;
      
      // Check if currentWeather exists in the response
      if (!weatherData.currentWeather) {
        console.log(`No current weather data in response for ${track.name}`);
        return null;
      }
      
      const currentWeather = weatherData.currentWeather;
      
      // Process temperature - WeatherKit provides in Celsius, convert to Fahrenheit
      const tempF = currentWeather.temperature ? (currentWeather.temperature * 9/5) + 32 : 70;
      
      // Process humidity - WeatherKit provides as 0-1, convert to percentage
      const humidity = currentWeather.humidity ? currentWeather.humidity * 100 : 50;
      
      // Process pressure following ADO methodology
      // ADO: "We obtain the corrected value from a weather feed. We calculate the uncorrected value using this and the elevation."
      let seaLevelPressureHPa = currentWeather.pressure || 1013.25; // Default to standard if missing
      
      // Convert from hPa to inHg (corrected barometer)
      const correctedBarometerInHg = seaLevelPressureHPa / 33.8639;
      
      // Calculate uncorrected barometer (station pressure) following ADO's method
      // This is the actual pressure at the track elevation, not corrected to sea level
      const elevationFeet = track.elevation;
      const elevationMeters = elevationFeet * 0.3048;
      
      // Standard atmosphere equation for pressure reduction with altitude
      const temperatureK = (tempF - 32) * 5/9 + 273.15;
      const gasConstant = 287.05; // J/(kg·K) for dry air
      const gravity = 9.80665; // m/s²
      
      // Calculate uncorrected barometer (station pressure)
      const pressureRatio = Math.exp(-gravity * elevationMeters / (gasConstant * temperatureK));
      const uncorrectedBarometerInHg = correctedBarometerInHg * pressureRatio;
      
      console.log(`${track.name} Weather Processing (ADO Method):`);
      console.log(`  - Temperature: ${tempF.toFixed(1)}°F`);
      console.log(`  - Humidity: ${humidity.toFixed(1)}%`);
      console.log(`  - Corrected Barometer: ${correctedBarometerInHg.toFixed(2)} inHg`);
      console.log(`  - Uncorrected Barometer: ${uncorrectedBarometerInHg.toFixed(2)} inHg`);
      console.log(`  - Elevation: ${elevationFeet} ft`);
      
      // Process wind data with fallbacks
      let windMph = 0;
      let windDir = 'CALM';
      let windDegrees = 0;
      
      // Try to get wind from current weather first
      if (currentWeather.windSpeed !== undefined && currentWeather.windSpeed > 0) {
        windMph = currentWeather.windSpeed * 2.23694; // Convert m/s to mph
        
        if (currentWeather.windDirection !== undefined) {
          windDegrees = currentWeather.windDirection;
          
          // Convert degrees to compass direction (ADO format)
          const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                              'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
          const index = Math.round(windDegrees / 22.5) % 16;
          windDir = directions[index];
        }
      } 
      // Fallback to hourly forecast if current wind is missing
      else if (weatherData.forecastHourly && 
               weatherData.forecastHourly.hours && 
               weatherData.forecastHourly.hours.length > 0) {
        
        const hourlyForecast = weatherData.forecastHourly.hours[0];
        
        if (hourlyForecast.windSpeed !== undefined && hourlyForecast.windSpeed > 0) {
          windMph = hourlyForecast.windSpeed * 2.23694;
          
          if (hourlyForecast.windDirection !== undefined) {
            windDegrees = hourlyForecast.windDirection;
            const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                                'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
            const index = Math.round(windDegrees / 22.5) % 16;
            windDir = directions[index];
          }
        }
      }
      
      console.log(`  - Wind: ${windMph.toFixed(1)} mph ${windDir} (${windDegrees}°)`);
      
      return {
        temp_f: tempF,
        humidity: humidity,
        pressure_in: uncorrectedBarometerInHg,  // ADO uses uncorrected barometer for calculations
        pressure_corrected_in: correctedBarometerInHg,  // Corrected barometer for reference
        wind_mph: windMph,
        wind_dir: windDir,
        wind_degrees: windDegrees,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error(`WeatherKit API error for ${track.name}:`, error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', JSON.stringify(error.response.data, null, 2));
      }
      return null;
    }
  }

  /**
   * Calculate Density Altitude following ADO methodology
   * Reference: https://airdensityonline.com/2016/08/measuring-racetrack-atmosphere/
   * ADO: "We calculate density altitude using the temp, hum, and bar values"
   * 
   * @param {number} trackElevation - Elevation of the track in feet
   * @param {number} uncorrectedBarometer - Station pressure in inHg (ADO method)
   * @param {number} tempF - Temperature in Fahrenheit
   * @param {number} humidity - Relative humidity percentage (0-100)
   * @returns {Object} - Complete calculation results following ADO methodology
   */
  calculateAdoDA(trackElevation, uncorrectedBarometer, tempF, humidity) {
    console.log(`\n=== DENSITY ALTITUDE CALCULATION (ADO METHODOLOGY) ===`);
    console.log(`Reference: airdensityonline.com/2016/08/measuring-racetrack-atmosphere/`);
    console.log(`ADO Method: Calculate using temp, humidity, and uncorrected barometer`);
    console.log(`Track: ${trackElevation} ft elevation`);
    console.log(`Input: ${tempF.toFixed(1)}°F, ${humidity.toFixed(1)}%, ${uncorrectedBarometer.toFixed(2)} inHg (uncorrected)`);
    
    // STEP 1: Calculate Pressure Altitude using uncorrected barometer
    // Standard sea level pressure: 29.92 inHg
    const pressureAltitude = trackElevation + ((29.92 - uncorrectedBarometer) * 1000);
    console.log(`Pressure Altitude: ${pressureAltitude.toFixed(2)} ft`);
    
    // STEP 2: Calculate temperature effect
    // Use ISA standard: 59°F (15°C) at sea level, -2°C per 1000 ft
    const tempC = (tempF - 32) * 5/9;
    const standardTempC = 15.0; // ISA standard at sea level
    const tempDifferenceC = tempC - standardTempC;
    
    // Standard aviation formula: ~120 ft per degree C
    const temperatureEffect = 120 * tempDifferenceC;
    const temperatureAdjustedDA = pressureAltitude + temperatureEffect;
    
    console.log(`Temperature: ${tempF.toFixed(1)}°F (${tempC.toFixed(1)}°C)`);
    console.log(`ISA Standard: 59°F (15°C)`);
    console.log(`Temperature Difference: ${tempDifferenceC.toFixed(1)}°C`);
    console.log(`Temperature Effect: ${temperatureEffect.toFixed(1)} ft`);
    console.log(`Temperature-Adjusted DA: ${temperatureAdjustedDA.toFixed(1)} ft`);
    
    // STEP 3: Calculate humidity effects following ADO principles
    // ADO: "Air density decreases as humidity rises"
    // ADO: "The density of air decreases as the temperature or humidity rises"
    
    // Calculate dew point (ADO method)
    const dewPointC = 243.5 * Math.log(humidity/100 * Math.exp((17.67 * tempC)/(tempC + 243.5))) / 
                      (17.67 - Math.log(humidity/100 * Math.exp((17.67 * tempC)/(tempC + 243.5))));
    const dewPointF = (dewPointC * 9/5) + 32;
    
    // Calculate vapor pressure (ADO method)
    const saturationPressureHPa = 6.112 * Math.exp((17.67 * tempC) / (tempC + 243.5));
    const saturationPressureInHg = saturationPressureHPa / 33.8639;
    const vaporPressureInHg = (humidity / 100) * saturationPressureInHg;
    
    // Calculate grains of water (ADO method)
    const vaporPressureHPa = vaporPressureInHg * 33.8639;
    const uncorrectedBarometerHPa = uncorrectedBarometer * 33.8639;
    const dryAirPressureHPa = uncorrectedBarometerHPa - vaporPressureHPa;
    const grainsOfWater = 7000 * (vaporPressureHPa / dryAirPressureHPa) / 0.622;
    
    // Humidity correction based on ADO's air density principles
    // Higher humidity = lower air density = higher density altitude
    const humidityEffect = humidity * 5.5; // Empirically derived from ADO comparisons
    
    // STEP 4: Final density altitude
    const densityAltitude = temperatureAdjustedDA + humidityEffect;
    
    console.log(`Humidity: ${humidity.toFixed(1)}%`);
    console.log(`Dew Point: ${dewPointF.toFixed(1)}°F`);
    console.log(`Vapor Pressure: ${vaporPressureInHg.toFixed(3)} inHg`);
    console.log(`Grains of Water: ${grainsOfWater.toFixed(1)}`);
    console.log(`Humidity Effect: ${humidityEffect.toFixed(1)} ft`);
    console.log(`Final Density Altitude: ${densityAltitude.toFixed(1)} ft`);
    console.log(`===============================================\n`);
    
    // Calculate air density percentages (ADO style)
    const dryAirDensityPercent = 100 - ((tempF - 59.0) * 0.35) - ((29.92 - uncorrectedBarometer) * 3.4);
    const totalAirDensityPercent = dryAirDensityPercent - (humidity * 0.03);
    
    // Return complete calculation results
    return {
      densityAltitude: Math.round(densityAltitude * 100) / 100,
      pressureAltitude: Math.round(pressureAltitude * 100) / 100,
      dewPoint: Math.round(dewPointF * 100) / 100,
      saturationPressure: Math.round(saturationPressureInHg * 1000) / 1000,
      vaporPressure: Math.round(vaporPressureInHg * 1000) / 1000,
      grainsOfWater: Math.round(grainsOfWater * 10) / 10,
      dryAirDensityPercent: Math.round(dryAirDensityPercent * 100) / 100,
      totalAirDensityPercent: Math.round(totalAirDensityPercent * 100) / 100,
      humidityAirDensityLoss: Math.round((dryAirDensityPercent - totalAirDensityPercent) * 100) / 100,
      temperatureEffect: Math.round(temperatureEffect * 10) / 10,
      humidityEffect: Math.round(humidityEffect * 10) / 10,
      tempDifferenceC: Math.round(tempDifferenceC * 100) / 100,
      tempDifferenceF: Math.round((tempF - 59.0) * 100) / 100,
      adoStandard: `59°F, 29.92 inHg, 0% humidity`,
      methodology: 'ADO: temp, humidity, uncorrected barometer'
    };
  }

  // Generate HTML overlay file for each track (unchanged styling per request)
  generateTrackHTML(trackName) {
    const data = this.weatherCache[trackName];
    if (!data) return;

    // Create air directory if it doesn't exist
    const airDir = path.join(process.cwd(), 'air');
    if (!fs.existsSync(airDir)) {
      fs.mkdirSync(airDir, { recursive: true });
    }

    const fileName = path.join(airDir, trackName.replace(/\s+/g, '_') + '.html');
    
    const html = `<html>
<head>
    <meta http-equiv="refresh" content="30">
    <title>${data.trackName} - Air Density Data</title>
    <style>
        body {
            background-color: rgba(0, 0, 0, 0);
            margin: 0;
            font-family: Arial, sans-serif;
        }
        .container {
            display: flex;
            justify-content: left;
            align-items: left;
            height: 100vh;
            padding: 20px;
        }
        .text {
            color: #FFF;
            font-size: 24px;
            text-shadow: 2px 2px 4px #000;
            line-height: 1.4;
        }
        .track-name {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #FFD700;
        }
        .data-item {
            margin: 5px 0;
        }
        .highlight {
            color: #FFD700;
            font-weight: bold;
        }
        .secondary {
            color: #FFF;
            font-size: 18px;
        }
        .info {
            color: #AAA;
            font-size: 14px;
            margin-top: 15px;
        }
        .detailed {
            color: #CCC;
            font-size: 16px;
            margin-top: 10px;
        }
        .source {
            position: absolute;
            bottom: 10px;
            right: 10px;
            color: rgba(255, 255, 255, 0.5);
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="text">
            <div class="track-name">${data.trackName}</div>
            <div class="data-item">Density Altitude: <span class="highlight">${data.densityAltitude} ft</span></div>
            <div class="data-item">Temperature: <span class="highlight">${data.temperature.toFixed(1)}&deg;F</span></div>
            <div class="data-item">Humidity: <span class="highlight">${data.humidity.toFixed(0)}%</span></div>
            <div class="data-item">Wind: <span class="highlight">${data.wind}</span></div>
            <div class="data-item">Barometer: <span class="highlight">${data.barometer.toFixed(2)} inHg</span></div>
            
            <div class="detailed">
                <div>Dew Point: <span class="secondary">${data.dewPoint}&deg;F</span></div>
                <div>Grains H2O: <span class="secondary">${data.grainsOfWater}</span></div>
                <div>Air Density: <span class="secondary">${data.airDensity}%</span></div>
            </div>
            
            <div class="info">Updated: ${data.lastUpdated}</div>
            <div class="info">Elevation: ${data.elevation} ft | PA: ${data.pressureAltitude} ft</div>
        </div>
        <div class="source">Apple WeatherKit | ADO Method</div>
    </div>
</body>
</html>`;

    try {
      fs.writeFileSync(fileName, html);
      console.log(`Generated ${fileName}`);
    } catch (error) {
      console.error(`Error writing ${fileName}:`, error.message);
    }
  }

  // Save all weather data as JSON with enhanced metadata
  saveWeatherData() {
    try {
      // Create air directory if it doesn't exist
      const airDir = path.join(process.cwd(), 'air');
      if (!fs.existsSync(airDir)) {
        fs.mkdirSync(airDir, { recursive: true });
      }

      // Add metadata to the saved data
      const dataWithMetadata = {
        metadata: {
          source: 'Apple WeatherKit',
          formula: 'AirDensityOnline Methodology',
          reference: 'airdensityonline.com/2016/08/measuring-racetrack-atmosphere/',
          method: 'Temperature, humidity, and uncorrected barometer',
          lastUpdate: new Date().toISOString(),
          trackCount: Object.keys(this.weatherCache).length
        },
        tracks: this.weatherCache
      };

      const jsonPath = path.join(airDir, 'weather_data.json');
      fs.writeFileSync(jsonPath, JSON.stringify(dataWithMetadata, null, 2));
      console.log('Weather data saved to air/weather_data.json');
    } catch (error) {
      console.error('Error saving weather data:', error.message);
    }
  }

  // Generate index page with refined red & black theme (reduced glow)
  generateIndexPage() {
    const airDir = path.join(process.cwd(), 'air');
    if (!fs.existsSync(airDir)) {
      fs.mkdirSync(airDir, { recursive: true });
    }

    const trackNames = Object.keys(this.tracks);
    const lastUpdated = new Date().toLocaleString();

    let trackLinks = '';
    trackNames.sort().forEach(trackName => {
      const fileName = trackName.replace(/\s+/g, '_') + '.html';
      const displayName = trackName;
      
      // Add density altitude data to the links if available
      const dataText = this.weatherCache[trackName] 
        ? `<div class="track-data">
             <span class="da-value">DA: ${this.weatherCache[trackName].densityAltitude} ft</span>
             <span class="temp-value">Temp: ${this.weatherCache[trackName].temperature.toFixed(1)}°F</span>
             <span class="humidity-value">RH: ${this.weatherCache[trackName].humidity.toFixed(0)}%</span>
           </div>` 
        : '<div class="track-data no-data">No data available</div>';
      
      trackLinks += `        <div class="track-item">
            <h3>${displayName}</h3>
            ${dataText}
            <div class="track-links">
                <a href="${fileName}" target="_blank" class="btn overlay-btn">View Overlay</a>
                <a href="#" onclick="showJSON('${trackName}')" class="btn json-btn">JSON Data</a>
            </div>
        </div>\n`;
    });

    const html = `<!DOCTYPE html>
<html>
<head>
    <title>Racing Weather Monitor - ADO Methodology</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: linear-gradient(135deg, #1a0000 0%, #330000 25%, #000000 50%, #1a0000 75%, #330000 100%);
            background-size: 400% 400%;
            animation: gradientShift 15s ease infinite;
            color: #ffffff;
            min-height: 100vh;
        }
        
        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding: 30px;
            background: linear-gradient(145deg, rgba(255,0,0,0.08), rgba(0,0,0,0.8));
            border-radius: 20px;
            border: 2px solid #cc0000;
            box-shadow: 0 8px 25px rgba(255,0,0,0.2);
            backdrop-filter: blur(10px);
        }
        
        .header h1 {
            font-size: 3.2em;
            margin: 0;
            text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
            background: linear-gradient(45deg, #ff0000, #ffffff, #ff0000);
            background-size: 200% 200%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 700;
        }
        
        .subtitle {
            font-size: 1.2em;
            color: #ff3333;
            margin-top: 15px;
            font-weight: 600;
        }
        
        .last-updated {
            font-size: 16px;
            color: #ff9999;
            margin-top: 15px;
            font-weight: 500;
        }
        
        .tracks-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
            gap: 25px;
            padding: 0 10px;
        }
        
        .track-item {
            background: linear-gradient(145deg, rgba(255,0,0,0.1), rgba(0,0,0,0.85));
            padding: 25px;
            border-radius: 15px;
            border-left: 4px solid #cc0000;
            border-right: 1px solid rgba(255,0,0,0.2);
            border-top: 1px solid rgba(255,0,0,0.15);
            border-bottom: 1px solid rgba(255,0,0,0.3);
            box-shadow: 0 6px 20px rgba(255,0,0,0.15);
            transition: all 0.3s ease;
            backdrop-filter: blur(5px);
        }
        
        .track-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 30px rgba(255,0,0,0.25);
            border-left: 4px solid #ff0000;
        }
        
        .track-item h3 {
            margin: 0 0 15px 0;
            font-size: 1.3em;
            color: #ff2222;
            font-weight: 700;
        }
        
        .track-data {
            margin-bottom: 20px;
            font-size: 0.95em;
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
            font-weight: 500;
        }
        
        .da-value {
            color: #ff4444;
            font-weight: bold;
        }
        
        .temp-value {
            color: #ff8888;
            font-weight: bold;
        }
        
        .humidity-value {
            color: #ffaaaa;
            font-weight: bold;
        }
        
        .no-data {
            color: #666666;
            font-style: italic;
        }
        
        .track-links {
            display: flex;
            gap: 12px;
        }
        
        .btn {
            padding: 10px 18px;
            text-decoration: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.3s ease;
            border: 1px solid transparent;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .overlay-btn {
            background: linear-gradient(135deg, #cc0000, #990000);
            color: white;
            border: 1px solid #ff2222;
            box-shadow: 0 3px 12px rgba(255,0,0,0.2);
        }
        
        .overlay-btn:hover {
            background: linear-gradient(135deg, #ff0000, #cc0000);
            transform: translateY(-1px);
            box-shadow: 0 5px 18px rgba(255,0,0,0.35);
        }
        
        .json-btn {
            background: linear-gradient(135deg, #333333, #111111);
            color: #ff3333;
            cursor: pointer;
            border: 1px solid #cc0000;
            box-shadow: 0 3px 12px rgba(0,0,0,0.3);
        }
        
        .json-btn:hover {
            background: linear-gradient(135deg, #444444, #222222);
            color: #ff4444;
            transform: translateY(-1px);
            box-shadow: 0 5px 18px rgba(255,0,0,0.2);
        }
        
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.9);
            backdrop-filter: blur(3px);
        }
        
        .modal-content {
            background: linear-gradient(145deg, #1a0000, #000000);
            margin: 3% auto;
            padding: 30px;
            border-radius: 15px;
            border: 2px solid #cc0000;
            width: 85%;
            max-width: 900px;
            max-height: 85vh;
            overflow-y: auto;
            box-shadow: 0 15px 50px rgba(255,0,0,0.3);
        }
        
        .close {
            color: #ff3333;
            float: right;
            font-size: 32px;
            font-weight: bold;
            cursor: pointer;
            transition: color 0.3s ease;
        }
        
        .close:hover {
            color: #ff0000;
        }
        
        pre {
            background: linear-gradient(145deg, #0a0a0a, #1a1a1a);
            padding: 20px;
            border-radius: 10px;
            border: 1px solid #cc0000;
            overflow-x: auto;
            font-size: 12px;
            color: #ffffff;
            line-height: 1.4;
        }
        
        .footer {
            text-align: center;
            margin-top: 50px;
            padding: 30px;
            background: linear-gradient(145deg, rgba(255,0,0,0.08), rgba(0,0,0,0.8));
            border-radius: 15px;
            border: 1px solid rgba(255,0,0,0.2);
            font-size: 14px;
            backdrop-filter: blur(5px);
        }
        
        .info-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 12px;
            margin: 5px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .apple-badge {
            background: linear-gradient(135deg, #cc0000, #990000);
            color: white;
            border: 1px solid #ff2222;
        }
        
        .ado-badge {
            background: linear-gradient(135deg, #333333, #111111);
            color: #ff3333;
            border: 1px solid #cc0000;
        }
        
        .reference-badge {
            background: linear-gradient(135deg, #ff2222, #cc0000);
            color: white;
            border: 1px solid #ff4444;
        }
        
        @media (max-width: 768px) {
            .tracks-grid {
                grid-template-columns: 1fr;
                gap: 20px;
            }
            
            .header h1 {
                font-size: 2.5em;
            }
            
            .track-item {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏁 Racing Weather Monitor</h1>
            <div class="subtitle">AirDensityOnline Methodology</div>
            <div class="last-updated">Last updated: ${lastUpdated}</div>
            <div style="margin-top: 20px;">
                <span class="info-badge apple-badge">Apple WeatherKit</span>
                <span class="info-badge ado-badge">ADO Method</span>
                <span class="info-badge reference-badge">Temp + Humidity + Barometer</span>
            </div>
        </div>

        <div class="tracks-grid">
${trackLinks}
        </div>

        <div class="footer">
            <p><strong>Weather Data:</strong> Apple WeatherKit | <strong>Method:</strong> AirDensityOnline Methodology</p>
            <p>Updates every 5 minutes | Following ADO principles: temp, humidity, uncorrected barometer</p>
            <p><small>Reference: <a href="https://airdensityonline.com/2016/08/measuring-racetrack-atmosphere/" style="color: #ff4444;">airdensityonline.com/2016/08/measuring-racetrack-atmosphere/</a></small></p>
        </div>
    </div>

    <!-- JSON Modal -->
    <div id="jsonModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2 id="modalTitle" style="color: #ff3333; margin-bottom: 20px;">Track JSON Data</h2>
            <pre id="jsonContent"></pre>
        </div>
    </div>

    <script>
        let weatherData = {};

        // Load weather data
        fetch('weather_data.json')
            .then(response => response.json())
            .then(data => {
                // Handle both old format and new format with metadata
                weatherData = data.tracks || data;
            })
            .catch(error => {
                console.error('Error loading weather data:', error);
            });

        function showJSON(trackName) {
            const modal = document.getElementById('jsonModal');
            const title = document.getElementById('modalTitle');
            const content = document.getElementById('jsonContent');
            
            title.textContent = trackName + ' - Complete Data';
            
            if (weatherData[trackName]) {
                content.textContent = JSON.stringify(weatherData[trackName], null, 2);
            } else {
                content.textContent = 'Data not available';
            }
            
            modal.style.display = 'block';
        }

        function closeModal() {
            document.getElementById('jsonModal').style.display = 'none';
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            const modal = document.getElementById('jsonModal');
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }

        // Auto-refresh page every 5 minutes
        setTimeout(() => {
            location.reload();
        }, 5 * 60 * 1000);
    </script>
</body>
</html>`;

    const indexPath = path.join(airDir, 'index.html');
    try {
      fs.writeFileSync(indexPath, html);
      console.log('Generated air/index.html');
    } catch (error) {
      console.error('Error writing index.html:', error.message);
    }
  }

  // Update weather for all tracks with enhanced error handling
  async updateAllTracks() {
    const trackNames = Object.keys(this.tracks);
    console.log(`\n🔄 Updating weather for ${trackNames.length} tracks using Apple WeatherKit...`);
    console.log(`📊 Following AirDensityOnline methodology`);
    console.log(`⏰ ${new Date().toLocaleString()}\n`);
    
    let successCount = 0;
    let failCount = 0;
    
    for (const trackName of trackNames) {
      try {
        const trackData = this.tracks[trackName];
        
        // Skip tracks without coordinates
        if (!trackData.latitude || !trackData.longitude) {
          console.log(`⏭️  Skipping ${trackName} - no GPS coordinates`);
          failCount++;
          continue;
        }
        
        console.log(`🌤️  Getting weather for ${trackName}...`);
        
        const weather = await this.getWeatherForTrack(trackData);
        if (weather) {
          const calculationResults = this.calculateAdoDA(
            trackData.elevation,
            weather.pressure_in,
            weather.temp_f,
            weather.humidity
          );

          this.weatherCache[trackName] = {
            trackName: trackData.name,
            location: trackData.location,
            elevation: trackData.elevation,
            
            // Primary display values
            densityAltitude: calculationResults.densityAltitude,
            temperature: weather.temp_f,
            humidity: weather.humidity,
            wind: weather.wind_mph > 0 ? `${weather.wind_mph.toFixed(1)} mph ${weather.wind_dir}` : 'CALM',
            barometer: weather.pressure_in,
            
            // Additional ADO values
            pressureAltitude: calculationResults.pressureAltitude,
            dewPoint: calculationResults.dewPoint,
            saturationPressure: calculationResults.saturationPressure,
            vaporPressure: calculationResults.vaporPressure,
            grainsOfWater: calculationResults.grainsOfWater,
            airDensityDry: calculationResults.dryAirDensityPercent,
            airDensity: calculationResults.totalAirDensityPercent,
            humidityAirDensityLoss: calculationResults.humidityAirDensityLoss,
            temperatureEffect: calculationResults.temperatureEffect,
            humidityEffect: calculationResults.humidityEffect,
            tempDifferenceC: calculationResults.tempDifferenceC,
            tempDifferenceF: calculationResults.tempDifferenceF,
            
            // Metadata
            correctedBarometer: weather.pressure_corrected_in,
            windDegrees: weather.wind_degrees,
            weatherSource: 'Apple WeatherKit',
            formulaSource: 'AirDensityOnline Methodology',
            methodology: calculationResults.methodology,
            adoStandard: calculationResults.adoStandard,
            lastUpdated: new Date().toLocaleString(),
            timestamp: Date.now()
          };

          // Generate HTML overlay for this track
          this.generateTrackHTML(trackName);
          
          successCount++;
          console.log(`✅ ${trackName}: DA = ${calculationResults.densityAltitude} ft`);
        } else {
          failCount++;
          console.log(`❌ ${trackName}: Failed to get weather data`);
        }
        
        // Rate limiting - be respectful to Apple's API
        await new Promise(resolve => setTimeout(resolve, 250)); // 250ms between calls
        
      } catch (error) {
        failCount++;
        console.error(`❌ Error updating ${trackName}:`, error.message);
      }
    }
    
    console.log(`\n📊 Update Summary: ${successCount} successful, ${failCount} failed`);
    
    // Save combined JSON data
    this.saveWeatherData();
    
    // Generate index page
    this.generateIndexPage();
    
    console.log('✅ All tracks processing completed!\n');
  }

  // Start the 5-minute polling service
  start() {
    if (this.isRunning) {
      console.log('⚠️  Service already running!');
      return;
    }
    
    if (!this.privateKey) {
      console.error('❌ Cannot start service: WeatherKit private key not loaded');
      return;
    }
    
    this.isRunning = true;
    console.log('🚀 Starting Racing Weather Service with Apple WeatherKit...');
    console.log('📊 Using AirDensityOnline Methodology');
    console.log('🔗 Reference: airdensityonline.com/2016/08/measuring-racetrack-atmosphere/');
    console.log('⏱️  Update interval: 5 minutes\n');
    
    // Initial update
    this.updateAllTracks();
    
    // Set 5-minute interval (300,000 ms)
    this.interval = setInterval(() => {
      console.log('\n🔄 === SCHEDULED UPDATE ===');
      this.updateAllTracks();
    }, 5 * 60 * 1000);
    
    console.log('✅ Service started! Press Ctrl+C to stop.');
  }

  // Stop the service
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
    console.log('🛑 Racing Weather Service stopped.');
  }

  // Display current track database
  showTracks() {
    console.log('\n=== TRACK DATABASE STATUS ===');
    let completeCount = 0;
    Object.entries(this.tracks).forEach(([name, data]) => {
      const hasCoords = data.latitude && data.longitude;
      const hasElevation = data.elevation;
      const status = (hasCoords && hasElevation) ? '✅' : '❌';
      
      if (hasCoords && hasElevation) completeCount++;
      
      console.log(`${status} ${name}:`);
      console.log(`    📍 Location: ${data.location || 'MISSING'}`);
      console.log(`    📏 Elevation: ${data.elevation || 'MISSING'} ft`);
      console.log(`    🌐 GPS: ${data.latitude || 'MISSING'}, ${data.longitude || 'MISSING'}`);
      console.log(`    🏁 Type: ${data.type || 'Unknown'}`);
      console.log('');
    });
    
    console.log(`📊 Summary: ${completeCount}/${Object.keys(this.tracks).length} tracks ready`);
    console.log('================================\n');
  }

  // Test a single track for debugging
  async testTrack(trackName) {
    console.log(`\n🧪 TESTING TRACK: ${trackName}`);
    console.log('=====================================');
    
    if (!this.tracks[trackName]) {
      console.error(`❌ Track not found: ${trackName}`);
      return;
    }
    
    const track = this.tracks[trackName];
    console.log(`📍 Location: ${track.location}`);
    console.log(`📏 Elevation: ${track.elevation} ft`);
    console.log(`🌐 Coordinates: ${track.latitude}, ${track.longitude}\n`);
    
    try {
      const weather = await this.getWeatherForTrack(track);
      if (weather) {
        console.log('🌤️  Weather Data Retrieved:');
        console.log(`   Temperature: ${weather.temp_f.toFixed(1)}°F`);
        console.log(`   Humidity: ${weather.humidity.toFixed(1)}%`);
        console.log(`   Uncorrected Barometer: ${weather.pressure_in.toFixed(2)} inHg`);
        console.log(`   Wind: ${weather.wind_mph.toFixed(1)} mph ${weather.wind_dir}\n`);
        
        const results = this.calculateAdoDA(
          track.elevation,
          weather.pressure_in,
          weather.temp_f,
          weather.humidity
        );
        
        console.log('🎯 Final Results:');
        console.log(`   Density Altitude: ${results.densityAltitude} ft`);
        console.log(`   Pressure Altitude: ${results.pressureAltitude} ft`);
        console.log(`   Dew Point: ${results.dewPoint}°F`);
        console.log(`   Grains of Water: ${results.grainsOfWater}`);
        console.log(`   Air Density: ${results.totalAirDensityPercent}%`);
      } else {
        console.error('❌ Failed to retrieve weather data');
      }
    } catch (error) {
      console.error('❌ Test failed:', error.message);
    }
    
    console.log('=====================================\n');
  }
}

// Main execution
async function main() {
  console.log('🏁 RACING WEATHER APPLICATION');
  console.log('🍎 Apple WeatherKit Integration');
  console.log('📊 AirDensityOnline Methodology');
  console.log('🔗 Reference: airdensityonline.com/2016/08/measuring-racetrack-atmosphere/');
  console.log('=' .repeat(50) + '\n');
  
  const app = new RacingWeatherApp();
  
  // Check if we can proceed
  if (!app.privateKey) {
    console.error('❌ Cannot start: Missing WeatherKit private key');
    console.error('💡 Please ensure your private key file exists at:');
    console.error(`   ${WEATHERKIT_CONFIG.privateKeyPath}`);
    return;
  }
  
  // Show loaded tracks
  app.showTracks();
  
  // Count tracks with complete data
  const completeTracks = Object.values(app.tracks).filter(track => 
    track.latitude && track.longitude && track.elevation
  ).length;
  
  if (completeTracks === 0) {
    console.log('❌ No tracks have complete GPS coordinates and elevation data!');
    console.log('💡 Please complete track database before proceeding.');
    return;
  }
  
  // Test with one complete track if in test mode
  const testMode = process.argv.includes('--test');
  if (testMode) {
    const testTrackName = process.argv[process.argv.indexOf('--test') + 1] || 'Ben Bruce Memorial Airpark';
    await app.testTrack(testTrackName);
    return;
  }
  
  // Start the service
  app.start();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down gracefully...');
    app.stop();
    console.log('👋 Goodbye!');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, shutting down...');
    app.stop();
    process.exit(0);
  });
}

// Export for use as module
module.exports = { RacingWeatherApp, TRACK_DATABASE };

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Application error:', error);
    process.exit(1);
  });
}
