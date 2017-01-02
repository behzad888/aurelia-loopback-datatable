define(['exports', './datatable', 'aurelia-view-manager', './columns-filter', './convert-manager'], function (exports, _datatable, _aureliaViewManager, _columnsFilter, _convertManager) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DataTable = undefined;
  Object.defineProperty(exports, 'DataTable', {
    enumerable: true,
    get: function () {
      return _datatable.DataTable;
    }
  });
  exports.configure = configure;
  function configure(aurelia) {
    aurelia.plugin('aurelia-pager');

    aurelia.container.get(_aureliaViewManager.Config).configureNamespace('spoonx/datatable', {
      location: './{{framework}}/{{view}}.html'
    });

    aurelia.globalResources('./datatable');
  }
});