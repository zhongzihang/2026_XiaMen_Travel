(function () {
  'use strict';
  const gallery = window.XiamenPhotoResearch || (window.XiamenPhotoResearch = {});
  const local = paths => paths.map(path => ({ path: `assets/gallery/${path}` }));
  Object.assign(gallery, {
    sanqiutian: {
      source: 'https://you.ctrip.com/traffic/xiamen21/g51286552.html',
      originalSource: 'https://www.xmferry.com/',
      localPhotos: local(['sanqiutian-1.jpg', 'sanqiutian-2.jpg'])
    },
    dongdu: {
      source: 'https://you.ctrip.com/sight/xiamen21/118822817.html',
      localPhotos: local(['dongdu-2.jpg'])
    },
    zhongshan: {
      source: 'https://you.ctrip.com/sight/xiamen21/137032.html',
      localPhotos: local(['zhongshan-1.jpg'])
    },
    xmu: {
      source: 'https://you.ctrip.com/sight/xiamen21/14050.html',
      localPhotos: local(['xmu-1.jpg', 'xmu-2.jpg', 'xmu-3.jpg'])
    },
    bashi: {
      source: 'https://www.sohu.com/a/346221485_100289996',
      localPhotos: local(['bashi-2.jpeg'])
    },
    baijia: {
      source: 'https://you.ctrip.com/sight/xiamen21/1468076.html',
      localPhotos: local(['baijia-1.jpg'])
    },
    yujian: {
      source: 'https://you.ctrip.com/sight/xiamen21/150107038.html',
      localPhotos: local(['yujian-2.jpg', 'yujian-3.jpg', 'yujian-4.jpg'])
    },
    nanputuo: {
      source: 'https://you.ctrip.com/sight/xiamen21/2344.html',
      localPhotos: local(['nanputuo-2.jpg', 'nanputuo-3.jpg', 'nanputuo-4.jpg'])
    },
    heping: {
      source: 'https://you.ctrip.com/sight/xiamen21/139403.html',
      localPhotos: [
        { path: 'assets/gallery/heping-cruise-2.jpg', source: 'https://you.ctrip.com/travels/xiamen21/3983757.html' },
        { path: 'assets/gallery/heping-cruise-3.jpg', source: 'https://hk.trip.com/moments/detail/xiamen-21-137731833/' },
        { path: 'assets/gallery/heping-cruise-4.jpg', source: 'https://www.youting.com/package/126' }
      ]
    },
    hotel: {
      source: 'https://www.klook.com/zh-CN/hotels/detail/1991701-seashine-eshare-intelligence-hotel-xiamen-zhongshan-road/',
      localPhotos: [
        { path: 'assets/gallery/hotel-exterior-new.jpg', source: 'https://www.klook.com/zh-CN/hotels/detail/1060276/' },
        { path: 'assets/gallery/hotel-ez-3.jpg', source: 'https://hotel.eztravel.com.tw/detail?CityID=25&CityName=xiamen&HotelID=444772' },
        { path: 'assets/gallery/hotel-ez-7.jpg', source: 'https://hotel.eztravel.com.tw/detail?CityID=25&CityName=xiamen&HotelID=444772' }
      ]
    },
    station: {
      source: 'https://en.wikipedia.org/wiki/Xiamen_railway_station',
      localPhotos: [
        { path: 'assets/gallery/station-hall-new.jpg', source: 'https://www.fjdaily.com/app/content/2025-12/17/content_3768170.html' },
        { path: 'assets/gallery/station-exit-new.jpg', source: 'https://commons.wikimedia.org/wiki/File:Xiamen_Railway_Station_North_Exit_20170727.jpg' }
      ]
    }
  });
  if (gallery.cable) gallery.cable.localPhotos.push(...local(['cable-4.jpg']));
})();
