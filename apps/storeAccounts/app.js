module.exports = function init(site) {
  let app = {
    name: "storeAccounts",
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
        },
        (req, res) => {
          res.render(
            app.name + "/index.html",
            {
              title: app.name,
              appName: req.word("Store Accounts"),
              setting: site.getSiteSetting(req.host),
            },
            { parser: "html", compres: true }
          );
        }
      );
    }

    if (app.allowRouteAdd) {
      site.post({ name: `/api/${app.name}/add`, require: { permissions: ["login"] } }, (req, res) => {
        let response = {
          done: false,
        };

        let _data = req.data;
        _data.socialPlatform = {
          code: _data.socialPlatform.code,
          name: _data.socialPlatform.name,
          url: _data.socialPlatform.url,
        };
        _data.addUserInfo = req.getUserFinger();
        _data.host = site.getHostFilter(req.host);

        app.add(_data, (err, doc) => {
          if (!err && doc) {
            doc.code = "ACC" + doc.id.toString() + Math.floor(Math.random() * 10000) + 9000;
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
      site.post(
        {
          name: `/api/${app.name}/update`,
          require: { permissions: ["login"] },
        },
        (req, res) => {
          let response = {
            done: false,
          };

          let _data = req.data;
          _data.editUserInfo = req.getUserFinger();
          _data.socialPlatform = {
            code: _data.socialPlatform.code,
            name: _data.socialPlatform.name,
            url: _data.socialPlatform.url,
          };
          app.update(_data, (err, result) => {
            if (!err) {
              response.done = true;
              response.result = result;
            } else {
              response.error = err.message;
            }
            res.json(response);
          });
        }
      );

      site.post(
        {
          name: `/api/${app.name}/updateTrusted`,
          require: { permissions: ["login"] },
        },
        (req, res) => {
          let response = {
            done: false,
          };

          let where = req.data;

          app.$collection.find(where, (err, doc) => {
            if (!err && doc) {
              doc.trusted = true;
              app.update(doc, (err, result) => {
                if (!err) {
                  response.done = true;
                  response.doc = result.doc;
                } else {
                  response.error = err.message || req.word("Not Exists");
                }
                res.json(response);
              });
            } else {
              response.error = err?.message || req.word("Not Exists");
              res.json(response);
            }
          });
        }
      );

      site.post(
        {
          name: `/api/${app.name}/linkWithPackage`,
          require: { permissions: ["login"] },
        },
        (req, res) => {
          let response = {
            done: false,
          };

          let type = req.data.type;
          let where = req.data.where;

          where["trusted"] = true;

          app.$collection.find(where, (err, doc) => {
            if (!err && doc) {
              if (type == "link") {
                if (!doc.standalone) {
                  response.error = req.word("This Account Is`t Standalone");
                  return;
                }
                doc.packageId = req.data.packageId;
                doc.standalone = false;
              } else if (type == "unlink") {
                doc.packageId = 0;
                doc.standalone = true;
              }

              app.$collection.edit(
                {
                  where: {
                    id: doc.id,
                  },
                  set: doc,
                },
                (err, result) => {
                  if (!err) {
                    response.done = true;
                    response.doc = {
                      id: result.doc.id,
                      email: result.doc.email,
                      price: result.doc.price,
                      socialPlatform: result.doc.socialPlatform,
                    };
                  } else {
                    response.error = err.message || req.word("Not Exists");
                  }
                  res.json(response);
                }
              );
            } else {
              response.error = err?.message || req.word("Not Exists");
              res.json(response);
            }
          });
        }
      );
    }

    if (app.allowRouteDelete) {
      site.post(
        {
          name: `/api/${app.name}/delete`,
          require: { permissions: ["login"] },
        },
        (req, res) => {
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
        }
      );
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

      site.post({ name: `/api/${app.name}/viewSomeData`, public: true }, (req, res) => {
        let response = {
          done: false,
        };

        let where = req.data;
        where["host"] = site.getHostFilter(req.host);
        let select = {
          id: 1,
          email: 1,
          price: 1,
          socialPlatform: 1,
        };

        app.all({ where, select, sort: { id: -1 } }, (err, docs) => {
          if (!err) {
            response.done = true;
            response.docs = docs;
          } else {
            response.error = err?.message || req.word("Not Exists");
          }
          res.json(response);
        });
      });
    }

    if (app.allowRouteAll) {
      site.post({ name: `/api/${app.name}/all`, public: true }, (req, res) => {
        let where = req.body.where || {};
        let search = req.body.search || "";
        let limit = req.body.limit || 50;
        let select = req.body.select || {};
        if (search) {
          where.$or = [];
          where.$or.push({
            id: site.get_RegExp(search, "i"),
          });
          where.$or.push({
            "socialPlatform.name": site.get_RegExp(search, "i"),
          });
          where.$or.push({
            "storeType.name": site.get_RegExp(search, "i"),
          });
          where.$or.push({
            "user.firstName": site.get_RegExp(search, "i"),
          });
          where.$or.push({
            title: site.get_RegExp(search, "i"),
          });
          where.$or.push({
            email: site.get_RegExp(search, "i"),
          });
          where.$or.push({
            facode: site.get_RegExp(search, "i"),
          });
        }

        if (where["socialPlatform"]?.code) {
          where["socialPlatform.code"] = where["socialPlatform"].code;
          delete where["socialPlatform"];
        }

        if (where["platformService"]?.code) {
          where["platformService.code"] = where["platformService"].code;
          delete where["platformService"];
        }

        if (where["storeType"]?.code) {
          where["storeType.code"] = where["storeType"].code;
          delete where["storeType"];
        }

        if (where["provider"]?.code) {
          where["provider.code"] = where["provider"].code;
          delete where["provider"];
        }

        if (where["user"]?.id) {
          where["user.id"] = where["user"].id;
          delete where["user"];
        }

        if (where["email"]) {
          where["email"] = where["email"];
        }

        if (where["password"]) {
          where["password"] = where["password"];
        }

        if (where["facode"]) {
          where["facode"] = site.get_RegExp(where["facode"], "i");
        }

        if (where["title"]) {
          where["title"] = site.get_RegExp(where["title"], "i");
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

  site.storeAccountsReserved = function (data) {
    let where = {};
    let idList = data.map((_item) => _item.id);
    where["id"] = {
      $in: idList,
    };
    app.$collection.findMany({ where }, (err, docs) => {
      if (!err && docs) {
        for (let i = 0; i < docs.length; i++) {
          docs[i].standalone = false;
          app.update(docs[i]);
        }
      }
    });
  };

  site.updateUserInStoreAccount = function (data) {

    app.$collection.find({ id: data.id }, (err, doc) => {
      if (!err && doc) {
        doc.user = data.user;
        doc.allowSale = false;
        doc.storeType = site.storeTypeList.find((itm) => itm.code == "private");

        app.update(doc, (err, result) => {
          if (!err) {
          }
        });
      }
    });
  };


  site.updateUserInStoreAccountByPackage = function (data) {
    console.log(data);
    
    app.$collection.editMany(
      {
        where: {
          'packageId': data.id,
        },
        set: {user : data.user},
      },
      (err, result) => {
      }
    )
  };

  app.init();
  site.addApp(app);
};
