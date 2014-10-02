$.ready(function () {
  var flickrApiKey = 'ac25ff63c0e26a66260ff9a6ba8fc0b2';
  var flickrURL = 'http://api.flickr.com/services/feeds/photos_public.gne';
  var flickrApiUrl = 'https://api.flickr.com/services/rest'
  var flickrID = '81111903@N08';
  var jsonFormat = '&format=json&jsoncallback=?';
  var geoMethod = 'flickr.photos.geo.getLocation';
  var photosMethod = 'flickr.people.getPublicPhotos'

  //var ajaxURL = flickrURL + "?id=" + flickrID + jsonFormat;
  var photosURL = flickrApiUrl +
                  '?method=' + photosMethod +
                  '&api_key=' + flickrApiKey +
                  '&user_id=' + flickrID +
                  '&extras=date_taken,geo,url_t,url_sq,url_o&per_page=500' + jsonFormat;
  var geoURL = flickrApiUrl + '?method=' + geoMethod + "&api_key=" + flickrApiKey;
  var map;
  var imageDetail = $('#image-detail');
  console.log(imageDetail);

  function initialize() {
    var mapOptions = {
      center: { lat: 51.565494, lng: -0.099992},
      panControl: true,
      zoomControl: true,
      zoom: 10
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    getPhotos();
  }


  function getPhotos() {
    $.getJSON(photosURL, function (data) {
      console.log(data);
      var photos = data.photos.photo;
      for(i=0; i<photos.length; i++) {
        var photo = photos[i];
        var lat = photo.latitude;
        var long = photo.longitude;
        var thumb = photo.url_t;
        var origImage = photo.url_o;
        //build the url of the photo in order to link to it
        //var photoURL = 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_m.jpg'
        if(lat !== 0 && long !== 0) {
            var photoLatLang = new google.maps.LatLng(lat, long);
            var icon = {
              url: photo.url_sq,
              size: new google.maps.Size(photo.height_sq, photo.width_sq),
              origin: new google.maps.Point(0,0),
              anchor: new google.maps.Point(10,10)
              //scaledSize: new google.maps.Size(50, 50)
            };
            var marker = new google.maps.Marker({
              position: photoLatLang,
              map: map,
              title: photo.title,
              icon: icon
            });

            google.maps.event.addListener(marker, 'click', function() {
              console.log('clicked!');
              $(imageDetail).css('display', 'block');
              $('img', imageDetail).css('display', 'block');
              $('img', imageDetail).attr('src', origImage);
              $('figcaption', imageDetail).text(photo.title + ' - ' + photo.datetaken);
            });

            console.log(lat, long, marker);
        }

      }
    });
  }
  google.maps.event.addDomListener(window, 'load', initialize);
});
