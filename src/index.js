import {Config} from 'aurelia-view-manager';

// added for bundling
import {DataTable} from './datatable'; // eslint-disable-line no-unused-vars
import {ColumnsFilterValueConverter} from './columns-filter'; // eslint-disable-line no-unused-vars
import {ConvertManagerValueConverter} from './convert-manager'; // eslint-disable-line no-unused-vars

export {DataTable} from './datatable';

export function configure(aurelia) {
  aurelia.plugin('aurelia-pager');

  aurelia.container.get(Config).configureNamespace('spoonx/datatable', {
    location: './{{framework}}/{{view}}.html'
  });

  aurelia.globalResources('./datatable');
}
