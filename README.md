# 🏁 Racing Weather Monitor

**Real-time density altitude calculations for serious racers who need precision tuning data**

[![License: Custom](https://img.shields.io/badge/License-Custom%20Restrictive-red.svg)](#-license)
[![Node.js](https://img.shields.io/badge/Node.js-v14%2B-green.svg)](https://nodejs.org/)
[![Weather API](https://img.shields.io/badge/Weather-API-blue.svg)](https://weatherapi.com)

---

## 🚀 What This Does

This application provides **real-time weather data and density altitude calculations** for 21 major racing tracks across the United States. Perfect for drag racers, circle track drivers, and anyone who needs accurate atmospheric conditions for engine tuning.

### Why Density Altitude Matters
- **Engine Performance**: Air density directly affects horsepower output
- **Fuel Tuning**: Thinner air requires leaner fuel mixtures
- **Consistency**: Track atmospheric conditions for repeatable performance
- **Competition Edge**: Know exactly what the air is doing before your competitors do

---

## ⚡ Features

### 🎯 **Precision Weather Data**
- **21 Racing Tracks** with GPS-accurate coordinates and elevations
- **5-minute updates** - Always current, never stale
- **NWS/NOAA sourced data** - Government-grade accuracy
- **Density altitude calculations** compatible with AirDensityOnline.com

### 📊 **Multiple Output Formats**
- **HTML overlays** - Perfect for OBS streaming or displays
- **JSON exports** - Integrate with your own applications  
- **Web dashboard** - View all tracks at once
- **Transparent backgrounds** - Overlay on any stream or display

### 🏁 **Racing Track Coverage**
- **NHRA tracks**: Las Vegas Motor Speedway, Texas Motorplex, South Georgia Motorsports Park
- **IHRA tracks**: Alabama International Dragway, Darlington Dragway, Little River Dragway
- **Regional tracks**: Houston Motorsports Park, Orlando Speed World, Boothill Speedway
- **And many more** across TX, LA, AL, FL, NV, TN, OK, MS, SC, and GA

---

## 🛠 Installation & Setup

### Prerequisites
- **Node.js 14+** 
- **WeatherAPI.com key** (free tier available)

### Quick Start
```bash
# Clone the repository
git clone https://github.com/BigChiefRick/air.git
cd air

# Install dependencies (if any)
npm install

# Add your WeatherAPI.com key to the file
# Edit racing-weather.js and replace: WEATHER_API_KEY = 'your-api-key-here'

# Run the application
node racing-weather.js
```

### Get Your API Key
1. Sign up at [WeatherAPI.com](https://weatherapi.com) (free)
2. Copy your API key
3. Replace `WEATHER_API_KEY` in `racing-weather.js`

---

## 📈 Usage

### Basic Operation
```bash
node racing-weather.js
```

The application will:
- ✅ Validate all track coordinates
- ✅ Test weather API connectivity  
- ✅ Begin 5-minute update cycles
- ✅ Generate HTML files in `./air/` directory
- ✅ Create JSON data exports
- ✅ Build a web dashboard at `./air/index.html`

### Output Files
```
./air/
├── index.html                    # Main dashboard
├── weather_data.json            # All track data (JSON)
├── Houston_Motorsports_Park.html
├── Las_Vegas_Motor_Speedway.html  
├── Texas_Motorplex.html
└── [... all other tracks]
```

### Example HTML Output
```html
<div class="track-name">Houston Motorsports Park</div>
<div class="data-item">Density Altitude: <span class="highlight">2367.20 ft</span></div>
<div class="data-item">Temperature: <span class="highlight">80.654°F</span></div>
<div class="data-item">Humidity: <span class="highlight">78%</span></div>
<div class="data-item">Wind: <span class="highlight">6.17 mph SW</span></div>
<div class="data-item">Barometer: <span class="highlight">29.84 inHg</span></div>
```

---

## 🎨 HTML Overlay Features

### Perfect for Streaming
- **Transparent backgrounds** - Overlay on any video source
- **Auto-refresh every 30 seconds** - Always shows current data
- **High contrast text** - Readable on any background
- **Gold highlights** - Professional racing aesthetic
- **Responsive design** - Works on any screen size

### OBS Studio Integration
1. Add **Browser Source**
2. Point to: `file:///path/to/air/Houston_Motorsports_Park.html`
3. Set refresh rate to 30 seconds
4. Position and resize as needed

---

## 🏆 Track Database

| Track Name | Location | Elevation | Type |
|------------|----------|-----------|------|
| **Las Vegas Motor Speedway** | Las Vegas, NV | 1,980 ft | NHRA 1/4 mile |
| **Texas Motorplex** | Ennis, TX | 515 ft | NHRA 1/4 mile |
| **Houston Motorsports Park** | Houston, TX | 59 ft | 1/8 mile dragstrip |
| **Orlando Speed World** | Orlando, FL | 56 ft | NHRA 1/4 mile |
| **South Georgia Motorsports Park** | Valdosta, GA | 203 ft | NHRA 1/4 mile |
| ... and 16 more tracks | | | |

*All coordinates and elevations verified against AirDensityOnline.com*

---

## 🔧 Technical Details

### Density Altitude Calculation
Uses psychrometric formulas to calculate moist air density, then converts to density altitude using racing-specific constants. Results typically within 10-50 feet of professional weather services.

### Data Sources
- **Weather Data**: WeatherAPI.com (NWS/NOAA sourced)
- **Track Coordinates**: AirDensityOnline.com verified
- **Elevations**: Survey-grade accuracy from racing databases

### Update Frequency
- **Weather updates**: Every 5 minutes
- **HTML refresh**: Every 30 seconds  
- **API rate limiting**: 200ms between track queries

---

## 🤝 Contributing

### Adding New Tracks
1. Get GPS coordinates and elevation from AirDensityOnline.com
2. Add to `TRACK_DATABASE` in racing-weather.js
3. Follow existing format exactly
4. Test with `node racing-weather.js`

### Bug Reports
- Include track name and expected vs actual values
- Provide weather conditions at time of issue
- Compare against AirDensityOnline.com if possible

---

## 📄 License

**Racing Weather Monitor - Restricted License**

Copyright (c) 2025, BigChiefRick  
All rights reserved.

### ✅ **PERMITTED USES:**
- **Personal use** by individual racers, crew members, and racing enthusiasts
- **Educational use** by schools, universities, and racing programs  
- **Non-profit racing organizations** and amateur racing clubs
- **Modification and distribution** for personal and educational purposes only
- **Integration** into personal racing setups, streaming overlays, and data analysis

### ❌ **PROHIBITED USES:**
- **Commercial use** - No selling, licensing, or monetizing this software or its data
- **Commercial distribution** - Cannot be included in paid software, apps, or services  
- **Business operations** - Professional racing teams, sanctioning bodies, and commercial racing organizations must obtain separate licensing
- **Data resale** - Weather data generated by this software cannot be sold or licensed to third parties
- **Competition** - Cannot be used to create competing commercial weather services
- **SaaS/Web Services** - Cannot be deployed as a commercial web service or API

### 📋 **CONDITIONS:**
1. **Attribution Required** - Must retain copyright notice and this license in all copies
2. **Source Code Availability** - Any modifications shared publicly must include source code
3. **Non-Commercial Derivatives** - Any derivative works must maintain these same restrictions
4. **Commercial License Available** - Contact author for commercial licensing terms

### 🏁 **RACING COMMUNITY EXCEPTION:**
Racing tracks, sanctioning bodies, and professional teams may contact the author for special licensing arrangements. We support the racing community while protecting the commercial value of this work.

### ⚖️ **LEGAL TERMS:**
THIS SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

**For commercial licensing inquiries, contact: [BigChiefRick]**

---

*This license protects the author's ability to monetize this work while keeping it freely available for personal racing use. Respect the hustle.* 🏁

---

## 🏁 Author

**BigChiefRick** - *Because accurate weather data wins races*

- GitHub: [@BigChiefRick](https://github.com/BigChiefRick)
- Racing Focus: Precision tuning and data-driven performance

---

## ⚠️ Disclaimer

This application provides weather data for informational and tuning purposes. Always verify critical weather conditions with multiple sources. The author is not responsible for engine damage due to incorrect atmospheric readings - but this data is damn accurate.

**Race safe, tune smart.** 🏁
