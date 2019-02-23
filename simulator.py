import numpy as np
import scipy as sp
from scipy.optimize import minimize
import matplotlib.pyplot as plt
from matplotlib import animation
import time

TIME_CONSTANT = 6.378011090644188e-09
TIME_OFFSET = 27570
TWO_PI = 2 * np.pi

class Moon(object):
    def __init__(self):
        self.id_ = None
        self.name = None
        self.player = None
        self.faction = None
        self.income = None
        self.mass = None  # in 1e16 kg
        self.diameter = None # in km
        self.semimajor = None # in km
        self.ecc = None
        self.sign = None

        # Calculate the following
        self.period = None
        self.semiminor = None # in km

    def derive_quantities(self):
        # https://www.wikiwand.com/en/Kepler%27s_laws_of_planetary_motion
        self.period = TIME_CONSTANT * self.semimajor ** 1.5
        self.semiminor = self.semimajor * np.sqrt(1 - self.ecc ** 2)

    def position_at_time(self, t):
        """ Return the position of the moon at time t """
        t += TIME_OFFSET  # Compensate for start time

        n = 2 * np.pi / self.period  # mean motion
        M = n * t  # mean anomaly

        def kepler_root_fn(E_):
            return (E_ - self.ecc * np.sin(E_) - M) ** 2
        result = minimize(kepler_root_fn, 0)
        if not result.success:
            raise Exception("ERROR")
        E = result.x[0]

        theta = 2 * np.arctan(np.sqrt(((1 + self.ecc) / (1 - self.ecc)) * np.tan(E / 2) ** 2))

        if E % (2 * np.pi) > np.pi:
            theta = 2 * np.pi - theta

        #theta = np.arccos((np.cos(E) - self.ecc) / (1 - self.ecc * np.cos(E)))
        r = self.semimajor * (1 - self.ecc * np.cos(E))

        theta *= self.sign  # Compensate for direction

        x = r * np.cos(theta)
        y = r * np.sin(theta)
        return (x, y)

def csv_to_moons(filename="moons.csv"):
    with open(filename, "r") as f:
        lines = f.readlines()[1:]

    moons = []
    for line in lines:
        s = line.split(",")
        moon = Moon()
        moon.id_ = int(s[0])
        moon.name = s[1]
        moon.player = s[2]
        moon.faction = s[3]
        moon.income = int(s[4])
        moon.mass = float(s[5])
        moon.diameter = float(s[6])
        moon.semimajor = float(s[7])
        moon.ecc = float(s[8])
        moon.sign = int(s[10])
        moon.derive_quantities()
        #if moon.name != "Chaldene":
        #    continue

        moons.append(moon)
    return moons

def main():
    print(1)
    moons = csv_to_moons()
    print(2)
    fig, ax = plt.subplots()
    SCALE = 5e7
    print(3)
    line = ax.scatter([], [], marker=".", color='red')
    text = ax.text(0.05, 0.95, "t:", transform=ax.transAxes, fontsize=8,
                        family="monospace", verticalalignment='top')
    print(4)
    def init():
        line.set_offsets(np.array([]))
        text.set_text("")
        return (line,text)
    
    def animate(t):
        # t is in Earth days
        xs = []
        ys = []
        cs = []

        t *= 1  # Day interval

        for moon in moons:
            (x, y) = moon.position_at_time(t)
            xs.append(x)
            ys.append(y)
            cs.append("red" if moon.name != "Chaldene" else "blue")
    
        xs = np.array(xs)
        ys = np.array(ys)

        O = np.hstack((xs[:,np.newaxis], ys[:, np.newaxis]))
    
        line.set_offsets(O)
        line.set_color(cs)
        text.set_text("t: {} days".format(t))
        time.sleep(0.1)
        print('sup')
        return (line, text)
    print(5)
    ax.set_xlim(-SCALE, SCALE)
    ax.set_ylim(-SCALE, SCALE)
    plt.axhline(0, color='black', alpha=0.5, linestyle="--")
    plt.axvline(0, color='black', alpha=0.5, linestyle="--")
    print(6)
    anim = animation.FuncAnimation(fig, animate, init_func=init,
                               frames=300, interval=1, blit=True)
    # anim.save('timeline.html', dpi=80, writer='imagemagick')
    print(7)
    plt.show()
    print(8)

if __name__ == "__main__":
    main()
