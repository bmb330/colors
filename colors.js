"use strict";

const sass = require('node-sass');
const toHex = require('colornames');
const cssjson = require('cssjson');
const hexRgb = require('hex-rgb');

const hexReg = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;
const rgbReg = /^rgb\(((\d{1,3},)){2}\d{1,3}\)/i;

const sassToCss = (color) => {
  return sass.renderSync({
    data: `
      .lighter { color: lighten(${color}, 20%); }
      .light { color: lighten(${color}, 10%); }
      .dark { color: darken(${color}, 10%); }
      .darker {color: darken(${color}, 20%); }
    `
  }).css.toString();
};

const cssToJson = (css) => cssjson.toJSON(css);

const extractColors = (json) => {
  let elems = [];

  for (let elem in json.children) {
    let color = json.children[elem].attributes.color;

    color = isHex(color) ? color : toHex(color);
    elems.push(color);
  }

  return elems;
};

const formatRgb = (color) => `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

const isHex = (color) => hexReg.test(color);

const isRgb = (color) => rgbReg.test(color);

const parseHex = (color) => extractColors(cssToJson(sassToCss(color)));

const parseRgb = (color) => parseHex(color).map(hex => formatRgb(hexRgb(hex)));

module.exports = {
  parseColor (color) {
    if (isHex(color)) {
      return parseHex(color);
    }
    else if (isRgb(color)) {
      return parseRgb(color);
    }
    else {
      return {error: 'Invalid color code'};
    }
  }
};
