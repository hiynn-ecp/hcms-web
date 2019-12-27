<template>
  	<div class="weather_common">
		<div class="duty_weather">
			<p class="time">
				<span>{{curTimeYear}}</span>
				<span>-</span>
				<span>{{curTimeMonth}}</span>
				<span>-</span>
				<span>{{curTimeDay}}</span>
				<span>&nbsp;</span>
				<span>{{curTimeHour}}</span>
				<span>:</span>
				<span>{{curTimeMin}}</span>
				<span>:</span>
				<span>{{curTimeSec}}</span>
			</p>
			<p class="weather">
				<template v-if="weatherInfo">
					{{weatherInfo.weather}} {{weatherInfo.windDirection}}风{{weatherInfo.windPower}}级 气温{{weatherInfo.temperature}}℃
				</template>
				<template v-else>
					晴 无风 气温<i class="customNumber">0</i>℃
				</template>
			</p>
		</div>
	</div>
</template>

<script>
import Vue from 'vue'
export default {
	data() {
		return {
			weatherInfo: {},
			curTimeYear: new Date().getFullYear(),
			curTimeMonth:
				new Date().getMonth() + 1 < 10
				? "0" + (new Date().getMonth() + 1)
				: new Date().getMonth() + 1,
			curTimeDay:
				new Date().getDate() < 10
				? "0" + new Date().getDate()
				: new Date().getDate(),
			curTimeHour:
				new Date().getHours() < 10
				? "0" + new Date().getHours()
				: new Date().getHours(),
			curTimeMin:
				new Date().getMinutes() < 10
				? "0" + new Date().getMinutes()
				: new Date().getMinutes(),
			curTimeSec:
				new Date().getSeconds() < 10
				? "0" + new Date().getSeconds()
				: new Date().getSeconds(),
			hyDate: new Date()
		};
	},
	watch:{
	},
	mounted() {
		this.getWeather()
		this.getCurrTime()
		this.watchWeather()
	},
	methods: {
		getCurrTime() {
			let _this = this;
			setInterval(function() {
				let time = new Date(); // 程序计时的月从0开始取值后+1
				let year, month, day, hour, min, sec;
				year = time.getFullYear();
				month =
				time.getMonth() + 1 < 10
					? "0" + (time.getMonth() + 1)
					: time.getMonth() + 1;
				day = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
				hour = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
				min =
				time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
				sec =
				time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();
				_this.curTimeYear = year;
				_this.curTimeMonth = month;
				_this.curTimeDay = day;
				_this.curTimeHour = hour;
				_this.curTimeMin = min;
				_this.curTimeSec = sec;
				if (time.getTime() - _this.hyDate.getTime() > 3600000) {
					_this.getWeather()
					_this.hyDate = new Date()
				}
			}, 1000);
		},
		watchWeather () {
			let _this = this
			window.addEventListener('storage', (e) => {
				if (e.key == 'weather') {
					_this.weatherInfo = JSON.parse(window.localStorage.getItem('weather'))
				}
			});
		},
		getWeather () {
			let _this = this
			AMap.plugin('AMap.CitySearch', function() {
				var citySearch = new AMap.CitySearch();
				citySearch.getLocalCity(function(status, result) {
				let cityType = result.city;
				if (status === 'complete' && result.info === 'OK') {
					AMap.plugin('AMap.Weather', function() {
						var weather = new AMap.Weather();
						weather.getLive(cityType, function(err, data) {
							if (!err) {
								_this.resetSetItem('weather', JSON.stringify(data));
								_this.weatherInfo = JSON.parse(window.localStorage.getItem('weather'))
							} else {
								if (window.localStorage.getItem('weather')) {
									_this.weatherInfo = JSON.parse(window.localStorage.getItem('weather'))
								}
							}
						});
					});
				}
				});
			});
		},
		resetSetItem (key, newVal) {
			if (key === 'weather') {
			    let newStorageEvent = document.createEvent('StorageEvent');
			    const storage = {
			      setItem: (k, val) => {
			        localStorage.setItem(k, val);
			        newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);
			        window.dispatchEvent(newStorageEvent);
			      }
			    };
			    return storage.setItem(key, newVal);
		  	}
		},
	}
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
@font-face { 
  font-family: ROME;       /*这里是说明调用来的字体名字*/ 
  src: url('../assets/font/font.ttf');  
}
.duty_weather {
	float: right;
	margin: 10px 0px;
	position: absolute;
	right: 20px;
}
.weather,.time {
	font-size: 20px;
	color: #fff;
	line-height: 26px;
	text-align: right;
	font-family: ROME;
}

.time span {
	display: inline-block;
}
.time span:nth-child(2n + 3) {
	width: 16px;
}
.time span:nth-child(2n) {
	padding: 0 2px;
}

@media screen and (min-width: 2000px) {
	.duty_weather {
		float: right;
		margin: 20px 0px;
		position: absolute;
		right: 20px;
	}
	.weather,.time {
		font-size: 40px;
		color: #fff;
		line-height: 52px;
		text-align: right;
		font-family: ROME;
	}

	.time span {
		display: inline-block;
	}
	.time span:nth-child(2n + 3) {
		width: 32px;
	}
	.time span:nth-child(2n) {
		padding: 0;
	}

}
</style>
