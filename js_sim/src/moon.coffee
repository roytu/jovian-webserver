
Config = require("./config.js")

TIME_CONSTANT = 6.378011090644188e-09
TIME_OFFSET = 27570
PI = 3.141592653589
TWO_PI = 2 * PI

MOON_DATA = """
45,Taygete,Adam,Anarchy,10,0.016,5,22438648,0.3678,Carme,-1,
18,not-Ananke,Kalen,AoE,10,0.00015,1,17739539,0.4449,Ananke (?),-1,
33,Praxidike,Kalen,AoE,10,0.043,7,20823948,0.184,Ananke,-1,
39,Ananke,Kalen,AoE,100,3,28,21454952,0.3445,Ananke,-1,
78,Megaclite,Kalvin,Apples,10,0.021,5,24687239,0.3077,Pasiphae,-1,
3,Amalthea,Kelly,BAIdu,100,208,175,181366,0.0075,Inner,1,
4,Thebe,Croww,BAIdu,100,43,99,222452,0.018,Inner,1,
5,Io,Jake,BAIdu,1000,8931900,3643,421700,0.0041,Galilean,1,
9,Themisto,Croww,BAIdu,10,0.069,8,7393216,0.2115,Themisto,1,
14,Lysithea,Gerry,BAIdu,10,6.3,36,11740560,0.1322,Himalia,1,
24,Thelxinoe,Yariv,BAIdu,10,0.0015,2,20453753,0.2684,Ananke,-1,
31,Iocaste,Kelly,BAIdu,10,0.019,5,20722566,0.2874,Ananke,-1,
32,Melete,Anastasia,BAIdu,10,0.0015,2,20743779,0.3184,Ananke,-1,
35,Mneme,Anastasia,BAIdu,10,0.0015,2,21129786,0.3169,Ananke,-1,
36,Hermippe,Kelly,BAIdu,10,0.009,4,21182086,0.229,Ananke,-1,
52,Aoede,Yariv,BAIdu,10,0.009,4,23044175,0.4311,Pasiphae,-1,
71,Arche,Gerry,BAIdu,10,0.0045,3,23717051,0.1492,Carme,-1,
44,Kale,NPC Bro,Blackatsuki,10,0.0015,2,22409207,0.2011,Carme,-1,
0,Jupiter,NPCs,Contested,0,1.90E+11,1.40E+05,69911,0,Inner,1,
8,Callisto,NPCs,Contested,1000,10759000,4821,1882709,0.0074,Galilean,1,
11,Himalia,NPCs,Contested,100,670,170,11451971,0.1513,Himalia,1,
34,Harpalyke,NPCs,Contested,10,0.012,4,21063814,0.244,Ananke,-1,
41,Aitne,NPCs,Contested,10,0.0045,3,22285161,0.3927,Carme,-1,
47,Chaldene,Roy,Contested,10,0.0075,4,22713444,0.2916,Carme,-1,
51,Erinome,NPCs,Contested,10,0.0045,3,22986266,0.2552,Carme,-1,
58,Callirrhoe,NPCs,Contested,10,0.087,9,23214986,0.2582,Pasiphae,-1,
63,Kore,NPCs,Contested,10,0.0015,2,23345093,0.1951,Pasiphae,-1,
69,Pasiphae,NPCs,Contested,100,30,60,23609042,0.3743,Pasiphae,-1,
16,Dia,Turtle,CulTBD,10,0.009,4,12570424,0.2058,Himalia,1,
40,Herse,Turtle,CulTBD,10,0.0015,2,22134306,0.2379,Carme,-1,
12,Auge,Ryan,Daytime,10,0.0015,2,11453004,0.0944,Himalia,1,
13,Arktos,Bryant,Daytime,10,0.0015,2,11494801,0.18,Himalia,1,
21,Anatole,Ryan,Daytime,10,0.0015,2,19621780,0.2507,Ananke,-1,
22,Mousike,Morning,Daytime,10,0.0015,2,20219648,0.1048,Ananke,-1,
28,Gymnastike,Morning,Daytime,10,0.0015,2,20571458,0.2147,Ananke,-1,
29,Nymphe,Luxury,Daytime,10,0.0015,3,20595483,0.1377,Ananke,-1,
30,Mesembria,Afternoon,Daytime,10,0.0015,2,20639315,0.1477,Ananke,-1,
38,Elete,Evening,Daytime,10,0.0015,2,21429955,0.2288,Ananke,-1,
46,Akte,Bryant,Daytime,10,0.0015,2,22696750,0.2572,Carme,-1,
68,Hesperis,Evening,Daytime,10,0.0015,2,23570790,0.3003,Pasiphae,-1,
76,Sponde,Afternoon,Daytime,10,0.0015,2,24252627,0.4431,Pasiphae,-1,
79,Dysis,Kalvin,Daytime,10,0.0015,2,28570410,0.4074,Pasiphae (?),-1,
2,Adrastea,Genie NPC,God™,100,0.2,17,129000,0.0063,Inner,1,
7,Ganymede,Brian,God™,1000,14819000,5262,1070412,0.0011,Galilean,1,Daddy
15,Elara,Sophia,God™,10,87,86,11778034,0.1948,Himalia,1,
19,Valetudo,Eli,God™,10,0.0015,1,18928095,0.2219,Valetudo,1,
42,Auxo,Allen,God™,10,0.0015,2,22394682,0.5569,Pasiphae (fringe),-1,
48,Thallo,Jared,God™,10,0.0015,2,22720999,0.0932,Pasiphae,-1,
50,Xarpo,Jared,God™,10,0.0015,2,22739654,0.393,Pasiphae,-1,
56,Kalyke,Kyle,God™,10,0.019,5,23180773,0.2139,Carme,-1,
57,Carme,Michael,God™,100,13,46,23197992,0.2342,Carme,-1,
59,Eurydome,Michael,God™,10,0.0045,3,23230858,0.3769,Pasiphae,-1,
64,Cyllene,NPC God,God™,10,0.0015,2,23396269,0.4115,Pasiphae,-1,
70,Hegemone,Kyle,God™,10,0.0045,3,23702511,0.4077,Pasiphae,-1,
37,Thyone,MBD,MBD,10,0.009,4,21405570,0.2525,Ananke,-1,
77,Autonoe,NPC Yanny,Mrs. Yanny,10,0.009,4,24264445,0.369,Pasiphae,-1,
43,Calliope,Szilard,Muses,10,0.0015,1,22401817,0.2328,Carme,-1,
54,Clio,Szilard,Muses,10,0.0015,2,23169389,0.2842,Carme,-1,
55,Euterpe,Szilard,Muses,10,0.0015,1,23174446,0.3118,Carme,-1,
60,Thalia,Good,Muses,10,0.0015,2,23240957,0.236,Carme,-1,
62,Melpomene,Good,Muses,10,0.0015,2,23314335,0.32,Carme,-1,
65,Terpsichore,Evil,Muses,10,0.0015,1,23400981,0.3321,Pasiphae,-1,
66,Eukelade,Good,Muses,10,0.009,4,23483694,0.2828,Carme,-1,
67,Erato,Evil,Muses,10,0.0015,2,23483978,0.3969,Pasiphae,-1,
73,Polyhymnia,Evil,Muses,10,0.00015,1,23857808,0.2761,Carme,-1,
74,Urania,Szilard,Muses,10,0.009,4,23973926,0.307,Carme,-1,
1,Metis,Jamie,NATO Inc.,100,3.6,45,128852,0.0077,Inner,1,
6,Europa,Mac,NATO Inc.,1000,4800000,3122,671034,0.0094,Galilean,1,
10,Leda,Cheryl,NATO Inc.,10,0.6,16,11187781,0.1673,Himalia,1,
17,Carpo,Cheryl,NATO Inc.,10,0.0045,3,17144873,0.2735,Carpo,1,
20,Euporie,Joyce,NATO Inc.,10,0.0015,2,19088434,0.096,Ananke,-1,
23,Pherousa,Darwin,NATO Inc.,10,0.0015,1,20307150,0.307,Ananke,-1,
25,Euanthe,Mitch,NATO Inc.,10,0.0045,3,20464854,0.2,Ananke,-1,
27,Orthosie,Mayia,NATO Inc.,10,0.0015,2,20567971,0.2433,Ananke,-1,
49,not-Carme,NPC NATO,NATO Inc.,10,0.0015,2,22730813,0.3438,Carme,-1,
53,Kallichore,Caug,NATO Inc.,10,0.0015,2,23111823,0.2041,Carme,-1,
61,Pasithee,NPC NATO,NATO Inc.,10,0.0015,2,23307318,0.3288,Carme,-1,
75,Sinope,Caug,NATO Inc.,100,7.5,38,24057865,0.275,Pasiphae,-1,
26,Helike,Anthony,Penguins,10,0.009,4,20540266,0.1374,Ananke,-1,
72,Isonoe,Eraser,SMS,10,0.0075,4,23800647,0.1775,Carme,-1,
"""

class MoonClass
    constructor: (@id, @name, @player, @faction, @income, @mass, @diameter, @semimajor, @ecc, @sign) ->
        # Derived from
        # https://www.wikiwand.com/en/Kepler%27s_laws_of_planetary_motion
        @period = TIME_CONSTANT * @semimajor ** 1.5
        @semiminor = @semimajor * Math.sqrt(1 - @ecc ** 2)
        @positions = @calculate_trajectory()

    get_position_at_time: (t) ->
        """ Return the position of the moon at time t """
        # Convert time to index
        i = (t - Config["T0"]) / Config["DT"]

        # Interpolate between the indices we have
        i0 = Math.floor(i)
        i1 = Math.ceil(i)

        if i0 >= @positions.length
            i0 = @positions.length - 1
        if i1 >= @positions.length
            i1 = @positions.length - 1
        s = i - i0

        p0 = @positions[i0]
        p0x = p0[0]
        p0y = p0[1]

        p1 = @positions[i1]
        p1x = p1[0]
        p1y = p1[1]

        px = p1x * s + p0x * (1 - s)
        py = p1y * s + p0y * (1 - s)

        return [px, py]

    calculate_position_at_time: (t) ->
        """ Return the position of the moon at time t """
        t += TIME_OFFSET  # Compensate for start time

        n = TWO_PI / @period  # mean motion
        M = n * t  # mean anomaly

        f = (x) =>
            return (x - @ecc * Math.sin(x) - M)

        newton_step = (x) =>
            return (x - @ecc * Math.sin(x) - M) / (2 * (1 - @ecc * Math.cos(x)))

        E = 0
        x = M
        ITER_MAX = 10
        for i in [0...ITER_MAX]
            x_new = x - newton_step(x)
            E = x_new
            if f(x) < 0.001  # desired accuracy achieved
                break
            x = x_new
            if i == ITER_MAX - 1
                console.log("Hit max iterations -- orbit may be slightly off course")

        theta = 2 * Math.atan(Math.sqrt(((1 + @ecc) / (1 - @ecc)) * Math.tan(E / 2) ** 2))

        if E % TWO_PI > PI
            theta = TWO_PI - theta

        r = @semimajor * (1 - @ecc * Math.cos(E))

        theta *= @sign  # Compensate for direction

        x = r * Math.cos(theta)
        y = r * Math.sin(theta)
        return [x, y]

    calculate_trajectory: () =>
        poss = []
        t = Config["T0"]
        while t <= Config["T1"]
            pos = @calculate_position_at_time(t)
            poss.push(pos)
            t += Config["DT"]
        return poss

    faction_color: () ->
        d = {
            "BAIdu": "red",
            "NATO Inc.": "blue",
            "God™": "green",
            "Daytime": "yellow",
            "Contested": "orange",
            "Muses": "brown"
        }
        console.log(d[@faction])

        if d[@faction]? then d[@faction] else "lightgray"

parse_moons = () ->
    parse_moon = (row) ->
        items = row.split(",")

        id_ = parseInt(items[0], 10)
        name = items[1]
        player = items[2]
        faction = items[3]
        income = parseInt(items[4], 10)
        mass = parseFloat(items[5])
        diameter = parseFloat(items[6])
        semimajor = parseFloat(items[7])
        ecc = parseFloat(items[8])
        sign = parseInt(items[10], 10)

        moon = new MoonClass(id_, name, player, faction, income, mass, diameter, semimajor, ecc, sign)
        return moon

    rows = MOON_DATA.split("\n")
    moons = (parse_moon(row) for row in rows)
    return moons


module.exports = {
    parse_moons: parse_moons
}
