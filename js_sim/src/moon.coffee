
Config = require("./config.js")

#TIME_CONSTANT = 6.378011090644188e-09
TIME_CONSTANT = 6.461374608e-9  # Correcter value (thanks Szilard)
#TIME_OFFSET = 27570
PI = 3.141592653589
TWO_PI = 2 * PI

class MoonClass
    @data: ""
    constructor: (@id, @name, @player, @faction, @income, @mass, @diameter, @semimajor, @ecc, @sign) ->
        # Derived from
        # https://www.wikiwand.com/en/Kepler%27s_laws_of_planetary_motion
        @period = TIME_CONSTANT * @semimajor ** 1.5
        @semiminor = @semimajor * Math.sqrt(1 - @ecc ** 2)
        @positions = @calculate_trajectory()

    get_position_at_time: (t) ->
        """ Return the position of the moon at time t """
        # Mod since we only save one period of positions
        t = ((t % @period) + @period) % @period  # Disgusting trick to modulo negative numbers
                                                 # Stolen from https://dev.to/maurobringolf/a-neat-trick-to-compute-modulo-of-negative-numbers-111e

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
        """ Return the position of the moon at time t (since alignment) """
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
        while t <= Config["T1"] and t < Config["T0"] + @period
            pos = @calculate_position_at_time(t % @period)
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

        if d[@faction]? then d[@faction] else "lightgray"

readyPromise = new Promise((resolve, reject) =>
    $.ajax({
        url: "moons.csv"
        success: (data) =>
            MoonClass.data = data
            resolve("CSV downloaded")
        dataType: "text"
    })
)

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

    rows = MoonClass.data.split("\n")[1..]
    moons = (parse_moon(row) for row in rows)
    return moons

module.exports = {
    parse_moons: parse_moons
    readyPromise: readyPromise
}
