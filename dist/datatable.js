import { inject } from 'aurelia-dependency-injection';
import { bindingMode, computedFrom } from 'aurelia-binding';
import { bindable, customElement } from 'aurelia-templating';
import { resolvedView } from 'aurelia-view-manager';
import { EntityManager } from 'aurelia-orm';
import { Router } from 'aurelia-router';
import { Homefront } from 'homefront';

@customElement('datatable')
@resolvedView('loopback/datatable', 'datatable')
@inject(Router, Element, EntityManager)
export class DataTable {
  @bindable({ defaultBindingMode: bindingMode.twoWay })
  criteria = {};

  @bindable({ defaultBindingMode: bindingMode.twoWay })
  where = {};

  @bindable limit = 30;
  @bindable columns = '';
  @bindable searchColumn = 'name';
  @bindable actions = [];
  @bindable searchable = null;  // Show the search field? (Optional attribute).
  @bindable sortable = null;  // Columns can be sorted? (Optional attribute).
  @bindable edit = null;  // Rows are editable? (Optional attribute).
  @bindable destroy = null;  // Rows are removable? (Optional attribute).
  @bindable page = 1;     // Current page.
  @bindable loadingIndicator = '<center>Loading...</center>';
  @bindable populate = false; // Which columns to populate. True for all, string for specific.
  @bindable select;                   // User provided callback, called upon clicking on a row.
  @bindable repository;
  @bindable resource;
  @bindable data;
  @bindable route;
  @bindable pages;
  @bindable footer;
  @bindable searchcaption = 'where';
  @bindable include = '';
  @bindable showInclude = false;
  @bindable filterWhere = [];

  loading = false;
  hasVisibleActions = false;

  constructor(router, element, entityManager) {
    this.router = router;
    this.element = element;
    this.entityManager = entityManager;
  }

  attached() {
    let that = this;
    if (!this.repository && this.resource) {
      this.repository = this.entityManager.getRepository(this.resource);
      if (this.showInclude != false) {
        var include = this.include != '' ? '?include[include]=' + this.include : '';
        this.entityManager.getRepository(this.resource + "/count" + include).find().then(res => {
          that.pages = Math.ceil(res.count / that.limit);
          that.pager.reloadCount();
        });
      }
    }

    this.ready = true;
    this.criteria[this.searchcaption] = this.where || {};

    this.criteria.sort = this.criteria.sort || {};

    this.load();
  }

  detached() {
    this.ready = false;
  }

  pageChanged() {
    if (!this.ready) {
      return;
    }

    this.load();
  }

  limitChanged() {
    if (!this.ready) {
      return;
    }

    this.load();
  }

  load() {
    this.loading = true;
    if (!this.pager.criteria)
      this.pager.criteria = {};
    this.criteria.skip = (this.page * this.limit) - this.limit;
    this.criteria.limit = this.limit;

    this.pager.limit = this.limit;

    //add limit and skip to include
    this.criteria[this.searchcaption]["limit"] = this.limit;
    this.criteria[this.searchcaption]["skip"] = this.criteria.skip;
    if (this.include != '') {
      this.criteria[this.searchcaption]["include"] = this.include
    }
    if (this.searchcaption == 'where') {
      this.criteria['filter']['limit'] = this.limit;
      this.criteria['filter']['skip'] = this.criteria.skip;
      this.pager.criteria['where'] = this.criteria['filter']['where'];
    }

    this.pager.criteria['limit'] = this.pager.limit;
    this.pager.criteria['skip'] = this.criteria.skip;
    this.pagerCriteria = this.pager.criteria;

    if (this.filterWhere.length != 0) {
      this.filterWhere.forEach(item => {
        this.criteria[this.searchcaption][item.key] = item.value;
        if (item.key === 'where')
          this.pager.criteria[item.key] = item.value;
      });

    }
    if (!this.populate) {
      this.criteria.populate = null;
    } else if (typeof this.populate === 'string') {
      this.criteria.populate = this.populate;
    } else if (Array.isArray(this.populate)) {
      this.criteria.populate = this.populate.join(',');
    }

    this.repository.find(this.criteria, true)
      .then(result => {
        this.loading = false;
        if (this.showInclude == false) {
          this.data = result;
        } else {
          var temp = [];
          result.forEach(item => {
            item[this.include].forEach(inner => {
              temp.push(inner);
            })
          })
          this.data = temp;
        }
        this.pager.reloadCount();
      })
      .catch(error => {
        this.loading = false;
        this.triggerEvent('exception', { on: 'load', error: error });
      });
  }

  gatherData(criteria = {}) {
    return this.repository.find(criteria, true).catch(error => {
      this.triggerEvent('exception', { on: 'load', error: error });
    });
  }

  populateEntity(row) {
    return this.repository.getPopulatedEntity(row);
  }

  doDestroy(row) {
    if (typeof this.destroy === 'function') {
      return this.destroy(row);
    }

    this.populateEntity(row).destroy()
      .then(() => {
        this.load();
        this.triggerEvent('destroyed', row);
      })
      .catch(error => {
        this.triggerEvent('exception', { on: 'destroy', error: error });
      });
  }

  doEdit(row) {
    if (typeof this.edit === 'function') {
      return this.edit(row);
    }
  }

  doCustomAction(action, row) {
    if (typeof action.action === 'function') {
      return action.action(row);
    }
  }

  checkDisabled(action, row) {
    if (typeof action.disabled === 'function') {
      return action.disabled(row);
    }

    return false;
  }

  checkVisibility(action, row) {
    if (typeof action.visible !== 'function') {
      this.hasVisibleActions = true;

      return true;
    }

    let isVisible = action.visible(row);

    if (isVisible) {
      this.hasVisibleActions = true;
    }

    return isVisible;
  }

  showActions() {
    return this.destroy !== null || this.edit !== null || this.actions.length > 0;
  }

  doSort(columnLabel) {
    let column = columnLabel.column;

    if (this.sortable === null || !this.isSortable(column)) {
      return;
    }

    // this.criteria.sort = {
    //   [column]: this.criteria.sort[column] === 'ASC' ? 'DESC' : 'ASC'
    // };
    // add order to filter 
    //this.criteria[this.searchcaption]["order"] = [column] + " " + (this.criteria.sort[column] === 'asc' ? 'desc' : 'asc');
    this.criteria.sort = {
      [column]: this.criteria.sort[column] === 'asc' ? 'desc' : 'asc'
    };
    this.criteria['filter'] = this.criteria['filter'] == undefined ? {} : this.criteria['filter']
    this.criteria['filter']["order"] = column + " " + (this.criteria.sort[column].toLowerCase() === 'ASC'.toLocaleLowerCase() ? 'DESC' : 'ASC');
    this.load();
  }

  searchColumnChanged(newValue, oldValue) {
    if (!this.ready) {
      return;
    }

    delete this.criteria[this.searchcaption][oldValue];

    return this.doSearch();
  }

  doSearch() {
    if (!this.ready) {
      return;
    }
    if (this.search !== undefined) {

      if (this.search.trim() == "")
        this.criteria[this.searchcaption]['where'] = undefined;
      else if (typeof this.criteria[this.searchcaption][this.searchColumn] === 'object') {
        this.criteria[this.searchcaption][this.searchColumn].contains = this.search;
        this.criteria[this.searchcaption]['where'] = { [this.searchColumn]: { "like": this.search, options: 'i' } };
      } else {
        this.criteria[this.searchcaption][this.searchColumn] = { contains: this.search };
        this.criteria[this.searchcaption]['where'] = { [this.searchColumn]: { "like": this.search, options: 'i' } };
      }

      if (this.searchcaption == 'where')
        this.criteria['filter']['where'][this.searchColumn] = { "like": this.search, options: 'i' };

    }

    this.pager.reloadCount();

    this.load();
  }

  reload() {
    this.pager.reloadCount(); // reload the amount of results

    if (this.page === 1) {
      this.load(); // this.pageChanged() won't trigger if the current page is already page 1.
    }

    this.page = 1;
  }

  @computedFrom('columns')
  get columnLabels() {
    function clean(str) {
      return str.replace(/^'?\s*|\s*'$/g, '');
    }

    function ucfirst(str) {
      return str[0].toUpperCase() + str.substr(1);
    }

    if (Array.isArray(this.columns)) {
      return this.columns.map(column => {
        return {
          nested: !this.isSortable(column.property),
          column: column.property,
          label: ucfirst(clean(column.label || column.property)),
          route: column.route || false,
          converter: column.valueConverters || false
        };
      });
    }

    let labelsRaw = this.columns.split(',');
    let columnsArray = [];
    let labels = [];

    labelsRaw.forEach(label => {
      if (!label) {
        return;
      }

      let converter = label.split(' | ');
      let aliased = converter[0].split(' as ');
      let cleanedColumn = clean(aliased[0]);

      if (columnsArray.indexOf(cleanedColumn) === -1) {
        columnsArray.push(cleanedColumn);
      }

      labels.push({
        nested: !this.isSortable(cleanedColumn),
        column: cleanedColumn,
        label: ucfirst(clean(aliased[1] || aliased[0])),
        converter: (converter.length > 1) ? converter.slice(1).join(' | ') : false
      });
    });

    return labels;
  }

  triggerEvent(event, payload = {}) {
    payload.bubbles = true;

    return this.element.dispatchEvent(new CustomEvent(event, payload));
  }

  selected(row, columnOptions) {
    if (columnOptions.route) {
      let params = {};

      if (columnOptions.route.params) {
        Object.keys(columnOptions.route.params).forEach(param => {
          let property = columnOptions.route.params[param];

          params[param] = this.displayValue(row, property);
        });
      }

      return this.router.navigateToRoute(columnOptions.route.name, params);
    }

    if (this.route) {
      return this.router.navigateToRoute(this.route, { id: row.id });
    }

    if (this.select) {
      return this.select(row);
    }
  }

  isSortable(column) {
    if (column.indexOf('.') > 0) {
      return false;
    }

    if (!this.populate) {
      return true;
    }

    if (typeof this.populate !== 'string') {
      return this.populate.indexOf(column) === -1;
    }

    return this.populate
      .replace(' ', '')
      .split(',')
      .indexOf(column) === -1;
  }

  displayValue(row, propertyName) {
    return new Homefront(row, Homefront.MODE_NESTED).fetch(propertyName);
  }
}
