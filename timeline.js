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
      slides: [
        {
          "type": "overview",
          "text": {
            "headline": "ไทมไลน์ 6 ตุลา<small>Thammasat University Massacre Timeline</small>",
            "text": ""
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
    let time_string = (data[i].Time != "unknown") ? ` เวลา ${time_split[0]}:${time_split[1]} น.` : '';
    
    if (data[i].Location != "unknown") {
      latlong_known = data[i].latlong.split(", ");

      storymap_data.storymap.slides.push(make_slide(
        `${date_string}${time_string}`,
        data[i].Title,
        `<p>${data[i].Description}</p>`,
        // `<p>${data[i].Description}</p><span class='vco-note'>ที่มา: <a href='${data[i].Reference}'>${data[i].Reference}</a></span>`,
        data[i].Location,
        latlong_known,
        `images/${data[i].Photo}`
      ));
    }
  }

  let storymap_options = {};

  let storymap = new VCO.StoryMap('mapdiv', storymap_data, storymap_options);
  window.onresize = function(event) {
    storymap.updateDisplay();
  }
});
