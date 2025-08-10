<template>
    <div class="app-container">
        <!-- 背景装饰元素 -->
        <div class="background-shapes">
            <div class="shape"></div>
            <div class="shape"></div>
            <div class="shape"></div>
        </div>

        <div class="container">
            <div class="header">
                <h1>WEATHER APP</h1>
                <div class="search-bar">
                    <input 
                        type="text" 
                        v-model="city"
                        placeholder="Enter city name"
                        class="search-input"
                        @keyup.enter="searchByCity"
                    />
                    <button @click="searchByCity" class="search-button">
                        Search
                    </button>
                    <div class="instruction">
                        Please implement "Search Weather by City".
                    </div>
                    
                    <!-- 添加调试信息 -->
                    <div v-if="debugInfo" class="debug-info">
                        <p><strong>Debug Info:</strong></p>
                        <p>HTTPS: {{ isHTTPS ? 'Yes' : 'No' }}</p>
                        <p>Geolocation Available: {{ geolocationAvailable ? 'Yes' : 'No' }}</p>
                        <p>Location Status: {{ locationStatus }}</p>
                    </div>
                    
                    <!-- 手动获取位置按钮 -->
                    <button @click="requestLocation" class="location-button">
                        📍 Get My Location
                    </button>
                </div>
            </div>

            <main>
                <div v-if="weatherData" class="weather-card">
                    <h2>
                        {{ weatherData.name }}, {{ weatherData.sys.country }}
                    </h2>
                    <div class="weather-icon-container">
                        <img :src="iconUrl" alt="Weather Icon" class="weather-icon" />
                        <p class="temperature">{{ temperature }}°C</p>
                    </div>
                    <div class="description">{{ weatherData.weather[0].description }}</div>
                </div>
                
                <!-- 错误信息显示 -->
                <div v-if="error" class="error-message">
                    <p>{{ error }}</p>
                </div>
            </main>
        </div>
    </div>
</template>

<script>
import axios from "axios";

const apikey = "4a9a9a11b3353b914cce82b2f44fc023";

export default {
    name: "App",
    data() {
        return {
            city: "",
            weatherData: null,
            hourlyForecast: [],
            dailyForecast: [],
            error: null,
            debugInfo: true, // 开启调试模式
            isHTTPS: false,
            geolocationAvailable: false,
            locationStatus: 'Not requested'
        };
    },
    computed: {
        temperature() {
            return this.weatherData
                ? Math.floor(this.weatherData.main.temp - 273)
                : null;
        },
        iconUrl() {
            return this.weatherData
                ? `https://api.openweathermap.org/img/w/${this.weatherData.weather[0].icon}.png`
                : null;
        },
    },
    mounted() {
        this.checkEnvironment();
        this.fetchCurrentLocationWeather();
    },
    methods: {
        checkEnvironment() {
            // 检查是否是HTTPS
            this.isHTTPS = location.protocol === 'https:' || location.hostname === 'localhost';
            
            // 检查地理位置API是否可用
            this.geolocationAvailable = 'geolocation' in navigator;
            
            console.log('Environment check:', {
                protocol: location.protocol,
                hostname: location.hostname,
                isHTTPS: this.isHTTPS,
                geolocationAvailable: this.geolocationAvailable
            });
        },
        
        async requestLocation() {
            this.error = null;
            this.locationStatus = 'Requesting...';
            
            if (!this.geolocationAvailable) {
                this.error = 'Geolocation is not supported by this browser.';
                this.locationStatus = 'Not supported';
                return;
            }
            
            if (!this.isHTTPS) {
                this.error = 'Geolocation requires HTTPS. Please access the site via HTTPS.';
                this.locationStatus = 'HTTPS required';
                return;
            }
            
            try {
                const position = await this.getCurrentPosition();
                this.locationStatus = 'Success';
                const { latitude, longitude } = position.coords;
                
                console.log('Location obtained:', { latitude, longitude });
                
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}`;
                await this.fetchWeatherData(url);
                
            } catch (error) {
                console.error('Location error:', error);
                this.handleLocationError(error);
            }
        },
        
        getCurrentPosition() {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    resolve,
                    reject,
                    {
                        enableHighAccuracy: true,
                        timeout: 10000, // 10秒超时
                        maximumAge: 300000 // 5分钟缓存
                    }
                );
            });
        },
        
        handleLocationError(error) {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    this.error = "Location access denied by user. Please enable location permissions.";
                    this.locationStatus = 'Permission denied';
                    break;
                case error.POSITION_UNAVAILABLE:
                    this.error = "Location information is unavailable.";
                    this.locationStatus = 'Unavailable';
                    break;
                case error.TIMEOUT:
                    this.error = "Location request timed out.";
                    this.locationStatus = 'Timeout';
                    break;
                default:
                    this.error = "An unknown error occurred while retrieving location.";
                    this.locationStatus = 'Unknown error';
                    break;
            }
        },
        
        async fetchCurrentLocationWeather() {
            // 自动尝试获取位置，但不显示错误（用户可以手动点击按钮）
            if (this.geolocationAvailable && this.isHTTPS) {
                try {
                    await this.requestLocation();
                } catch (error) {
                    console.log('Auto location request failed, user can manually request');
                    this.locationStatus = 'Auto-request failed';
                }
            }
        },
        
        async fetchWeatherData(url) {
            try {
                this.error = null;
                const response = await axios.get(url);
                this.weatherData = response.data;
                console.log('Weather data received:', this.weatherData);
            } catch (error) {
                console.error("Error fetching weather data:", error);
                this.error = `Failed to fetch weather data: ${error.message}`;
            }
        },
        
        async searchByCity() {
            if (!this.city) {
                alert("Please enter a city name.");
                return;
            }

            const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${apikey}`;
            await this.fetchWeatherData(url);
        }
    }
}
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.app-container {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 30%, #dee2e6 100%);
    min-height: 100vh;
    color: #333;
    overflow-x: hidden;
    position: relative;
}

.container {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.header {
    text-align: center;
    margin-bottom: 40px;
    width: 100%;
}

.header h1 {
    font-size: 3.5rem;
    font-weight: 700;
    background: linear-gradient(45deg, #6c5ce7, #74b9ff, #0984e3);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 30px;
    text-shadow: 0 4px 20px rgba(0,0,0,0.1);
    letter-spacing: 2px;
}

.search-bar {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    border-radius: 25px;
    padding: 30px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    border: 1px solid rgba(0, 0, 0, 0.1);
}

.search-input {
    width: 300px;
    padding: 15px 20px;
    border: none;
    border-radius: 50px;
    font-size: 1.1rem;
    background: rgba(255, 255, 255, 0.9);
    color: #333;
    margin-right: 15px;
    outline: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.search-input:focus {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    background: rgba(255, 255, 255, 1);
}

.search-input::placeholder {
    color: #666;
}

.search-button {
    padding: 15px 30px;
    border: none;
    border-radius: 50px;
    background: linear-gradient(45deg, #ff7675, #e84393);
    color: white;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(232, 67, 147, 0.3);
}

.search-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(232, 67, 147, 0.4);
    background: linear-gradient(45deg, #fd79a8, #e84393);
}

.search-button:active {
    transform: translateY(-1px);
}

.location-button {
    margin-top: 15px;
    padding: 12px 25px;
    border: none;
    border-radius: 50px;
    background: linear-gradient(45deg, #00b894, #00cec9);
    color: white;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 184, 148, 0.3);
}

.location-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 184, 148, 0.4);
}

.instruction {
    margin-top: 20px;
    font-size: 1rem;
    color: rgba(0, 0, 0, 0.6);
    font-style: italic;
}

.debug-info {
    margin-top: 15px;
    padding: 15px;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 10px;
    text-align: left;
    font-size: 0.9rem;
}

.debug-info p {
    margin: 5px 0;
}

.error-message {
    background: rgba(255, 107, 107, 0.1);
    border: 1px solid rgba(255, 107, 107, 0.3);
    border-radius: 15px;
    padding: 20px;
    margin-top: 20px;
    color: #d63031;
    text-align: center;
}

main {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.weather-card {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px);
    border-radius: 30px;
    padding: 40px;
    text-align: center;
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
    border: 1px solid rgba(0, 0, 0, 0.1);
    min-width: 400px;
    animation: fadeInUp 0.6s ease-out;
    color: #333;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.weather-card h2 {
    font-size: 2.2rem;
    margin-bottom: 30px;
    color: #333;
    text-shadow: 0 2px 10px rgba(0,0,0,0.1);
    font-weight: 300;
}

.weather-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;
    gap: 20px;
}

.weather-icon {
    width: 100px;
    height: 100px;
    filter: drop-shadow(0 4px 20px rgba(0,0,0,0.3));
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%, 100% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-10px);
    }
}

.temperature {
    font-size: 4rem;
    font-weight: 700;
    color: #333;
    text-shadow: 0 4px 20px rgba(0,0,0,0.1);
    margin: 0;
}

.description {
    font-size: 1.4rem;
    color: rgba(0, 0, 0, 0.7);
    text-transform: capitalize;
    margin-top: 20px;
    font-weight: 300;
    letter-spacing: 1px;
}

/* 背景装饰元素 */
.background-shapes {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
}

.shape {
    position: absolute;
    background: rgba(116, 185, 255, 0.1);
    border-radius: 50%;
    animation: float-shapes 20s infinite ease-in-out;
}

.shape:nth-child(1) {
    width: 100px;
    height: 100px;
    top: 20%;
    left: 10%;
    animation-delay: 0s;
}

.shape:nth-child(2) {
    width: 150px;
    height: 150px;
    top: 60%;
    right: 15%;
    animation-delay: 5s;
}

.shape:nth-child(3) {
    width: 80px;
    height: 80px;
    bottom: 20%;
    left: 20%;
    animation-delay: 10s;
}

@keyframes float-shapes {
    0%, 100% {
        transform: translateY(0px) rotate(0deg);
    }
    33% {
        transform: translateY(-30px) rotate(120deg);
    }
    66% {
        transform: translateY(20px) rotate(240deg);
    }
}

/* 响应式设计 */
@media (max-width: 768px) {
    .header h1 {
        font-size: 2.5rem;
    }

    .search-input {
        width: 250px;
        margin-bottom: 15px;
        margin-right: 0;
    }

    .search-bar {
        padding: 20px;
    }

    .weather-card {
        min-width: 300px;
        padding: 30px;
    }

    .temperature {
        font-size: 3rem;
    }

    .weather-card h2 {
        font-size: 1.8rem;
    }
}

@media (max-width: 480px) {
    .container {
        padding: 15px;
    }

    .header h1 {
        font-size: 2rem;
    }

    .search-input {
        width: 200px;
    }

    .weather-card {
        min-width: 250px;
        padding: 20px;
    }
}
</style>