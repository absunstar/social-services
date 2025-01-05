module.exports = function init(site) {
  let app = {
    name: "tasks",
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
          res.render(app.name + "/index.html", { title: app.name, appName: req.word("Tasks"), setting: site.getSiteSetting(req.host) }, { parser: "html", compres: true });
        }
      );
    }

    if (app.allowRouteAdd) {
      site.post({ name: `/api/${app.name}/add`, require: { permissions: ["login"] } }, (req, res) => {
        let response = {
          done: false,
        };
        let _data = req.data;

        _data.date = site.getDate();
        _data.addUserInfo = req.getUserFinger();
        _data.host = site.getHostFilter(req.host);
        // _data.socialPlatform = {
        //   code: _data.socialPlatform.code,
        //   name: _data.socialPlatform.name,
        //   url: _data.socialPlatform.url,
        // };
        _data.taskList = [];
        _data.taskList = _data.accountList.map((item) => {
          return { user: { ...item }, isDone: false };
        });

        app.add(_data, (err, doc) => {
          if (!err && doc) {
            response.done = true;
            response.doc = doc;
          } else {
            response.error = err.mesage;
          }
          res.json(response);
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
        // _data.socialPlatform = {
        //   code: _data.socialPlatform.code,
        //   name: _data.socialPlatform.name,
        //   url: _data.socialPlatform.url,
        // };
        _data.taskList = [];
        _data.taskList = _data.accountList.map((item) => {
          return { user: { ...item }, isDone: false };
        });

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

      site.post({ name: `/api/${app.name}/updateAction`, require: { permissions: ["login"] } }, (req, res) => {
        let response = {
          done: false,
        };

        let _data = req.data;
        app.$collection.edit(
          {
            where: {
              id: _data.id,
            },
            set: {id : _data.id, isDone: true, actionDate: site.getDate(),editUserInfo :  req.getUserFinger()},
          },
          (err, result) => {
            if (!err) {
              response.done = true;
              response.doc = result.doc;
              site.updateCountOrder(_data.orderId, _data.type);
            } else {
              response.error = err.message;
            }
            res.json(response);
          }
        );
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

    if (app.allowRouteAll) {
      site.post({ name: `/api/${app.name}/all`, public: true }, (req, res) => {
        let where = req.body.where || {};
        let search = req.body.search || "";
        let limit = req.body.limit || 100;
        let select = req.body.select || {};

        if (search) {
          where.$or = [];

          where.$or.push({
            id: site.get_RegExp(search, "i"),
          });

          where.$or.push({
            name: site.get_RegExp(search, "i"),
          });
        }
        if (where["provider"]?.code) {
          where["provider.code"] = where["provider"].code;
          delete where["provider"];
        }

        if (where["socialPlatform"]?.code) {
          where["socialPlatform.code"] = where["socialPlatform"].code;
          delete where["socialPlatform"];
        }

        if (where["platformService"]?.code) {
          where["platformService.code"] = where["platformService"].code;
          delete where["platformService"];
        }

        if (where["user"]?.id) {
          where["user.id"] = where["user"].id;
          delete where["user"];
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
  site.addTasks = function (list) {
    app.$collection.insertMany(list, (err, docs) => {});
  };

  site.deleteTasks = function (id) {
    app.$collection.deleteMany(
      {
        orderId: id,
      },
      (err, result) => {}
    );
  };

  site.taskIsDone = function (id) {
    app.$collection.edit(
      {
        where: {
          id: id,
        },
        set: { isDone: true, actionDate: site.getDate() },
      },
      (err, result) => {}
    );
  };
  app.init();
  site.addApp(app);
};
