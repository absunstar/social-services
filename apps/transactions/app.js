module.exports = function init(site) {
  let app = {
    name: "transactions",
    allowMemory: false,
    memoryList: [],
    allowCache: false,
    cacheList: [],
    allowRoute: true,
    allowRouteGet: true,
    allowRouteAdd: true,
    allowRouteUpdate: true,
    allowRouteDelete: true,
    allowRouteView: true,
    allowRouteAll: true,
  };

  app.$collection = site.connectCollection(app.name);

  app.init = function () {
    if (app.allowMemory) {
      app.$collection.findMany({}, (err, docs) => {
        if (!err) {
          if (docs.length == 0) {
            app.cacheList.forEach((_item, i) => {
              app.$collection.add(_item, (err, doc) => {
                if (!err && doc) {
                  app.memoryList.push(doc);
                }
              });
            });
          } else {
            docs.forEach((doc) => {
              app.memoryList.push(doc);
            });
          }
        }
      });
    }
  };
  app.add = function (_item, callback) {
    app.$collection.add(_item, (err, doc) => {
      if (callback) {
        callback(err, doc);
      }
      if (app.allowMemory && !err && doc) {
        app.memoryList.push(doc);
      }
    });
  };
  app.update = function (_item, callback) {
    app.$collection.edit(
      {
        where: {
          id: _item.id,
        },
        set: _item,
      },
      (err, result) => {
        if (callback) {
          callback(err, result);
        }
        if (app.allowMemory && !err && result) {
          let index = app.memoryList.findIndex((itm) => itm.id === result.doc.id);
          if (index !== -1) {
            app.memoryList[index] = result.doc;
          } else {
            app.memoryList.push(result.doc);
          }
        } else if (app.allowCache && !err && result) {
          let index = app.cacheList.findIndex((itm) => itm.id === result.doc.id);
          if (index !== -1) {
            app.cacheList[index] = result.doc;
          } else {
            app.cacheList.push(result.doc);
          }
        }
      }
    );
  };
  app.delete = function (_item, callback) {
    app.$collection.delete(
      {
        id: _item.id,
      },
      (err, result) => {
        if (callback) {
          callback(err, result);
        }
        if (app.allowMemory && !err && result.count === 1) {
          let index = app.memoryList.findIndex((a) => a.id === _item.id);
          if (index !== -1) {
            app.memoryList.splice(index, 1);
          }
        } else if (app.allowCache && !err && result.count === 1) {
          let index = app.cacheList.findIndex((a) => a.id === _item.id);
          if (index !== -1) {
            app.cacheList.splice(index, 1);
          }
        }
      }
    );
  };
  app.view = function (_item, callback) {
    if (callback) {
      if (app.allowMemory) {
        if ((item = app.memoryList.find((itm) => itm.id == _item.id))) {
          callback(null, item);
          return;
        }
      } else if (app.allowCache) {
        if ((item = app.cacheList.find((itm) => itm.id == _item.id))) {
          callback(null, item);
          return;
        }
      }

      app.$collection.find({ id: _item.id }, (err, doc) => {
        callback(err, doc);

        if (!err && doc) {
          if (app.allowMemory) {
            app.memoryList.push(doc);
          } else if (app.allowCache) {
            app.cacheList.push(doc);
          }
        }
      });
    }
  };
  app.all = function (_options, callback) {
    if (callback) {
      if (app.allowMemory) {
        callback(null, app.memoryList);
      } else {
        app.$collection.findMany(_options, callback);
      }
    }
  };

  if (app.allowRoute) {
    if (app.allowRouteGet) {
      site.get(
        {
          name: app.name,
          require: { features: ['browser.social'] },
        },
        (req, res) => {
          res.render(app.name + "/index.html", { title: app.name, appName: req.word("Transactions"), setting: site.getSiteSetting(req.host) }, { parser: "html", compres: true });
        }
      );
    }

    if (app.allowRouteAdd) {
      site.post({ name: `/api/${app.name}/add`, require: { permissions: ["login"] } }, (req, res) => {
        let response = {
          done: false,
        };

        let _data = req.data;

        _data.addUserInfo = req.getUserFinger();
        _data.host = site.getHostFilter(req.host);
        _data.type = site.transactionTypeList.find((itm) => itm.code == "review");
        _data.status = site.transactionStatusList.find((itm) => itm.code == "pending");
        if (_data.transactionName.code == "rechargeBalance") {
          _data.userProvider = {
            id: req.session.user.id,
            firstName: req.session.user.firstName || req.session.user.name,
          };
        }
        _data.date = site.getDate();
        app.add(_data, (err, doc) => {
          if (!err && doc) {
            doc.code = "TX" + doc.id.toString() + Math.floor(Math.random() * 10000) + 9000;
            app.update(_data, (err, result) => {
              if (!err && result) {
                response.done = true;
                response.doc = result.doc;
              } else {
                response.error = err?.mesage || req.word("Can`t Set Code");
              }
              res.json(response);
            });
          } else {
            response.error = err.mesage;
            res.json(response);
          }
        });
      });
    }

    if (app.allowRouteUpdate) {
      site.post({ name: `/api/${app.name}/update`, require: { permissions: ["login"] } }, (req, res) => {
        let response = {
          done: false,
        };

        let _data = req.data;
        _data.editUserInfo = req.getUserFinger();

        app.update(_data, (err, result) => {
          if (!err) {
            response.done = true;
            response.result = result;
          } else {
            response.error = err.message;
          }
          res.json(response);
        });
      });
    }

    if (app.allowRouteDelete) {
      site.post({ name: `/api/${app.name}/delete`, require: { permissions: ["login"] } }, (req, res) => {
        let response = {
          done: false,
        };
        let _data = req.data;

        app.delete(_data, (err, result) => {
          if (!err && result.count === 1) {
            response.done = true;
            response.result = result;
          } else {
            response.error = err?.message || "Deleted Not Exists";
          }
          res.json(response);
        });
      });
    }

    if (app.allowRouteView) {
      site.post({ name: `/api/${app.name}/view`, public: true }, (req, res) => {
        let response = {
          done: false,
        };

        let _data = req.data;
        app.view(_data, (err, doc) => {
          if (!err && doc) {
            response.done = true;
            response.doc = doc;
          } else {
            response.error = err?.message || req.word("Not Exists");
          }
          res.json(response);
        });
      });
    }

    site.post(
      {
        name: `/api/${app.name}/updateSome`,
        require: { permissions: ["login"] },
      },
      (req, res) => {
        let response = {
          done: false,
        };

        let id = req.data.id;
        let type = req.data.type;
        let value = req.data.value;

        app.$collection.find({ id: id }, (err, doc) => {
          if (!err && doc) {
            site.security.getUser(
              {
                id: doc.user.id,
              },
              (err, user) => {
                if (value == "approved") {
                  if (doc.transactionName.code != "rechargeBalance" && user.balance < doc.price) {
                    response.error = req.word("User balance does not allow purchase");
                    res.json(response);
                    return;
                  } else if (doc.transactionName.code != "buyService") {
                    doc.status = site.transactionStatusList.find((itm) => itm.code == "done");
                  }
                }

                if (type == "type") {
                  doc[type] = site.transactionTypeList.find((itm) => itm.code == value);
                }
                if (type == "status") {
                  doc[type] = site.transactionStatusList.find((itm) => itm.code == value);
                }

                app.update(doc, async (err, result) => {
                  if (!err) {
                    response.done = true;
                    if (value == "approved") {
                      let obj = {
                        userId: doc.user.id,
                        price: doc.price,
                      };
                      if (result.doc.transactionName.code == "rechargeBalance") {
                        obj.type = "+";
                      } else {
                        obj.type = "-";
                      }
                      await site.updateUserBalance(obj);

                      let _obj = {};
                      if (result.doc.transactionName.code == "buyAccount") {
                        _obj.userId = doc.userProvider.id;
                        _obj.price = doc.price;
                        _obj.type = "+";
                        site.updateUserInStoreAccount({ id: doc.account.id, user: doc.user });
                      } else if (result.doc.transactionName.code == "buyPackage") {
                        _obj.userId = doc.userProvider.id;
                        _obj.price = doc.price;
                        _obj.type = "+";
                        site.updateUserInStorePackage({ id: doc.package.id, user: doc.user });
                        site.updateUserInStoreAccountByPackage({ id: doc.package.id, user: doc.user });
                      } else if (result.doc.transactionName.code == "buyService") {
                        _obj.userId = doc.userProvider.id;
                        _obj.price = doc.price;
                        _obj.type = "+";
                      }
                      site.updateUserBalance(_obj);
                    }
                    response.doc = result.doc;
                  } else {
                    response.error = err.message || req.word("Not Exists");
                  }
                  res.json(response);
                });
              }
            );
          } else {
            response.error = err?.message || req.word("Not Exists");
            res.json(response);
          }
        });
      }
    );

    if (app.allowRouteAll) {
      site.post({ name: `/api/${app.name}/all`, public: true }, (req, res) => {
        let where = req.body.where || {};
        let search = req.body.search || "";
        let limit = req.body.limit || 100;
        let select = req.body.select || { id: 1, code: 1, date: 1, user: 1, userProvider: 1, status: 1, price: 1, transactionName: 1, type: 1, status: 1, paymentMethod: 1 };

        if (search) {
          where.$or = [];
          where.$or.push({
            id: site.get_RegExp(search, "i"),
          });
          where.$or.push({
            "service.name": site.get_RegExp(search, "i"),
          });
        }

        if (where["socialPlatform"]?.code) {
          where["socialPlatform.code"] = where["socialPlatform"].code;
          delete where["socialPlatform"];
        }

        if (where["transactionName"]?.code) {
          where["transactionName.code"] = where["transactionName"].code;
          delete where["transactionName"];
        }

        if (where["service"]?.code) {
          where["service.code"] = where["service"].code;
          delete where["service"];
        }

        if (where["type"]?.code) {
          where["type.code"] = where["type"].code;
          delete where["type"];
        }

        if (where["paymentMethod"]?.code) {
          where["paymentMethod.code"] = where["paymentMethod"].code;
          delete where["paymentMethod"];
        }

        if (where["status"]?.code) {
          where["status.code"] = where["status"].code;
          delete where["status"];
        }

        if (where["user"]?.id) {
          where["user.id"] = where["user"].id;
          delete where["user"];
        }

        if (where["userProvider"]?.id) {
          where["userProvider.id"] = where["userProvider"].id;
          delete where["userProvider"];
        }

        where["host"] = site.getHostFilter(req.host);

        app.all({ where, select, limit, sort: { id: -1 } }, (err, docs) => {
          res.json({
            done: true,
            list: docs,
          });
        });
      });
    }
  }

  app.init();
  site.addApp(app);
};
