/**
 * 需要去高德地图注册key值
 * 
 * @export
 * @returns 
 */
export default function MapLoader () {  
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(window.AMap)
    } else {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = `http://webapi.amap.com/maps?v=1.4.14&callback=initAMap&key=84a7ed05d6ae1fac79e4fd6657d3d91f`;
      script.onerror = reject;
      document.head.appendChild(script);
    }
    window.initAMap = () => {
      resolve(window.AMap)
    }
  })
}