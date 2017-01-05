import { inject } from 'aurelia-dependency-injection';
import { bindingMode, computedFrom } from 'aurelia-binding';
import { bindable, customElement } from 'aurelia-templating';
import { resolvedView } from 'aurelia-view-manager';
import { EntityManager } from 'aurelia-orm';
import { Router } from 'aurelia-router';
import { Homefront } from 'homefront';

@customElement('datatable')
@resolvedView('spoonx/datatable', 'datatable')
@inject(Router, Element, EntityManager)
export class DataTable {
  @bindable({ defaultBindingMode: bindingMode.twoWay })
  criteria = {};

  @bindable({ defaultBindingMode: bindingMode.twoWay })
  where = {};
  search = '';
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
  @bindable showInclude = false;
  @bindable include;
  @bindable mixed = [];
  @bindable pagesApi = '';

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
      this.initPager();
    }

    this.ready = true;
    this.criteria.where = this.where || {};
    this.criteria.sort = this.criteria.sort || {};
    this.criteria.filter = this.criteria.filter || {
      include: {
        relation: null,
        scope: { where: {} },
        skip: null,
        limit: null
      },
      scope: {},
      where: {}
    }

    this.load();
  }

  initPager() {
    let that = this;
    if (this.pagesApi != '') {
      this.entityManager.getRepository(this.pagesApi).find().then(res => {
        var filter = JSON.parse(that.pagesApi.substring(that.pagesApi.indexOf('=') + 1));
        var pageCount = 0;
        res.forEach(item => {
          pageCount += parseInt(item[filter.counts + 'Count']);
        })
        that.pages = Math.ceil(pageCount / that.limit);
        that.reloadPage();
      });
    } else {
      this.entityManager.getRepository(this.resource + "/count").find().then(res => {
        that.pages = Math.ceil(res.count / that.limit);
        that.reloadPage();
      });
    }
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

  clean(obj) {
    for (var propName in obj) {
      var value = obj[propName];
      if (value === "" || value === null) {
        delete obj[propName];
      } else if (Object.prototype.toString.call(value) === '[object Object]') {
        var hasProp = false;
        for (var prop in value) {
          if (value.hasOwnProperty(prop)) {
            hasProp = true;
          }
        }
        if (hasProp == true)
          this.clean(value);
        else
          delete obj[propName];
      } else if (Array.isArray(value)) {
        value.forEach(function (item) {
          this.clean(v);
        }, this);
      }
    }
  }

  load() {
    this.loading = true;
    if (this.showInclude == false) {
      this.criteria['filter']['skip'] = (this.page * this.limit) - this.limit;
      this.criteria['filter']['limit'] = this.limit;
    } else {
      if (!this.criteria.filter.include.scope)
        this.criteria.filter.include.scope = {};
      this.criteria['filter']['include']['scope']['skip'] = (this.page * this.limit) - this.limit;
      this.criteria['filter']['include']['scope']['limit'] = this.limit;
    }

    if (!this.populate) {
      this.criteria.populate = null;
    } else if (typeof this.populate === 'string') {
      this.criteria.populate = this.populate;
    } else if (Array.isArray(this.populate)) {
      this.criteria.populate = this.populate.join(',');
    }

    this.clean(this.criteria.filter);
    this.clean(this.criteria.filter);
    var filter = { "filter": JSON.stringify(this.criteria.filter) }

    this.repository.find(filter, true)
      .then(result => {
        this.loading = false;
        if (this.showInclude == false) {
          this.data = result;
        } else {
          var temp = [];
          result.forEach(item => {
            item[this.include].forEach(inner => {
              if (this.mixed.length != 0) {
                this.mixed.forEach(function (element) {
                  inner[element] = item[element];
                }, this);
              }
              temp.push(inner);
            })
          })
          this.data = temp;
        }
        this.pager.pages = this.pages;
        this.reloadPage()
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
    if (!action) {
      return false;
    }

    if (typeof action.action === 'function') {
      return action.action(row);
    }
  }

  checkDisabled(action, row) {
    if (!action) {
      return true;
    }

    if (typeof action.disabled === 'function') {
      return action.disabled(row);
    }

    return false;
  }

  checkVisibility(action, row) {
    if (!action) {
      return false;
    }

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

    this.criteria.sort = {
      [column]: this.criteria.sort[column] === 'asc' ? 'desc' : 'asc'
    };

    this.load();
  }

  searchColumnChanged(newValue, oldValue) {
    if (!this.ready) {
      return;
    }

    delete this.criteria.where[oldValue];

    return this.doSearch();
  }

  doSearch() {
    if (!this.ready) {
      return;
    }
    this.criteria.filter.where = {};
    if (!this.criteria.filter.include)
      this.criteria.filter.include = {};
    if (!this.criteria.filter.include.scope)
      this.criteria.filter.include.scope = {};
    this.criteria.filter.include.scope.where = {};
    if (this.showInclude != false) {
      if (typeof this.criteria.filter.include.scope.where[this.searchColumn] === 'object') {
        this.criteria.filter.include.scope.where[this.searchColumn].like = this.search;
      } else {
        this.criteria.filter.include.scope.where[this.searchColumn] = { like: this.search };
      }
    } else {

      if (typeof this.criteria.filter.where[this.searchColumn] === 'object') {
        this.criteria.filter.where[this.searchColumn].like = this.search;
      } else {
        this.criteria.filter.where[this.searchColumn] = { like: this.search };
      }
    }

    if (!this.ready) {
      return;
    }
    this.reloadPage();

    this.load();
  }

  reloadPage() {
    this.pager.resource = undefined;
    this.pager.reloadCount();
  }

  reload() {
    this.reloadPage(); // reload the amount of results

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