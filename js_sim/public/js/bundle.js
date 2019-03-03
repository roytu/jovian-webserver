(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// Generated by CoffeeScript 2.3.2
(function() {
  var Config, GLOBALX, GLOBALY, Moon, SCALE, current_time, draw_grid, helpText, init, moonText, moons, pos_to_percent, redraw, step, stepInput, stepText, svgDoc, timeInput, timeSubText, timeText;

  current_time = 27570;

  step = 0.1;

  SCALE = 5e7;

  GLOBALX = 0;

  GLOBALY = 0;

  Moon = require("./moon.js");

  Config = require("./config.js");

  moons = [];

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

  timeText = d3.select("body").append("div").style("font-family", "sans-serif").style("font-size", "20px").style("color", "white").style("text-shadow", "1px 1px #111").style("text-align", "right").style("position", "absolute").style("display", "block").style("top", "80%").style("right", "5%").style("width", "100%").style("height", "100%").html("t:  _______________   days");

  timeSubText = d3.select("body").append("div").style("font-family", "sans-serif").style("font-size", "10px").style("color", "white").style("text-shadow", "1px 1px #111").style("text-align", "right").style("position", "absolute").style("display", "block").style("top", "84%").style("right", "5%").style("width", "100%").style("height", "100%").html("(since game start)");

  stepText = d3.select("body").append("div").style("font-family", "sans-serif").style("font-size", "20px").style("color", "white").style("text-shadow", "1px 1px #111").style("text-align", "right").style("position", "absolute").style("display", "block").style("top", "90%").style("right", "5%").style("width", "100%").style("height", "100%").html("step: _________ days");

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
    svgDoc.selectAll("ellipse").remove();
    paths = svgDoc.selectAll("ellipse").data(moons);
    paths.enter().append("ellipse").attr("cx", function(m) {
      return `${-m.semimajor * m.ecc / SCALE * 50 + 50 + GLOBALX}%`;
    }).attr("cy", `${50 + GLOBALY}%`).attr("rx", function(m) {
      return `${m.semimajor / SCALE * 50}%`;
    }).attr("ry", function(m) {
      return `${m.semiminor / SCALE * 50}%`;
    });
    // Draw moons
    svgDoc.selectAll("circle").remove();
    s = svgDoc.selectAll("circle").data(moons);
    s.enter().append("circle").attr("cx", function(m) {
      return `${pos_to_percent(m.get_position_at_time(current_time)[0]) + GLOBALX}%`;
    }).attr("cy", function(m) {
      return `${pos_to_percent(m.get_position_at_time(current_time)[1]) + GLOBALY}%`;
    }).attr("r", function(m) {
      return 5;
    }).attr("fill", function(m) {
      return m.faction_color();
    }).attr("stroke", "black").on("mouseover", function(m) {
      var html;
      html = m.name;
      if (m.player !== null) {
        html += `<br>owned by ${m.player} (${m.faction})`;
      }
      moonText.html(html);
      return moonText.style("color", m.faction_color());
    });
    // Update time
    return timeInput.property("value", `${(current_time - 27570).toFixed(2)}`);
  };

  // Wait for moons to finish downloading first
  Moon.readyPromise.then(function() {
    return init();
  });

}).call(this);

},{"./config.js":2,"./moon.js":3}],2:[function(require,module,exports){
// Generated by CoffeeScript 2.3.2
(function() {
  // Globals
  var DT, T0, T1;

  T0 = 0; // Time begin since alignment

  T1 = 27670; // Time end since alignment

  DT = 0.1;

  module.exports = {
    T0: T0,
    T1: T1,
    DT: DT
  };

}).call(this);

},{}],3:[function(require,module,exports){
// Generated by CoffeeScript 2.3.2
(function() {
  var Config, MoonClass, PI, TIME_CONSTANT, TWO_PI, parse_moons, readyPromise;

  Config = require("./config.js");

  //TIME_CONSTANT = 6.378011090644188e-09
  TIME_CONSTANT = 6.461374608e-9; // Correcter value (thanks Szilard)

  //TIME_OFFSET = 27570
  PI = 3.141592653589;

  TWO_PI = 2 * PI;

  MoonClass = (function() {
    class MoonClass {
      constructor(id, name1, player1, faction1, income1, mass1, diameter1, semimajor1, ecc1, sign1) {
        this.calculate_trajectory = this.calculate_trajectory.bind(this);
        this.id = id;
        this.name = name1;
        this.player = player1;
        this.faction = faction1;
        this.income = income1;
        this.mass = mass1;
        this.diameter = diameter1;
        this.semimajor = semimajor1;
        this.ecc = ecc1;
        this.sign = sign1;
        // Derived from
        // https://www.wikiwand.com/en/Kepler%27s_laws_of_planetary_motion
        this.period = TIME_CONSTANT * this.semimajor ** 1.5;
        this.semiminor = this.semimajor * Math.sqrt(1 - this.ecc ** 2);
        this.positions = this.calculate_trajectory();
      }

      get_position_at_time(t) {
        " Return the position of the moon at time t ";
        var i, i0, i1, p0, p0x, p0y, p1, p1x, p1y, px, py, s;
        // Mod since we only save one period of positions
        t = ((t % this.period) + this.period) % this.period; // Disgusting trick to modulo negative numbers
        // Stolen from https://dev.to/maurobringolf/a-neat-trick-to-compute-modulo-of-negative-numbers-111e

        // Convert time to index
        i = (t - Config["T0"]) / Config["DT"];
        // Interpolate between the indices we have
        i0 = Math.floor(i);
        i1 = Math.ceil(i);
        if (i0 >= this.positions.length) {
          i0 = this.positions.length - 1;
        }
        if (i1 >= this.positions.length) {
          i1 = this.positions.length - 1;
        }
        s = i - i0;
        p0 = this.positions[i0];
        p0x = p0[0];
        p0y = p0[1];
        p1 = this.positions[i1];
        p1x = p1[0];
        p1y = p1[1];
        px = p1x * s + p0x * (1 - s);
        py = p1y * s + p0y * (1 - s);
        return [px, py];
      }

      calculate_position_at_time(t) {
        " Return the position of the moon at time t (since alignment) ";
        var E, ITER_MAX, M, f, i, j, n, newton_step, r, ref, theta, x, x_new, y;
        n = TWO_PI / this.period; // mean motion
        M = n * t; // mean anomaly
        f = (x) => {
          return x - this.ecc * Math.sin(x) - M;
        };
        newton_step = (x) => {
          return (x - this.ecc * Math.sin(x) - M) / (2 * (1 - this.ecc * Math.cos(x)));
        };
        E = 0;
        x = M;
        ITER_MAX = 10;
        for (i = j = 0, ref = ITER_MAX; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
          x_new = x - newton_step(x);
          E = x_new;
          if (f(x) < 0.001) { // desired accuracy achieved
            break;
          }
          x = x_new;
          if (i === ITER_MAX - 1) {
            console.log("Hit max iterations -- orbit may be slightly off course");
          }
        }
        theta = 2 * Math.atan(Math.sqrt(((1 + this.ecc) / (1 - this.ecc)) * Math.tan(E / 2) ** 2));
        if (E % TWO_PI > PI) {
          theta = TWO_PI - theta;
        }
        r = this.semimajor * (1 - this.ecc * Math.cos(E));
        theta *= this.sign; // Compensate for direction
        x = r * Math.cos(theta);
        y = r * Math.sin(theta);
        return [x, y];
      }

      calculate_trajectory() {
        var pos, poss, t;
        poss = [];
        t = Config["T0"];
        while (t <= Config["T1"] && t < Config["T0"] + this.period) {
          pos = this.calculate_position_at_time(t % this.period);
          poss.push(pos);
          t += Config["DT"];
        }
        return poss;
      }

      faction_color() {
        var d;
        d = {
          "BAIdu": "red",
          "NATO Inc.": "blue",
          "God™": "green",
          "Daytime": "yellow",
          "Contested": "orange",
          "Muses": "brown"
        };
        if (d[this.faction] != null) {
          return d[this.faction];
        } else {
          return "lightgray";
        }
      }

    };

    MoonClass.data = "";

    return MoonClass;

  }).call(this);

  readyPromise = new Promise((resolve, reject) => {
    return $.ajax({
      url: "moons.csv",
      success: (data) => {
        MoonClass.data = data;
        return resolve("CSV downloaded");
      },
      dataType: "text"
    });
  });

  parse_moons = function() {
    var moons, parse_moon, row, rows;
    parse_moon = function(row) {
      var diameter, ecc, faction, id_, income, items, mass, moon, name, player, semimajor, sign;
      items = row.split(",");
      id_ = parseInt(items[0], 10);
      name = items[1];
      player = items[2];
      faction = items[3];
      income = parseInt(items[4], 10);
      mass = parseFloat(items[5]);
      diameter = parseFloat(items[6]);
      semimajor = parseFloat(items[7]);
      ecc = parseFloat(items[8]);
      sign = parseInt(items[10], 10);
      moon = new MoonClass(id_, name, player, faction, income, mass, diameter, semimajor, ecc, sign);
      return moon;
    };
    rows = MoonClass.data.split("\n").slice(1);
    moons = (function() {
      var j, len, results;
      results = [];
      for (j = 0, len = rows.length; j < len; j++) {
        row = rows[j];
        results.push(parse_moon(row));
      }
      return results;
    })();
    return moons;
  };

  module.exports = {
    parse_moons: parse_moons,
    readyPromise: readyPromise
  };

}).call(this);

},{"./config.js":2}]},{},[1]);
