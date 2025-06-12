const fs = require('fs');
const path = require('path');

// WeatherAPI.com configuration
const WEATHER_API_KEY = '85fdae6f0e8f46e881933945252105';

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
    elevation: 285, // From airdensityonline.com
    location: 'Grand Bay, Alabama',
    address: '16441 Billy Bell Rd, Grand Bay, AL 36541',
    latitude: 30.4796, // From airdensityonline.com
    longitude: -88.3222, // From airdensityonline.com
    type: '1/8 mile dragstrip'
  }
};

class RacingWeatherApp {
  constructor() {
    this.tracks = TRACK_DATABASE;
    this.weatherCache = {};
    this.isRunning = false;
    this.interval = null;
  }

  // Calculate Density Altitude using ADO's exact method (discovered through your research)
  calculateRacingDA(trackElevation, stationPressure, tempF, humidity) {
    // Step 1: Calculate Pressure Altitude
    const pressureAltitude = trackElevation + ((29.92 - stationPressure) * 1000);
    
    // Step 2: Calculate moist air density percentage (approximation of ADO's psychrometric calculation)
    const tempC = (tempF - 32) * 5/9;
    const tempK = tempC + 273.15;
    
    // Calculate saturation vapor pressure using Magnus formula
    const saturationVaporPressure = 6.112 * Math.exp((17.67 * tempC) / (tempC + 243.5)); // hPa
    const actualVaporPressure = (humidity / 100) * saturationVaporPressure;
    
    // Convert pressures to consistent units (hPa)
    const stationPressureHPa = stationPressure * 33.8639;
    const dryAirPressure = stationPressureHPa - actualVaporPressure;
    
    // Calculate air density components using ideal gas law ratios
    const standardTempK = 288.15; // 15°C standard
    const standardPressureHPa = 1013.25; // standard pressure
    
    // Dry air density ratio
    const dryAirDensityRatio = (dryAirPressure / standardPressureHPa) * (standardTempK / tempK);
    
    // Water vapor density ratio (water vapor is less dense than dry air by factor of 0.622)
    const vaporDensityRatio = (actualVaporPressure / standardPressureHPa) * (standardTempK / tempK) * 0.622;
    
    // Total moist air density as percentage
    const moistAirDensityPercent = (dryAirDensityRatio + vaporDensityRatio) * 100;
    
    // Step 3: Calculate density altitude using ADO's conversion factor
    const airDensityReduction = 100 - moistAirDensityPercent;
    const densityAltitude = pressureAltitude + (airDensityReduction * 330);
    
    return Math.round(densityAltitude * 100) / 100;
  }

  // Get weather data from WeatherAPI.com
  async getWeatherForTrack(track) {
    if (!track.latitude || !track.longitude) {
      throw new Error(`No coordinates for ${track.name}`);
    }

    const url = `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${track.latitude},${track.longitude}&aqi=no`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return {
        temp_f: data.current.temp_f,
        humidity: data.current.humidity,
        pressure_in: data.current.pressure_in,
        wind_mph: data.current.wind_mph,
        wind_dir: data.current.wind_dir,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error(`Weather API error for ${track.name}:`, error.message);
      return null;
    }
  }

  // Generate HTML overlay file for each track
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
        }
        .data-item {
            margin: 5px 0;
        }
        .highlight {
            color: #FFD700;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="text">
            <div class="track-name">${data.trackName}</div>
            <div class="data-item">Density Altitude: <span class="highlight">${data.densityAltitude} ft</span></div>
            <div class="data-item">Temperature: <span class="highlight">${data.temperature}&deg;F</span></div>
            <div class="data-item">Humidity: <span class="highlight">${data.humidity}%</span></div>
            <div class="data-item">Wind: <span class="highlight">${data.wind}</span></div>
            <div class="data-item">Barometer: <span class="highlight">${data.barometer} inHg</span></div>
        </div>
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

  // Save all weather data as JSON
  saveWeatherData() {
    try {
      // Create air directory if it doesn't exist
      const airDir = path.join(process.cwd(), 'air');
      if (!fs.existsSync(airDir)) {
        fs.mkdirSync(airDir, { recursive: true });
      }

      const jsonPath = path.join(airDir, 'weather_data.json');
      fs.writeFileSync(jsonPath, JSON.stringify(this.weatherCache, null, 2));
      console.log('Weather data saved to air/weather_data.json');
    } catch (error) {
      console.error('Error saving weather data:', error.message);
    }
  }

  // Generate index page for the air section
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
      trackLinks += `        <div class="track-item">
            <h3>${displayName}</h3>
            <div class="track-links">
                <a href="${fileName}" target="_blank" class="btn overlay-btn">View Overlay</a>
                <a href="#" onclick="showJSON('${trackName}')" class="btn json-btn">JSON Data</a>
            </div>
        </div>\n`;
    });

    const html = `<!DOCTYPE html>
<html>
<head>
    <title>Racing Weather Monitor</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: rgba(0,0,0,0.3);
            border-radius: 10px;
        }
        .header h1 {
            font-size: 2.5em;
            margin: 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
        .last-updated {
            font-size: 14px;
            color: #ffcc00;
            margin-top: 10px;
        }
        .tracks-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 20px;
        }
        .track-item {
            background: rgba(0,0,0,0.4);
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #ffcc00;
        }
        .track-item h3 {
            margin: 0 0 15px 0;
            font-size: 1.2em;
            color: #ffcc00;
        }
        .track-links {
            display: flex;
            gap: 10px;
        }
        .btn {
            padding: 8px 16px;
            text-decoration: none;
            border-radius: 4px;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        .overlay-btn {
            background: #28a745;
            color: white;
        }
        .overlay-btn:hover {
            background: #218838;
        }
        .json-btn {
            background: #17a2b8;
            color: white;
            cursor: pointer;
            border: none;
        }
        .json-btn:hover {
            background: #138496;
        }
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.8);
        }
        .modal-content {
            background: #2c3e50;
            margin: 5% auto;
            padding: 20px;
            border-radius: 8px;
            width: 80%;
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
        }
        .close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }
        .close:hover {
            color: white;
        }
        pre {
            background: #1e1e1e;
            padding: 15px;
            border-radius: 4px;
            overflow-x: auto;
            font-size: 12px;
            color: #f8f8f2;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            background: rgba(0,0,0,0.3);
            border-radius: 10px;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏁 Racing Weather Monitor</h1>
            <div class="last-updated">Last updated: ${lastUpdated}</div>
            <div style="margin-top: 10px; font-size: 14px;">
                Real-time density altitude calculations for racing tracks
            </div>
        </div>

        <div class="tracks-grid">
${trackLinks}
        </div>

        <div class="footer">
            <p>Weather data from WeatherAPI.com | Racing density altitude calculations</p>
            <p>Updates every 5 minutes | All times in local timezone</p>
        </div>
    </div>

    <!-- JSON Modal -->
    <div id="jsonModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2 id="modalTitle">Track JSON Data</h2>
            <pre id="jsonContent"></pre>
        </div>
    </div>

    <script>
        let weatherData = {};

        // Load weather data
        fetch('weather_data.json')
            .then(response => response.json())
            .then(data => {
                weatherData = data;
            })
            .catch(error => {
                console.error('Error loading weather data:', error);
            });

        function showJSON(trackName) {
            const modal = document.getElementById('jsonModal');
            const title = document.getElementById('modalTitle');
            const content = document.getElementById('jsonContent');
            
            title.textContent = trackName + ' - JSON Data';
            
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

  // Update weather for all tracks
  async updateAllTracks() {
    const trackNames = Object.keys(this.tracks);
    console.log(`Updating weather for ${trackNames.length} tracks...`);
    
    for (const trackName of trackNames) {
      try {
        const trackData = this.tracks[trackName];
        
        // Skip tracks without coordinates
        if (!trackData.latitude || !trackData.longitude) {
          console.log(`Skipping ${trackName} - no GPS coordinates`);
          continue;
        }
        
        console.log(`Getting weather for ${trackName}...`);
        
        const weather = await this.getWeatherForTrack(trackData);
        if (weather) {
          const densityAltitude = this.calculateRacingDA(
            trackData.elevation,
            weather.pressure_in,
            weather.temp_f,
            weather.humidity
          );

          this.weatherCache[trackName] = {
            trackName: trackData.name,
            location: trackData.location,
            elevation: trackData.elevation,
            densityAltitude: densityAltitude,
            temperature: weather.temp_f,
            humidity: weather.humidity,
            wind: `${weather.wind_mph} mph ${weather.wind_dir}`,
            barometer: weather.pressure_in,
            lastUpdated: new Date().toLocaleString()
          };

          // Generate HTML overlay for this track
          this.generateTrackHTML(trackName);
        }
        
        // Rate limiting - be nice to the API
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.error(`Error updating ${trackName}:`, error.message);
      }
    }
    
    // Save combined JSON data
    this.saveWeatherData();
    
    // Generate index page
    this.generateIndexPage();
    
    console.log('All tracks updated successfully!');
  }

  // Start the 5-minute polling service
  start() {
    if (this.isRunning) {
      console.log('Service already running!');
      return;
    }
    
    this.isRunning = true;
    console.log('Starting Racing Weather Service (5-minute intervals)...');
    
    // Initial update
    this.updateAllTracks();
    
    // Set 5-minute interval (300,000 ms)
    this.interval = setInterval(() => {
      console.log('\n--- Scheduled Update ---');
      this.updateAllTracks();
    }, 5 * 60 * 1000);
    
    console.log('Service started! Press Ctrl+C to stop.');
  }

  // Stop the service
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
    console.log('Racing Weather Service stopped.');
  }

  // Display current track database
  showTracks() {
    console.log('\n=== TRACK DATABASE STATUS ===');
    Object.entries(this.tracks).forEach(([name, data]) => {
      const status = data.latitude && data.longitude ? '✅' : '❌';
      console.log(`${status} ${name}:`);
      console.log(`    Location: ${data.location || 'MISSING'}`);
      console.log(`    Elevation: ${data.elevation || 'MISSING'} ft`);
      console.log(`    GPS: ${data.latitude || 'MISSING'}, ${data.longitude || 'MISSING'}`);
      console.log('');
    });
  }
}

// Main execution
async function main() {
  console.log('🏁 Racing Weather Application Starting...\n');
  
  const app = new RacingWeatherApp();
  
  // Show loaded tracks
  app.showTracks();
  
  // Count tracks with complete data
  const completeTracks = Object.values(app.tracks).filter(track => 
    track.latitude && track.longitude && track.elevation
  ).length;
  
  console.log(`\n📊 Database Status: ${completeTracks}/${TRACK_LIST.length} tracks have complete data\n`);
  
  if (completeTracks === 0) {
    console.log('❌ No tracks have complete GPS coordinates!');
    console.log('❌ Cannot proceed without proper track data.');
    console.log('❌ Need to complete track database first.');
    return;
  }
  
  // Test with one complete track
  const completeTrack = Object.entries(app.tracks).find(([_, data]) => 
    data.latitude && data.longitude && data.elevation
  );
  
  if (completeTrack) {
    console.log(`Testing with ${completeTrack[0]}...`);
    try {
      const weather = await app.getWeatherForTrack(completeTrack[1]);
      console.log('Test weather data:', weather);
      
      if (weather) {
        const da = app.calculateRacingDA(
          completeTrack[1].elevation,
          weather.pressure_in,
          weather.temp_f,
          weather.humidity
        );
        console.log(`Test Density Altitude: ${da} ft`);
      }
    } catch (error) {
      console.error('Test failed:', error.message);
    }
  }
  
  // Start the service
  console.log('Starting weather monitoring service...');
  app.start();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\nShutting down...');
    app.stop();
    process.exit(0);
  });
}

// Export for use as module
module.exports = { RacingWeatherApp, TRACK_DATABASE };

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Application error:', error);
    process.exit(1);
  });
}
