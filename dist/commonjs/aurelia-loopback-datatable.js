'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataTable = undefined;

var _datatable = require('./datatable');

Object.defineProperty(exports, 'DataTable', {
  enumerable: true,
  get: function get() {
    return _datatable.DataTable;
  }
});
exports.configure = configure;

var _aureliaViewManager = require('aurelia-view-manager');

var _columnsFilter = require('./columns-filter');

var _convertManager = require('./convert-manager');

function configure(aurelia) {
  aurelia.plugin('aurelia-pager');

  aurelia.container.get(_aureliaViewManager.Config).configureNamespace('spoonx/datatable', {
    location: './{{framework}}/{{view}}.html'
  });

  aurelia.globalResources('./datatable');
}