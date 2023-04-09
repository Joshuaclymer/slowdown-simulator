import matplotlib.pyplot as plt
import sys
import json

args = sys.stdin.readline()
input = json.loads(args)

maxYear = 2029

windowScale = (maxYear - input["years"][0])/(input["years"][-1] -
                                             input["years"][0])
numPoints = len(input["years"])
plt.semilogy(input["years"][0:int(windowScale*numPoints)],
             input["flops"][0:int(windowScale*numPoints)])
plt.semilogy(input["years"][0:int(windowScale*numPoints)],
             input["moratorium_flops"][0:int(windowScale*numPoints)])
plt.axvline(x=input["wakeup"], color='r', linestyle='--', label='Wakeup')
plt.axvline(x=input["sub_agi_year"], color='g',
            linestyle='--', label='Sub-AGI')
plt.axvline(x=input["agi_year"], color='b',
            linestyle='--', label='100% R&D automated')

plt.legend()

plt.show()
