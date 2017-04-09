'use strict';

System.register(['aurelia-dependency-injection', 'aurelia-binding', 'aurelia-templating', 'aurelia-view-manager', 'aurelia-orm', 'aurelia-router', 'homefront'], function (_export, _context) {
  "use strict";

  var inject, bindingMode, computedFrom, bindable, customElement, resolvedView, EntityManager, Router, Homefront, _typeof, _createClass, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, DataTable;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  return {
    setters: [function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_aureliaBinding) {
      bindingMode = _aureliaBinding.bindingMode;
      computedFrom = _aureliaBinding.computedFrom;
    }, function (_aureliaTemplating) {
      bindable = _aureliaTemplating.bindable;
      customElement = _aureliaTemplating.customElement;
    }, function (_aureliaViewManager) {
      resolvedView = _aureliaViewManager.resolvedView;
    }, function (_aureliaOrm) {
      EntityManager = _aureliaOrm.EntityManager;
    }, function (_aureliaRouter) {
      Router = _aureliaRouter.Router;
    }, function (_homefront) {
      Homefront = _homefront.Homefront;
    }],
    execute: function () {
      _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };

      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('DataTable', DataTable = (_dec = customElement('datatable'), _dec2 = resolvedView('loopback/datatable', 'datatable'), _dec3 = inject(Router, Element, EntityManager), _dec4 = bindable({ defaultBindingMode: bindingMode.twoWay }), _dec5 = bindable({ defaultBindingMode: bindingMode.twoWay }), _dec6 = computedFrom('columns'), _dec(_class = _dec2(_class = _dec3(_class = (_class2 = function () {
        function DataTable(router, element, entityManager) {
          

          _initDefineProp(this, 'criteria', _descriptor, this);

          _initDefineProp(this, 'where', _descriptor2, this);

          _initDefineProp(this, 'limit', _descriptor3, this);

          _initDefineProp(this, 'columns', _descriptor4, this);

          _initDefineProp(this, 'searchColumn', _descriptor5, this);

          _initDefineProp(this, 'actions', _descriptor6, this);

          _initDefineProp(this, 'searchable', _descriptor7, this);

          _initDefineProp(this, 'sortable', _descriptor8, this);

          _initDefineProp(this, 'edit', _descriptor9, this);

          _initDefineProp(this, 'destroy', _descriptor10, this);

          _initDefineProp(this, 'page', _descriptor11, this);

          _initDefineProp(this, 'loadingIndicator', _descriptor12, this);

          _initDefineProp(this, 'populate', _descriptor13, this);

          _initDefineProp(this, 'select', _descriptor14, this);

          _initDefineProp(this, 'repository', _descriptor15, this);

          _initDefineProp(this, 'resource', _descriptor16, this);

          _initDefineProp(this, 'data', _descriptor17, this);

          _initDefineProp(this, 'route', _descriptor18, this);

          _initDefineProp(this, 'pages', _descriptor19, this);

          _initDefineProp(this, 'footer', _descriptor20, this);

          _initDefineProp(this, 'searchcaption', _descriptor21, this);

          _initDefineProp(this, 'include', _descriptor22, this);

          _initDefineProp(this, 'showInclude', _descriptor23, this);

          _initDefineProp(this, 'filterWhere', _descriptor24, this);

          this.loading = false;
          this.hasVisibleActions = false;

          this.router = router;
          this.element = element;
          this.entityManager = entityManager;
        }

        DataTable.prototype.attached = function attached() {
          var that = this;
          if (!this.repository && this.resource) {
            this.repository = this.entityManager.getRepository(this.resource);
            var include = this.include != '' ? '?include[include]=' + this.include : '';
            this.entityManager.getRepository(this.resource + "/count" + include).find().then(function (res) {
              that.pages = Math.ceil(res.count / that.limit);
              that.pager.reloadCount();
            });
          }

          this.ready = true;
          this.criteria[this.searchcaption] = this.where || {};

          this.criteria.sort = this.criteria.sort || {};

          this.load();
        };

        DataTable.prototype.detached = function detached() {
          this.ready = false;
        };

        DataTable.prototype.pageChanged = function pageChanged() {
          if (!this.ready) {
            return;
          }

          this.load();
        };

        DataTable.prototype.limitChanged = function limitChanged() {
          if (!this.ready) {
            return;
          }

          this.load();
        };

        DataTable.prototype.load = function load() {
          var _this = this;

          this.loading = true;

          this.criteria.skip = this.page * this.limit - this.limit;
          this.criteria.limit = this.limit;

          this.pager.limit = this.limit;

          this.criteria[this.searchcaption]["limit"] = this.limit;
          this.criteria[this.searchcaption]["skip"] = this.criteria.skip;
          if (this.include != '') {
            this.criteria[this.searchcaption]["include"] = this.include;
          }
          if (this.filterWhere.length != 0) {
            this.filterWhere.forEach(function (item) {
              _this.criteria[_this.searchcaption][item.key] = item.value;
            });
          }
          if (!this.populate) {
            this.criteria.populate = null;
          } else if (typeof this.populate === 'string') {
            this.criteria.populate = this.populate;
          } else if (Array.isArray(this.populate)) {
            this.criteria.populate = this.populate.join(',');
          }

          this.repository.find(this.criteria, true).then(function (result) {
            _this.loading = false;
            if (_this.showInclude == false) {
              _this.data = result;
              _this.pager.resource = result;
            } else {
              var temp = [];
              result.forEach(function (item) {
                item[_this.include].forEach(function (inner) {
                  temp.push(inner);
                });
              });
              _this.data = temp;
              _this.pager.resource = temp;
            }
          }).catch(function (error) {
            _this.loading = false;
            _this.triggerEvent('exception', { on: 'load', error: error });
          });
        };

        DataTable.prototype.gatherData = function gatherData() {
          var _this2 = this;

          var criteria = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

          return this.repository.find(criteria, true).catch(function (error) {
            _this2.triggerEvent('exception', { on: 'load', error: error });
          });
        };

        DataTable.prototype.populateEntity = function populateEntity(row) {
          return this.repository.getPopulatedEntity(row);
        };

        DataTable.prototype.doDestroy = function doDestroy(row) {
          var _this3 = this;

          if (typeof this.destroy === 'function') {
            return this.destroy(row);
          }

          this.populateEntity(row).destroy().then(function () {
            _this3.load();
            _this3.triggerEvent('destroyed', row);
          }).catch(function (error) {
            _this3.triggerEvent('exception', { on: 'destroy', error: error });
          });
        };

        DataTable.prototype.doEdit = function doEdit(row) {
          if (typeof this.edit === 'function') {
            return this.edit(row);
          }
        };

        DataTable.prototype.doCustomAction = function doCustomAction(action, row) {
          if (typeof action.action === 'function') {
            return action.action(row);
          }
        };

        DataTable.prototype.checkDisabled = function checkDisabled(action, row) {
          if (typeof action.disabled === 'function') {
            return action.disabled(row);
          }

          return false;
        };

        DataTable.prototype.checkVisibility = function checkVisibility(action, row) {
          if (typeof action.visible !== 'function') {
            this.hasVisibleActions = true;

            return true;
          }

          var isVisible = action.visible(row);

          if (isVisible) {
            this.hasVisibleActions = true;
          }

          return isVisible;
        };

        DataTable.prototype.showActions = function showActions() {
          return this.destroy !== null || this.edit !== null || this.actions.length > 0;
        };

        DataTable.prototype.doSort = function doSort(columnLabel) {
          var _criteria$sort;

          var column = columnLabel.column;

          if (this.sortable === null || !this.isSortable(column)) {
            return;
          }

          this.criteria.sort = (_criteria$sort = {}, _criteria$sort[column] = this.criteria.sort[column] === 'asc' ? 'desc' : 'asc', _criteria$sort);
          this.criteria['filter'] = this.criteria['filter'] == undefined ? {} : this.criteria['filter'];
          this.criteria['filter']["order"] = column + " " + (this.criteria.sort[column].toLowerCase() === 'ASC'.toLocaleLowerCase() ? 'DESC' : 'ASC');
          this.load();
        };

        DataTable.prototype.searchColumnChanged = function searchColumnChanged(newValue, oldValue) {
          if (!this.ready) {
            return;
          }

          delete this.criteria[this.searchcaption][oldValue];

          return this.doSearch();
        };

        DataTable.prototype.doSearch = function doSearch() {
          if (!this.ready) {
            return;
          }
          if (this.search !== undefined) if (this.search.trim() == "") this.criteria[this.searchcaption]['where'] = undefined;else if (_typeof(this.criteria[this.searchcaption][this.searchColumn]) === 'object') {
            var _criteria$searchcapti;

            this.criteria[this.searchcaption][this.searchColumn].contains = this.search;
            this.criteria[this.searchcaption]['where'] = (_criteria$searchcapti = {}, _criteria$searchcapti[this.searchColumn] = { "like": ".*" + this.search }, _criteria$searchcapti);
          } else {
            var _criteria$searchcapti2;

            this.criteria[this.searchcaption][this.searchColumn] = { contains: this.search };
            this.criteria[this.searchcaption]['where'] = (_criteria$searchcapti2 = {}, _criteria$searchcapti2[this.searchColumn] = { "like": ".*" + this.search }, _criteria$searchcapti2);
          }

          this.pager.reloadCount();

          this.load();
        };

        DataTable.prototype.reload = function reload() {
          this.pager.reloadCount();

          if (this.page === 1) {
            this.load();
          }

          this.page = 1;
        };

        DataTable.prototype.triggerEvent = function triggerEvent(event) {
          var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

          payload.bubbles = true;

          return this.element.dispatchEvent(new CustomEvent(event, payload));
        };

        DataTable.prototype.selected = function selected(row, columnOptions) {
          var _this4 = this;

          if (columnOptions.route) {
            var params = {};

            if (columnOptions.route.params) {
              Object.keys(columnOptions.route.params).forEach(function (param) {
                var property = columnOptions.route.params[param];

                params[param] = _this4.displayValue(row, property);
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
        };

        DataTable.prototype.isSortable = function isSortable(column) {
          if (column.indexOf('.') > 0) {
            return false;
          }

          if (!this.populate) {
            return true;
          }

          if (typeof this.populate !== 'string') {
            return this.populate.indexOf(column) === -1;
          }

          return this.populate.replace(' ', '').split(',').indexOf(column) === -1;
        };

        DataTable.prototype.displayValue = function displayValue(row, propertyName) {
          return new Homefront(row, Homefront.MODE_NESTED).fetch(propertyName);
        };

        _createClass(DataTable, [{
          key: 'columnLabels',
          get: function get() {
            var _this5 = this;

            function clean(str) {
              return str.replace(/^'?\s*|\s*'$/g, '');
            }

            function ucfirst(str) {
              return str[0].toUpperCase() + str.substr(1);
            }

            if (Array.isArray(this.columns)) {
              return this.columns.map(function (column) {
                return {
                  nested: !_this5.isSortable(column.property),
                  column: column.property,
                  label: ucfirst(clean(column.label || column.property)),
                  route: column.route || false,
                  converter: column.valueConverters || false
                };
              });
            }

            var labelsRaw = this.columns.split(',');
            var columnsArray = [];
            var labels = [];

            labelsRaw.forEach(function (label) {
              if (!label) {
                return;
              }

              var converter = label.split(' | ');
              var aliased = converter[0].split(' as ');
              var cleanedColumn = clean(aliased[0]);

              if (columnsArray.indexOf(cleanedColumn) === -1) {
                columnsArray.push(cleanedColumn);
              }

              labels.push({
                nested: !_this5.isSortable(cleanedColumn),
                column: cleanedColumn,
                label: ucfirst(clean(aliased[1] || aliased[0])),
                converter: converter.length > 1 ? converter.slice(1).join(' | ') : false
              });
            });

            return labels;
          }
        }]);

        return DataTable;
      }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'criteria', [_dec4], {
        enumerable: true,
        initializer: function initializer() {
          return {};
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'where', [_dec5], {
        enumerable: true,
        initializer: function initializer() {
          return {};
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'limit', [bindable], {
        enumerable: true,
        initializer: function initializer() {
          return 30;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'columns', [bindable], {
        enumerable: true,
        initializer: function initializer() {
          return '';
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'searchColumn', [bindable], {
        enumerable: true,
        initializer: function initializer() {
          return 'name';
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'actions', [bindable], {
        enumerable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'searchable', [bindable], {
        enumerable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'sortable', [bindable], {
        enumerable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, 'edit', [bindable], {
        enumerable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, 'destroy', [bindable], {
        enumerable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, 'page', [bindable], {
        enumerable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, 'loadingIndicator', [bindable], {
        enumerable: true,
        initializer: function initializer() {
          return '<center>Loading...</center>';
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, 'populate', [bindable], {
        enumerable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, 'select', [bindable], {
        enumerable: true,
        initializer: null
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, 'repository', [bindable], {
        enumerable: true,
        initializer: null
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, 'resource', [bindable], {
        enumerable: true,
        initializer: null
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, 'data', [bindable], {
        enumerable: true,
        initializer: null
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, 'route', [bindable], {
        enumerable: true,
        initializer: null
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, 'pages', [bindable], {
        enumerable: true,
        initializer: null
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, 'footer', [bindable], {
        enumerable: true,
        initializer: null
      }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, 'searchcaption', [bindable], {
        enumerable: true,
        initializer: function initializer() {
          return 'where';
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, 'include', [bindable], {
        enumerable: true,
        initializer: function initializer() {
          return '';
        }
      }), _descriptor23 = _applyDecoratedDescriptor(_class2.prototype, 'showInclude', [bindable], {
        enumerable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor24 = _applyDecoratedDescriptor(_class2.prototype, 'filterWhere', [bindable], {
        enumerable: true,
        initializer: function initializer() {
          return [];
        }
      }), _applyDecoratedDescriptor(_class2.prototype, 'columnLabels', [_dec6], Object.getOwnPropertyDescriptor(_class2.prototype, 'columnLabels'), _class2.prototype)), _class2)) || _class) || _class) || _class));

      _export('DataTable', DataTable);
    }
  };
});