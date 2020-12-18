import json
import math
import scipy
import numpy as np
import scipy.integrate
from pathlib import Path

#  universal gravitation constant
G = 6.67408e-11  # N-m2/kg2

# Reference quantities
m_nd = 1.989e+30  # kg #mass of the sun
r_nd = 5.326e+12  # m #distance between stars in Alpha Centauri
v_nd = 30000  # m/s #relative velocity of earth around the sun
t_nd = 79.91*365*24*3600*0.51  # s #orbital period of Alpha Centauri

# Net constants
K1 = G*t_nd*m_nd/(r_nd**2*v_nd)
K2 = v_nd*t_nd/r_nd

# Define masses
m1 = 1
m2 = 1
m3 = 1
m4 = 0.000001

# Initial positions
r1 = np.array([-2, 0, 0], dtype="float64")
r2 = np.array([2, 0, 0], dtype="float64")
r3 = np.array([0, math.sqrt(3), 0], dtype="float64")
r4 = np.array([0, 1, 0], dtype="float64")

# Initial velocities
v1 = np.array([0.01, 0.01, 0], dtype="float64")
v2 = np.array([-0.01, 0, 0], dtype="float64")
v3 = np.array([0.01, -0.01, 0], dtype="float64")
v4 = np.array([0, 0, 0], dtype="float64")


def four_body_equations(w, t, G, m1, m2, m3, m4):
    r2 = w[3:6]
    r1 = w[:3]
    r3 = w[6:9]
    r4 = w[9:12]
    v1 = w[12:15]
    v2 = w[15:18]
    v3 = w[18:21]
    v4 = w[21:24]
    
    r12 = np.linalg.norm(r2-r1)
    r13 = np.linalg.norm(r3-r1)
    r14 = np.linalg.norm(r4-r1)
    r23 = np.linalg.norm(r3-r2)
    r24 = np.linalg.norm(r4-r2)
    r34 = np.linalg.norm(r4-r3)
    
    dv1bydt = K1*m2*(r2-r1)/r12**3+K1*m3*(r3-r1)/r13**3+K1*m4*(r4-r1)/r14**3
    dv2bydt = K1*m1*(r1-r2)/r12**3+K1*m3*(r3-r2)/r23**3+K1*m4*(r4-r2)/r24**3
    dv3bydt = K1*m1*(r1-r3)/r13**3+K1*m2*(r2-r3)/r23**3+K1*m4*(r4-r3)/r34**3
    dv4bydt = K1*m1*(r1-r4)/r14**3+K1*m2*(r2-r4)/r24**3+K1*m3*(r3-r4)/r34**3

    dr1bydt = K2*v1
    dr2bydt = K2*v2
    dr3bydt = K2*v3
    dr4bydt = K2*v4
    
    r_derivs = np.concatenate((dr1bydt, dr2bydt, dr3bydt, dr4bydt))
    v_derivs = np.concatenate((dv1bydt, dv2bydt, dv3bydt, dv4bydt))
    derivs = np.concatenate((r_derivs, v_derivs))
    return derivs


init_params = np.array([r1, r2, r3, r4, v1, v2, v3, v4]).flatten()

# 1600 orbital periods, 32000 data points
time_span = np.linspace(0, 1600, 32000)
solutions = scipy.integrate.odeint(four_body_equations, init_params, time_span, args=(G, m1, m2, m3, m4))

d = {}
for i in range(solutions.shape[0]):
    d[i] = {
        "p1": {
            "x": solutions[i, 0],
            "y": solutions[i, 1],
            "z": solutions[i, 2],
        },
        "p2": {
            "x": solutions[i, 3],
            "y": solutions[i, 4],
            "z": solutions[i, 5],
        },
        "p3": {
            "x": solutions[i, 6],
            "y": solutions[i, 7],
            "z": solutions[i, 8],
        },
        "p4": {
            "x": solutions[i, 9],
            "y": solutions[i, 10],
            "z": solutions[i, 11],
        },
    }

path_to_file = Path() / 'positions.json'
with open(path_to_file, 'w') as fp:
    json.dump(d, fp)
