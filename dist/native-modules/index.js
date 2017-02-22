'use strict';

exports.__esModule = true;

var _aureliaLoopbackDatatable = require('./aurelia-loopback-datatable');

Object.keys(_aureliaLoopbackDatatable).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _aureliaLoopbackDatatable[key];
    }
  });
});