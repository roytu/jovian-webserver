
current_time = 0
SCALE = 5e7
GLOBALX = 0
GLOBALY = 0

Moon = require("./moon.js")
Config = require("./config.js")

moons = Moon.parse_moons()

pos_to_percent = (x) ->
    # Get coord as percentage of scale
    percent = ((x / SCALE) + 1) * 50
    return percent

draw_grid = (svgDoc) ->
    # Draw grid
    svgDoc.selectAll("line")
        .remove()

    svgDoc.append("line")
        .attr("class", "grid-line-center")
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "#{50 + GLOBALY}%")
        .attr("y2", "#{50 + GLOBALY}%")

    svgDoc.append("line")
        .attr("class", "grid-line-center")
        .attr("x1", "#{50 + GLOBALX}%")
        .attr("x2", "#{50 + GLOBALX}%")
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
moonText = d3.select("body")
    .append("div")
      .style("font-family", "sans-serif")
      .style("font-size", "20px")
      .style("color", "white")
      .style("text-shadow", "1px 1px #111")
      .style("text-align", "left")
      .style("position", "absolute")
      .style("display", "block")
      .style("top", "10px")
      .style("left", "5%")

helpText = d3.select("body")
    .append("div")
      .style("font-family", "sans-serif")
      .style("font-size", "20px")
      .style("color", "white")
      .style("text-shadow", "1px 1px #111")
      .style("text-align", "right")
      .style("position", "absolute")
      .style("display", "block")
      .style("top", "10px")
      .style("right", "5%")
      .html("""
s - zoom in<br>
a - zoom out<br>
z - step backwards<br>
Z - step backwards fast<br>
x - step forwards<br>
X - step forwards fast<br>
Arrow Keys - move<br>
""")

timeText = d3.select("body")
    .append("div")
      .style("font-family", "sans-serif")
      .style("font-size", "20px")
      .style("color", "white")
      .style("text-shadow", "1px 1px #111")
      .style("text-align", "right")
      .style("position", "absolute")
      .style("display", "block")
      .style("top", "80%")
      .style("right", "5%")
      .style("width", "100%")
      .style("height", "100%")
      .html("t: 0 days")


init = () ->
    $(document).on('keydown', (e) ->
        if (e.key == "s")  # s = zoom in
            SCALE *= 0.95
            redraw()
        if (e.key == "a")  # a = zoom out
            SCALE /= 0.95
            redraw()
        if (e.key == "z")  # z = step backward
            current_time -= Config["DT"]
            if current_time < Config["T0"]
                current_time = Config["T0"]
            redraw()
        if (e.key == "Z")  # Z = step backward fast
            current_time -= Config["DT"] * 10
            if current_time < Config["T0"]
                current_time = Config["T0"]
            redraw()
        if (e.key == "x")  # z = step forward
            current_time += Config["DT"]
            if current_time > Config["T1"]
                current_time = Config["T1"]
            redraw()
        if (e.key == "X")  # Z = step forward fast
            current_time += Config["DT"] * 10
            if current_time > Config["T1"]
                current_time = Config["T1"]
            redraw()
        if (e.key == "ArrowLeft")  # Move
            GLOBALX += 5
            redraw()
        if (e.key == "ArrowRight")  # Move
            GLOBALX -= 5
            redraw()
        if (e.key == "ArrowUp")  # Move
            GLOBALY += 5
            redraw()
        if (e.key == "ArrowDown")  # Move
            GLOBALY -= 5
            redraw()


    )
    svgDoc.append("div")
          .text("Moon: ")

    redraw()

redraw = () ->
    # Draw grid
    draw_grid(svgDoc)

    # Draw path
    # Remove all old paths
    svgDoc.selectAll("ellipse").remove()

    paths = svgDoc.selectAll("ellipse")
                  .data(moons)

    paths.enter()
         .append("ellipse")
           .attr("cx", (m) -> "#{-m.semimajor * m.ecc/SCALE * 50 + 50 + GLOBALX}%")
           .attr("cy", "#{50 + GLOBALY}%")
           .attr("rx", (m) -> "#{m.semimajor/SCALE * 50}%")
           .attr("ry", (m) -> "#{m.semiminor/SCALE * 50}%")

    # Draw moons
    svgDoc.selectAll("circle").remove()

    s = svgDoc.selectAll("circle")
              .data(moons)

    s.enter()
     .append("circle")
       .attr("cx", (m) -> "#{pos_to_percent(m.get_position_at_time(current_time)[0]) + GLOBALX}%")
       .attr("cy", (m) -> "#{pos_to_percent(m.get_position_at_time(current_time)[1]) + GLOBALY}%")
       .attr("r", (m) -> 5)
       .attr("fill", (m) -> m.faction_color())
       .attr("stroke", "black")
       .on("mouseover", (m) ->
             html = m.name
             if (m.player != null)
                 html += "<br>owned by #{m.player} (#{m.faction})"
             moonText.html(html)
             moonText.style("color", m.faction_color())
       )


    # Update time
    timeText.html("t: #{current_time.toFixed(2)} days")

init()
