let make_slide = (datetime, headline, text, location, latlong, path) => ({
  "text": {
    "headline": `${headline}<p><small>${datetime}</small></p>`,
    "text": text
  },
  "location": {
    "name": location,
    "lat": +latlong[0],
    "lon": +latlong[1],
    "zoom": 10,
    "line": true
  },
  "media": {
    "url": path,
    "credit": "",
    "caption": ""
  }
});

d3.csv("data.csv").then(data => {
  let storymap_data = {
    storymap: {
      font_css: "",
      map_type: "mapbox:://styles/sychonato/ckfrytb9i1mm319t8ftprzdcj",
      map_background_color: "#000",
      slides: [
        {
          "type": "overview",
          "text": {
            "headline": "เกิดอะไร ที่ไหน<br />ใน 6 ตุลา 19<p><small>Oct 6 Story Map</small></p>",
            "text": "ทบทวนเหตุการณ์ 6 ตุลา 19 ผ่านพื้นที่จริง"
          },
          "media": {
            "url": "",
            "credit": "",
            "caption": ""
          }
        }
      ]
    }
  };
  
  let latlong_known;

  for (let i = 0; i < data.length; i++) {
    let date_split = data[i].Date.split('.');
    let date_string = new Date(+date_split[2] - 543, +date_split[1] - 1, +date_split[0])
      .toLocaleDateString("th-u-ca-buddhist", {"year":"numeric","month":"short","day":"numeric"});

    let time_split = data[i].Time.split('.');
    let time_string = (data[i].Time != "unknown") ? `<span class="space"></span>|<span class="space"></span>เวลา ${time_split[0]}:${time_split[1]} น.` : '';
    
    if (data[i].Location != "unknown") {
      latlong_known = data[i].latlong.split(", ");

      storymap_data.storymap.slides.push(make_slide(
        `${date_string}${time_string}`,
        data[i].Title,
        `<p>${data[i].Description}</p>`,
        // `<p>${data[i].Description}</p><span class='vco-note'>ที่มา: <a href='${data[i].Reference}'>${data[i].Reference}</a></span>`,
        data[i].Location,
        latlong_known,
        isNaN(data[i].Photo) ? "" : `images/${data[i].Photo}.jpg`
      ));
    }
  }

  let storymap_options = {
    map_access_token: 'pk.eyJ1Ijoic3ljaG9uYXRvIiwiYSI6ImNqeHU1cmo5aTExcjEzY21ibnlvdmcwcnkifQ.-DFxiUO5M6B-p2cZQJJ9ng'
  };

  let storymap = new VCO.StoryMap('mapdiv', storymap_data, storymap_options);
  window.onresize = function(event) {
    storymap.updateDisplay();
  }
});
