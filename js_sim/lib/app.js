// Generated by CoffeeScript 2.3.2
(function() {
  var Config, GLOBALX, GLOBALY, Moon, SCALE, current_time, dist, distEllipse, distInput, distText, draw_grid, helpText, init, max_dist, moonText, moons, pos_to_percent, redraw, selected_moon, step, stepInput, stepText, svgDoc, timeInput, timeSubText, timeText;

  current_time = 27570;

  max_dist = 0.5e7; // in km

  selected_moon = null;

  step = 0.1;

  SCALE = 5e7;

  GLOBALX = 0;

  GLOBALY = 0;

  Moon = require("./moon.js");

  Config = require("./config.js");

  moons = [];

  dist = function(p1, p2) {
    return ((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2) ** 0.5;
  };

  pos_to_percent = function(x) {
    var percent;
    // Get coord as percentage of scale
    percent = ((x / SCALE) + 1) * 50;
    return percent;
  };

  draw_grid = function(svgDoc) {
    var i, j, results, x, y;
    // Draw grid
    svgDoc.selectAll("line").remove();
    svgDoc.append("line").attr("class", "grid-line-center").attr("x1", "0%").attr("x2", "100%").attr("y1", `${50 + GLOBALY}%`).attr("y2", `${50 + GLOBALY}%`);
    svgDoc.append("line").attr("class", "grid-line-center").attr("x1", `${50 + GLOBALX}%`).attr("x2", `${50 + GLOBALX}%`).attr("y1", "0%").attr("y2", "100%");
    for (y = i = 0; i < 20; y = ++i) {
      svgDoc.append("line").attr("class", "grid-line").attr("x1", "0%").attr("x2", "100%").attr("y1", y * 5 + "%").attr("y2", y * 5 + "%");
    }
    results = [];
    for (x = j = 0; j < 20; x = ++j) {
      results.push(svgDoc.append("line").attr("class", "grid-line").attr("x1", x * 5 + "%").attr("x2", x * 5 + "%").attr("y1", "0%").attr("y2", "100%"));
    }
    return results;
  };

  // Initialize SVG
  svgDoc = d3.select("body").append("svg");

  moonText = d3.select("body").append("div").style("font-family", "sans-serif").style("font-size", "20px").style("color", "white").style("text-shadow", "1px 1px #111").style("text-align", "left").style("position", "absolute").style("display", "block").style("top", "10px").style("left", "5%");

  helpText = d3.select("body").append("div").style("font-family", "sans-serif").style("font-size", "20px").style("color", "white").style("text-shadow", "1px 1px #111").style("text-align", "right").style("position", "absolute").style("display", "block").style("top", "10px").style("right", "5%").html("s - zoom in<br>\na - zoom out<br>\nz - step backwards<br>\nZ - step backwards fast<br>\nx - step forwards<br>\nX - step forwards fast<br>\nArrow Keys - move<br>");

  distText = d3.select("body").append("div").style("font-family", "sans-serif").style("font-size", "20px").style("color", "white").style("text-shadow", "1px 1px #111").style("text-align", "right").style("position", "absolute").style("display", "block").style("top", "70%").style("right", "5%").style("width", "100%").style("height", "100%").html("d:  _______________   km");

  distEllipse = svgDoc.append("ellipse").attr("cx", function() {
    if (selected_moon !== null) {
      return `${pos_to_percent(selected_moon.get_position_at_time(current_time)[0]) + GLOBALX}%`;
    } else {
      return 0;
    }
  }).attr("cy", function() {
    if (selected_moon !== null) {
      return `${pos_to_percent(selected_moon.get_position_at_time(current_time)[1]) + GLOBALY}%`;
    } else {
      return 0;
    }
  }).attr("rx", 0).attr("ry", 0).attr("fill", "transparent").attr("stroke", "black");

  timeText = d3.select("body").append("div").style("font-family", "sans-serif").style("font-size", "20px").style("color", "white").style("text-shadow", "1px 1px #111").style("text-align", "right").style("position", "absolute").style("display", "block").style("top", "80%").style("right", "5%").style("width", "100%").style("height", "100%").html("t:  _______________   days");

  timeSubText = d3.select("body").append("div").style("font-family", "sans-serif").style("font-size", "10px").style("color", "white").style("text-shadow", "1px 1px #111").style("text-align", "right").style("position", "absolute").style("display", "block").style("top", "84%").style("right", "5%").style("width", "100%").style("height", "100%").html("(since game start)");

  stepText = d3.select("body").append("div").style("font-family", "sans-serif").style("font-size", "20px").style("color", "white").style("text-shadow", "1px 1px #111").style("text-align", "right").style("position", "absolute").style("display", "block").style("top", "90%").style("right", "5%").style("width", "100%").style("height", "100%").html("step: _________ days");

  distInput = d3.select("body").append("input").attr("type", "text").attr("size", "10").style("font-family", "sans-serif").style("font-size", "20px").style("background-color", "transparent").style("text-shadow", "1px 1px #111").style("text-align", "right").style("color", "white").style("border", "none").style("position", "absolute").style("display", "block").style("top", "70%").style("right", "10%").attr("value", `${max_dist}`).on("change", () => {
    max_dist = parseFloat(distInput.property("value"), 10);
    return redraw();
  });

  timeInput = d3.select("body").append("input").attr("type", "text").attr("size", "10").style("font-family", "sans-serif").style("font-size", "20px").style("background-color", "transparent").style("text-shadow", "1px 1px #111").style("text-align", "right").style("color", "white").style("border", "none").style("position", "absolute").style("display", "block").style("top", "80%").style("right", "10%").attr("value", "0").on("change", () => {
    current_time = parseFloat(timeInput.property("value"), 10) + 27570;
    return redraw(); // NOTE: value is actually current_time - 27570
  });

  stepInput = d3.select("body").append("input").attr("type", "text").attr("size", "10").style("font-family", "sans-serif").style("font-size", "20px").style("background-color", "transparent").style("text-shadow", "1px 1px #111").style("text-align", "right").style("color", "white").style("border", "none").style("position", "absolute").style("display", "block").style("top", "90%").style("right", "10%").attr("value", `${step}`).on("change", () => {
    return step = parseFloat(stepInput.property("value"), 10);
  });

  init = function() {
    console.log("Initializing...");
    moons = Moon.parse_moons();
    $(document).on('keydown', function(e) {
      if (e.key === "s") { // s = zoom in
        SCALE *= 0.95;
        redraw();
      }
      if (e.key === "a") { // a = zoom out
        SCALE /= 0.95;
        redraw();
      }
      if (e.key === "z") { // z = step backward
        current_time -= step;
        if (current_time < Config["T0"]) {
          current_time = Config["T0"];
        }
        redraw();
      }
      if (e.key === "Z") { // Z = step backward fast
        current_time -= step * 10;
        if (current_time < Config["T0"]) {
          current_time = Config["T0"];
        }
        redraw();
      }
      if (e.key === "x") { // z = step forward
        current_time += step;
        if (current_time > Config["T1"]) {
          current_time = Config["T1"];
        }
        redraw();
      }
      if (e.key === "X") { // Z = step forward fast
        current_time += step * 10;
        if (current_time > Config["T1"]) {
          current_time = Config["T1"];
        }
        redraw();
      }
      if (e.key === "ArrowLeft") { // Move
        GLOBALX += 5;
        redraw();
      }
      if (e.key === "ArrowRight") { // Move
        GLOBALX -= 5;
        redraw();
      }
      if (e.key === "ArrowUp") { // Move
        GLOBALY += 5;
        redraw();
      }
      if (e.key === "ArrowDown") { // Move
        GLOBALY -= 5;
        return redraw();
      }
    });
    svgDoc.append("div").text("Moon: ");
    return redraw();
  };

  redraw = function() {
    var paths, s;
    // Draw grid
    draw_grid(svgDoc);
    // Draw path
    // Remove all old paths
    svgDoc.selectAll(".path").remove();
    paths = svgDoc.selectAll(".path").data(moons);
    paths.enter().append("ellipse").attr("class", "path").attr("cx", function(m) {
      return `${-m.semimajor * m.ecc / SCALE * 50 + 50 + GLOBALX}%`;
    }).attr("cy", `${50 + GLOBALY}%`).attr("rx", function(m) {
      return `${m.semimajor / SCALE * 50}%`;
    }).attr("ry", function(m) {
      return `${m.semiminor / SCALE * 50}%`;
    });
    // Update distEllipse
    distEllipse.attr("cx", function() {
      if (selected_moon !== null) {
        return `${pos_to_percent(selected_moon.get_position_at_time(current_time)[0]) + GLOBALX}%`;
      } else {
        return 0;
      }
    }).attr("cy", function() {
      if (selected_moon !== null) {
        return `${pos_to_percent(selected_moon.get_position_at_time(current_time)[1]) + GLOBALY}%`;
      } else {
        return 0;
      }
    }).attr("rx", `${max_dist / SCALE * 50}%`).attr("ry", `${max_dist / SCALE * 50}%`).attr("opacity", function() {
      if (selected_moon !== null) {
        return 1;
      } else {
        return 0;
      }
    });
    // Draw moons
    svgDoc.selectAll(".moon").remove();
    s = svgDoc.selectAll(".moon").data(moons);
    s.enter().append("circle").attr("class", "moon").attr("cx", function(m) {
      return `${pos_to_percent(m.get_position_at_time(current_time)[0]) + GLOBALX}%`;
    }).attr("cy", function(m) {
      return `${pos_to_percent(m.get_position_at_time(current_time)[1]) + GLOBALY}%`;
    }).attr("r", function(m) {
      return 5;
    }).attr("fill", function(m) {
      return m.faction_color();
    }).attr("stroke", "black").attr("opacity", function(m) {
      if (selected_moon === null || dist(m.get_position_at_time(current_time), selected_moon.get_position_at_time(current_time)) < max_dist) {
        return 1;
      } else {
        return 0.5;
      }
    }).on("mouseover", function(m) {
      var html;
      html = m.name;
      if (m.player !== null) {
        html += `<br>owned by ${m.player} (${m.faction})`;
      }
      moonText.html(html);
      return moonText.style("color", m.faction_color());
    }).on("click", function(m) {
      selected_moon = m;
      return redraw();
    });
    // Update time
    return timeInput.property("value", `${(current_time - 27570).toFixed(2)}`);
  };

  // Wait for moons to finish downloading first
  Moon.readyPromise.then(function() {
    return init();
  });

}).call(this);
