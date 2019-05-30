# Obesity Cellular Automata (Basic)

## Introduction

This is a basic SIR Cellular Automata representation of obesity epidemy. "S" stands for "Susceptible", "I" stands for "Infected" and "R" stands for "Recovered" or "Removed", in case of obesity, we will ignore the Recovered part of the model because nobody is immune to obesity, so a person that had obesity before can become obese again.

## Rules

Healthy cell:
- Becomes obese with more than 4 obese neighbors.

Obese cell:
- Becomes healthy with less than 3 obese neighbors, because it is more difficult to an obese person to become healthy again.

The "Random" button will turn obese 15% of the cells, that is approximately the world ratio of obese adults.

## How to Run

First, install [nodejs](https://nodejs.org/en/), in order to execute react-scripts. Since nodejs comes with **node package manager** (npm), you can simply run `npm install` then `npm start` at the project root.

A webpage will show in the browser.
Click the board to setup the initial state, or use Random button to randomize the board.
Then click "Run" button to see the iterations.

