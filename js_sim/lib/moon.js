// Generated by CoffeeScript 2.3.2
(function() {
  var Config, MOON_DATA, MoonClass, PI, TIME_CONSTANT, TIME_OFFSET, TWO_PI, parse_moons;

  Config = require("./config.js");

  TIME_CONSTANT = 6.378011090644188e-09;

  TIME_OFFSET = 27570;

  PI = 3.141592653589;

  TWO_PI = 2 * PI;

  MOON_DATA = "0,Jupiter,NPCs,Contested,0,1.90E+11,1.40E+05,69911,0,Inner,1,\n1,Metis,Jamie,NATO Inc.,100,3.6,45,128852,0.0077,Inner,1,\n2,Adrastea,Genie NPC,God™,100,0.2,17,129000,0.0063,Inner,1,\n3,Amalthea,[Kelly],BAIdu,100,208,175,181366,0.0075,Inner,1,\n4,Thebe,Croww,Cont. BAIdu,100,43,99,222452,0.018,Inner,1,\n5,Io,Jake,BAIdu,1000,8931900,3643,421700,0.0041,Galilean,1,\n6,Europa,Mac,NATO Inc.,1000,4800000,3122,671034,0.0094,Galilean,1,\n7,Ganymede,Brian,God™,1000,14819000,5262,1070412,0.0011,Galilean,1,Daddy\n8,Callisto,NPCs,Contested,1000,10759000,4821,1882709,0.0074,Galilean,1,\n9,Themisto,Croww,BAIdu,10,0.069,8,7393216,0.2115,Themisto,1,\n10,Leda,Cheryl,NATO Inc.,10,0.6,16,11187781,0.1673,Himalia,1,\n11,Himalia,Kevin,Cont. NATO,100,670,170,11451971,0.1513,Himalia,1,\n12,Auge,[Ryan],Daytime,10,0.0015,2,11453004,0.0944,Himalia,1,\n13,Arktos,Bryant,Daytime,10,0.0015,2,11494801,0.18,Himalia,1,\n14,Lysithea,[Gerry],BAIdu,10,6.3,36,11740560,0.1322,Himalia,1,\n15,Elara,[Sophia],God™,10,87,86,11778034,0.1948,Himalia,1,\n16,Dia,Turtle,x,10,0.009,4,12570424,0.2058,Himalia,1,\n17,Carpo,Cheryl,NATO Inc.,10,0.0045,3,17144873,0.2735,Carpo,1,\n18,not-Ananke,Kalen,x,10,0.00015,1,17739539,0.4449,Ananke (?),-1,\n19,Valetudo,Eli,God™,10,0.0015,1,18928095,0.2219,Valetudo,1,\n20,Euporie,,NATO Inc.,10,0.0015,2,19088434,0.096,Ananke,-1,\n21,Anatole,[Ryan],Daytime,10,0.0015,2,19621780,0.2507,Ananke,-1,\n22,Mousike,,Daytime,10,0.0015,2,20219648,0.1048,Ananke,-1,\n23,Pherousa,,NATO Inc.,10,0.0015,1,20307150,0.307,Ananke,-1,\n24,Thelxinoe,[Yariv],BAIdu,10,0.0015,2,20453753,0.2684,Ananke,-1,\n25,Euanthe,,NATO Inc.,10,0.0045,3,20464854,0.2,Ananke,-1,\n26,Helike,Anthony,x,10,0.009,4,20540266,0.1374,Ananke,-1,\n27,Orthosie,Mayia,NATO Inc.,10,0.0015,2,20567971,0.2433,Ananke,-1,\n28,Gymnastike,,Daytime,10,0.0015,2,20571458,0.2147,Ananke,-1,\n29,Nymphe,Luxury,Daytime,10,0.0015,3,20595483,0.1377,Ananke,-1,\n30,Mesembria,,Daytime,10,0.0015,2,20639315,0.1477,Ananke,-1,\n31,Iocaste,Kelly,x,10,0.019,5,20722566,0.2874,Ananke,-1,\n32,Melete,[Anastasia],BAIdu,10,0.0015,2,20743779,0.3184,Ananke,-1,\n33,Praxidike,Kalen,x,10,0.043,7,20823948,0.184,Ananke,-1,\n34,Harpalyke,,x,10,0.012,4,21063814,0.244,Ananke,-1,\n35,Mneme,[Anastasia],BAIdu,10,0.0015,2,21129786,0.3169,Ananke,-1,\n36,Hermippe,Kelly,x,10,0.009,4,21182086,0.229,Ananke,-1,\n37,Thyone,MBD,x,10,0.009,4,21405570,0.2525,Ananke,-1,\n38,Elete,,Daytime,10,0.0015,2,21429955,0.2288,Ananke,-1,\n39,Ananke,Kalen,Cont. n/a,100,3,28,21454952,0.3445,Ananke,-1,\n40,Herse,Turtle,x,10,0.0015,2,22134306,0.2379,Carme,-1,\n41,Aitne,,x,10,0.0045,3,22285161,0.3927,Carme,-1,\n42,Auxo,,God™,10,0.0015,2,22394682,0.5569,Pasiphae (fringe),-1,\n43,Calliope,Szilard,Muse CN 1,10,0.0015,1,22401817,0.2328,Carme,-1,\n44,Kale,,x,10,0.0015,2,22409207,0.2011,Carme,-1,\n45,Taygete,Adam,x,10,0.016,5,22438648,0.3678,Carme,-1,\n46,Akte,Bryant,Daytime,10,0.0015,2,22696750,0.2572,Carme,-1,\n47,Chaldene,Roy,x,10,0.0075,4,22713444,0.2916,Carme,-1,\n48,Thallo,[Jared],God™,10,0.0015,2,22720999,0.0932,Pasiphae,-1,\n49,not-Carme,,x,10,0.0015,2,22730813,0.3438,Carme,-1,\n50,Xarpo,[Jared],God™,10,0.0015,2,22739654,0.393,Pasiphae,-1,\n51,Erinome,,x,10,0.0045,3,22986266,0.2552,Carme,-1,\n52,Aoede,[Yariv],BAIdu,10,0.009,4,23044175,0.4311,Pasiphae,-1,\n53,Kallichore,[Cheryl],NATO Inc.,10,0.0015,2,23111823,0.2041,Carme,-1,\n54,Clio,Szilard,Muse TN 2,10,0.0015,2,23169389,0.2842,Carme,-1,\n55,Euterpe,Szilard,Muse CG 3,10,0.0015,1,23174446,0.3118,Carme,-1,\n56,Kalyke,,God™,10,0.019,5,23180773,0.2139,Carme,-1,\n57,Carme,Michael,Cont. God,100,13,46,23197992,0.2342,Carme,-1,\n58,Callirrhoe,,x,10,0.087,9,23214986,0.2582,Pasiphae,-1,\n59,Eurydome,Michael,x,10,0.0045,3,23230858,0.3769,Pasiphae,-1,\n60,Thalia,[Good],Muse NG 4,10,0.0015,2,23240957,0.236,Carme,-1,\n61,Pasithee,,x,10,0.0015,2,23307318,0.3288,Carme,-1,\n62,Melpomene,[Good],Muse LG 5,10,0.0015,2,23314335,0.32,Carme,-1,\n63,Kore,,x,10,0.0015,2,23345093,0.1951,Pasiphae,-1,\n64,Cyllene,,x,10,0.0015,2,23396269,0.4115,Pasiphae,-1,\n65,Terpsichore,[Evil],Muse LN 6,10,0.0015,1,23400981,0.3321,Pasiphae,-1,\n66,Eukelade,[Good],Muse TN 0,10,0.009,4,23483694,0.2828,Carme,-1,\n67,Erato,[Evil],Muse LE 7,10,0.0015,2,23483978,0.3969,Pasiphae,-1,\n68,Hesperis,,Daytime,10,0.0015,2,23570790,0.3003,Pasiphae,-1,\n69,Pasiphae,Mayia,Cont. NATO,100,30,60,23609042,0.3743,Pasiphae,-1,\n70,Hegemone,,God™,10,0.0045,3,23702511,0.4077,Pasiphae,-1,\n71,Arche,[Kelvin],BAIdu,10,0.0045,3,23717051,0.1492,Carme,-1,\n72,Isonoe,Eraser,x,10,0.0075,4,23800647,0.1775,Carme,-1,\n73,Polyhymnia,[Evil],Muse NE 8,10,0.00015,1,23857808,0.2761,Carme,-1,\n74,Urania,Szilard,Muse CE 9,10,0.009,4,23973926,0.307,Carme,-1,\n75,Sinope,Caug,Cont. NATO,100,7.5,38,24057865,0.275,Pasiphae,-1,\n76,Sponde,,Daytime,10,0.0015,2,24252627,0.4431,Pasiphae,-1,\n77,Autonoe,[Yanny],x,10,0.009,4,24264445,0.369,Pasiphae,-1,\n78,Megaclite,Kalvin,x,10,0.021,5,24687239,0.3077,Pasiphae,-1,\n79,Dysis,Kalvin,Daytime,10,0.0015,2,28570410,0.4074,Pasiphae (?),-1,";

  MoonClass = class MoonClass {
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
      " Return the position of the moon at time t ";
      var E, ITER_MAX, M, f, i, j, n, newton_step, r, ref, theta, x, x_new, y;
      t += TIME_OFFSET; // Compensate for start time
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
      var dt, pos, poss, t, t0, t1;
      t0 = 0;
      t1 = 100;
      dt = 1;
      poss = [];
      t = t0;
      while (t <= t1) {
        pos = this.calculate_position_at_time(t);
        poss.push(pos);
        t += dt;
      }
      return poss;
    }

    faction_color() {
      return {
        "BAI": "red",
        "NAT": "blue",
        "God": "green",
        "Con": "yellow",
        "Day": "orange",
        "Mus": "purple",
        "x": "gray"
      }[this.faction.substr(0, 3)];
    }

  };

  parse_moons = function() {
    var moons, parse_moon, row, rows;
    parse_moon = function(row) {
      var diameter, ecc, faction, id_, income, items, mass, moon, name, player, semimajor, sign;
      items = row.split(",");
      id_ = parseInt(items[0], 10);
      name = parseInt(items[1], 10);
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
    rows = MOON_DATA.split("\n");
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
    parse_moons: parse_moons
  };

}).call(this);
