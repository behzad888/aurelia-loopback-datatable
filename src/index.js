import {Config} from 'aurelia-view-manager';

// added for bundling
import {DataTable} from './datatable'; // eslint-disable-line no-unused-vars
import {ColumnsFilterValueConverter} from './columns-filter'; // eslint-disable-line no-unused-vars
import {ConvertManagerValueConverter} from './convert-manager'; // eslint-disable-line no-unused-vars

export function configure(aurelia) {
  aurelia.plugin('aurelia-pager');

  aurelia.container.get(Config).configureNamespace('loopback/datatable', {
    location: './{{framework}}/{{view}}.html'
  });

  aurelia.globalResources('./datatable');
}
