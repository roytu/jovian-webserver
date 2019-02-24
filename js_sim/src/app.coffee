
SCALE = 5e7

Moon = require("./moon.js")
Config = require("./config.js")

moons = Moon.parse_moons()

pos_to_percent = (x) ->
    # Get coord as percentage of scale
    percent = ((x / SCALE) + 1) * 50

    return percent + "%"

draw_grid = (svgDoc) ->
    # Draw grid
    svgDoc.append("line")
        .attr("class", "grid-line-center")
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "50%")
        .attr("y2", "50%")

    svgDoc.append("line")
        .attr("class", "grid-line-center")
        .attr("x1", "50%")
        .attr("x2", "50%")
        .attr("y1", "0%")
        .attr("y2", "100%")

    for y in [0...20]
        svgDoc.append("line")
            .attr("class", "grid-line")
            .attr("x1", "0%")
            .attr("x2", "100%")
            .attr("y1", y * 5 + "%")
            .attr("y2", y * 5 + "%")

    for x in [0...20]
        svgDoc.append("line")
            .attr("class", "grid-line")
            .attr("x1", x * 5 + "%")
            .attr("x2", x * 5 + "%")
            .attr("y1", "0%")
            .attr("y2", "100%")

# Initialize SVG
svgDoc = d3.select("body").append("svg")

init = () ->
    $(document).on('keydown', (e) ->
        if (String.fromCharCode(e.which) == "Z")  # +
            SCALE *= 0.95
            redraw()
        if (String.fromCharCode(e.which) == "X")  # -
            SCALE /= 0.95
            redraw()
    )
    # Draw grid
    draw_grid(svgDoc)

    svgDoc.append("div")
          .text("Moon: ")

    redraw()

redraw = () ->
    # Draw path
    # Remove all old paths
    svgDoc.selectAll("ellipse").remove()

    paths = svgDoc.selectAll("ellipse")
                  .data(moons)

    paths.enter()
         .append("ellipse")
           .attr("cx", (m) -> "#{-m.semimajor * m.ecc/SCALE * 50 + 50}%")
           .attr("cy", "50%")
           .attr("rx", (m) -> "#{m.semimajor/SCALE * 50}%")
           .attr("ry", (m) -> "#{m.semiminor/SCALE * 50}%")

    # Draw moons
    svgDoc.selectAll("circle").remove()

    s = svgDoc.selectAll("circle")
        .data(moons)

    s.exit().remove()

    s.enter()
     .append("circle")
       .attr("r", (m) -> 2)
       .attr("fill", (m) -> m.faction_color())
       .transition()
       .ease("constant")
       .duration(100000)
       .attrTween("cx", (m) -> (t) -> pos_to_percent(m.get_position_at_time(t * (Config["T1"] - Config["T0"]) + Config["T0"])[0]))
       .attrTween("cy", (m) -> (t) -> pos_to_percent(m.get_position_at_time(t * (Config["T1"] - Config["T0"]) + Config["T0"])[1]))

init()
