module.exports = function init(site) {
  let app = {
    name: "manageUsers",
    allowMemory: false,
    memoryList: [],
    newList: [],
    activeList: [],
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
  site.userList = [];

  app.$collection = site.connectCollection("users_info");

  app.init = function () {
    app.$collection.findMany({ sort: { id: -1 } }, (err, docs) => {
      if (!err) {
        docs.forEach((doc) => {
          let obj = {
            _id: doc._id,
            id: doc.id,
            image: doc.image,
            firstName: doc.firstName,
            lastName: doc.lastName,
            host: doc.host,
            active: doc.active,
          };
          site.userList.push({ ...obj });
        });
      }
    });
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
          name:'/admin/' + app.name,
        },
        (req, res) => {
          let appName = req.word("Manage Users");
          res.render(
            app.name + "/index.html",
            {
              title: app.name,
              appName: appName,
              setting: site.getSiteSetting(req.host),
              language: req.session.language,
            },
            { parser: "html css js", compres: true }
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

        _data.host = site.getHostFilter(req.host);

        app.add(_data, (err, doc) => {
          if (!err && doc) {
            let obj = {
              _id: doc._id,
              id: doc.id,
              image: doc.image,
              bio: doc.bio,
              title: doc.title,
              firstName: doc.firstName,
              lastName: doc.lastName,
              username: doc.username,
              host: doc.host,
              youtubeAccouunt: doc.youtubeAccouunt,
              instagramAccouunt: doc.instagramAccouunt,
              twitterAccouunt: doc.twitterAccouunt,
              facebookAccount: doc.facebookAccount,
              linkedinAccouunt: doc.linkedinAccouunt,
              active: doc.active,
            };
            site.userList.push(obj);

            response.done = true;
            response.doc = doc;
            res.json(response);
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
          let host = site.getHostFilter(req.host);

          let _data = req.data;
          _data.editUserInfo = req.getUserFinger();

          site.security.updateUser(_data, (err, result) => {
            if (!err) {
              if (result && result.doc.barcode != result?.old_doc?.barcode) {
                let changeData = { host: host, id: result.doc.id, barcode: result.doc.barcode };
                site.changeStudentBarcodeForGroups(changeData);
                site.changeStudentBarcodeForPreparingGroups(changeData);
                site.changeStudentBarcodeForPreparingQuizzes(changeData);
              }
              response.done = true;
              response.result = result;
              if (result.doc) {
                let listName = "studentList";
                if (result.doc.type == "mama") {
                  listName = "mamaList";
                } else if (result.doc.type == "parent") {
                  listName = "parentList";
                }
                let index = site.userList.findIndex((a) => a.id === result?.doc?.id);
                if (index !== -1) {
                  site.userList[index] = {
                    _id: result.doc._id,
                    id: result.doc.id,
                    image: result.doc.image,
                    firstName: result.doc.firstName,
                    lastName: result.doc.lastName,
                    username: result.doc.username,
                    bio: result.doc.bio,
                    title: result.doc.title,
                    parent: result.doc.parent,
                    host: result.doc.host,
                    levelList: result.doc.levelList,
                    purchaseTypeList: result.doc.purchaseTypeList,
                    youtubeAccouunt: result.doc.youtubeAccouunt,
                    instagramAccouunt: result.doc.instagramAccouunt,
                    twitterAccouunt: result.doc.twitterAccouunt,
                    facebookAccount: result.doc.facebookAccount,
                    linkedinAccouunt: result.doc.linkedinAccouunt,
                    active: result.doc.active,
                  };
                }
              }
            } else {
              response.error = err.message;
            }
            res.json(response);
          });
        }
      );

      site.post(
        {
          name: `/api/${app.name}/updateStudentNotifications`,
          require: { permissions: ["login"] },
        },
        (req, res) => {
          let response = {
            done: false,
          };

          let _data = req.data;
          site.security.getUser({ id: req.session.user.id }, (err, user) => {
            if (!err) {
              if (user) {
                user.notificationsList = user.notificationsList || [];

                if (_data.type == "deleteAll") {
                  user.notificationsList = [];
                } else if (_data.type == "deleteOne") {
                  user.notificationsList = user.notificationsList.filter((_n) => _n.id != _data.id);
                } else if (_data.type == "showAll") {
                  for (let i = 0; i < user.notificationsList.length; i++) {
                    user.notificationsList[i].show = true;
                  }
                }
                site.security.updateUser(user, (err1, result) => {
                  if (!err1) {
                    response.done = true;
                    result.doc.notificationsList = result.doc.notificationsList || [];
                    for (let i = 0; i < result.doc.notificationsList.length; i++) {
                      result.doc.notificationsList[i].$time = site.xtime(result.doc.notificationsList[i].date, req.session.lang);
                    }
                    response.result = result.doc;
                  } else {
                    response.error = err1.message;
                  }
                  res.json(response);
                });
              } else {
                res.json(response);
              }
            } else {
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
          site.security.deleteUser({ id: _data.id, $req: req, $res: res }, (err, result) => {
            if (!err && result.count === 1) {
              response.done = true;
              response.result = result;
              let index = site.userList.findIndex((a) => a.id === result.doc.id);
              if (index !== -1) {
                site.userList.splice(index, 1);
              }
              res.json(response);
            } else {
              response.error = err?.message || "Deleted Not Exists";
              res.json(response);
            }
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
        app.view({ id: _data.id }, (err, doc) => {
          if (!err && doc) {
            response.done = true;
            response.doc = doc;
          } else {
            response.error = err?.message || "Not Exists";
          }
          res.json(response);
        });
      });
    }

    if (app.allowRouteAll) {
      site.post({ name: `/api/${app.name}/all`, public: true }, (req, res) => {        
        let setting = site.getSiteSetting(req.host);
        let where = req.body.where || {};
        let search = req.body.search || "";
        let limit = req.body.limit || 100;
        let select = req.body.select || {
          id: 1,
          image: 1,
          userId: 1,
          type: 1,
          active: 1,
          username: 1,
          firstName: 1,
          email: 1,
          barcode: 1,
          balance: 1,
        };
        if (search) {
          where.$or = [];

          where.$or.push({
            id: site.get_RegExp(search, "i"),
          });

          where.$or.push({
            email: site.get_RegExp(search, "i"),
          });

          where.$or.push({
            firstName: site.get_RegExp(search, "i"),
          });

          where.$or.push({
            lastName: site.get_RegExp(search, "i"),
          });

          where.$or.push({
            idNumber: site.get_RegExp(search, "i"),
          });
          where.$or.push({
            "gender.nameAr": search,
          });
          where.$or.push({
            "gender.nameEn": search,
          });
          where.$or.push({
            phone: search,
          });
          where.$or.push({
            mobile: search,
          });
          where.$or.push({
            whatsapp: search,
          });
          where.$or.push({
            socialEmail: site.get_RegExp(search, "i"),
          });
          where.$or.push({
            bio: site.get_RegExp(search, "i"),
          });
          where.$or.push({
            title: site.get_RegExp(search, "i"),
          });
          where.$or.push({
            address: site.get_RegExp(search, "i"),
          });
          where.$or.push({
            "gov.name": site.get_RegExp(search, "i"),
          });
          where.$or.push({
            "city.name": site.get_RegExp(search, "i"),
          });
          where.$or.push({
            "area.name": site.get_RegExp(search, "i"),
          });
        }

        app.$collection.findMany({ where, select, limit, sort: { id: -1 } }, (err, users, count) => {
          res.json({
            done: true,
            count: count,
            list: users,
          });
        });
      });
    }
  }

  site.getUsers = function (data) {
    let host = site.getHostFilter(data.host);
    let docs = [];
    for (let i = 0; i < site.userList.length; i++) {
      let obj = { ...site.userList[i] };
      if (obj.host == host && obj.active == true) {
        docs.push(obj);
      }
    }

    return docs.slice(0, data.limit || 10000);
  };

  site.updateUserBalance = async function (data) {
    site.security.getUser(
      {
        id: data.userId,
      },
      (err, doc) => {
        if (!err && doc) {
          doc.balance = doc.balance || 0;
          if (data.type == "+") {
            doc.balance += data.price;
          } else if (data.type == "-") {
            
            doc.balance -= data.price;
          }
          site.security.updateUser(doc, (err) => {
            return true;
          });
        } else {
          return false;
        }
      }
    );
  };

  app.init();
  site.addApp(app);
};
