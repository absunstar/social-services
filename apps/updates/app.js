module.exports = function init(site) {
  const $updates = site.connectCollection("updates");
  site.siteUpdateList = [];
  $updates.findMany({}, (err, docs) => {
    if (!err && docs) {
      site.siteUpdateList = [...site.siteUpdateList, ...docs];
    }
  });

  site.get({
    name: "images",
    path: __dirname + "/site_files/images/",
  });

  site.get({
    name: "/admin/updates",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: true,
  });

 

  site.post("/api/updates/add", (req, res) => {
    let response = {
      done: false,
    };
    if (!req.session.user) {
      response.error = "Please Login First";
      res.json(response);
      return;
    }

    let _data = req.body;

    _data.host = site.getHostFilter(req.host);

    if ((mamaId = site.getMamaSetting(req))) {
      _data.mamaId = mamaId;
    }
    _data.add_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    $updates.add(_data, (err, doc) => {
      if (!err) {
        response.done = true;
        response.doc = doc;
        site.siteUpdateList.push({
          _id: doc._id,
          id: doc.id,
          title: doc.title,
          image: doc.image,
          url: doc.url,
        });
      } else {
        response.error = err.message;
      }
      res.json(response);
    });
  });

  site.post("/api/updates/update", (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = "Please Login First";
      res.json(response);
      return;
    }

    let page_implement_doc = req.body;

    page_implement_doc.edit_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    if (!page_implement_doc.id) {
      response.error = "No id";
      res.json(response);
      return;
    }

    $updates.edit(
      {
        where: {
          id: page_implement_doc.id,
        },
        set: page_implement_doc,
      },
      (err, result) => {
        if (!err && result) {
          response.done = true;
          site.siteUpdateList.forEach((a, i) => {
            if (a.id === result.doc.id) {
              site.siteUpdateList[i]._id = result.doc._id;
              site.siteUpdateList[i].id = result.doc.id;
              site.siteUpdateList[i].title = result.doc.title;
              site.siteUpdateList[i].image = result.doc.image;
              site.siteUpdateList[i].url = result.doc.url;
            }
          });
        } else {
          response.error = "Code Already Exist";
        }
        res.json(response);
      }
    );
  });

  site.post("/api/updates/view", (req, res) => {
    let response = {
      done: false,
    };

    let _data = req.data;
    $updates.find(_data, (err, doc) => {
      if (!err && doc) {
        response.done = true;
        response.doc = doc;
      } else {
        response.error = err?.message || req.word("Not Exists");
      }
      res.json(response);
    });
  });

  site.post("/api/updates/delete", (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = "Please Login First";
      res.json(response);
      return;
    }

    if (!req.body.id) {
      response.error = "no id";
      res.json(response);
      return;
    }

    $updates.delete(
      {
        id: req.body.id,
      },
      (err, result) => {
        if (!err) {
          response.done = true;
          site.siteUpdateList.splice(
            site.siteUpdateList.findIndex((a) => a.id === req.body.id),
            1
          );
        } else {
          response.error = err.message;
        }
        res.json(response);
      }
    );
  });

  site.post("/api/updates/all", (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = "Please Login First";
      res.json(response);
      return;
    }

    let where = req.body.where || {};
    if (where["name"]) {
      where.$or = [];
      where.$or.push({
        name_ar: site.get_RegExp(where["name"], "i"),
      });
      where.$or.push({
        name_en: site.get_RegExp(where["name"], "i"),
      });
      delete where["name"];
    }
    if ((mamaId = site.getMamaSetting(req))) {
      where["mamaId"] = mamaId;
    } else {
      where["host"] = site.getHostFilter(req.host);
    }
    $updates.findMany(
      {
        select: req.body.select || {},
        where: where,
        sort: req.body.sort || {
          id: -1,
        },
        limit: req.body.limit,
      },
      (err, docs, count) => {
        if (!err) {
          response.done = true;
          response.list = docs;
          response.count = count;
        } else {
          response.error = err.message;
        }
        res.json(response);
      }
    );
  });

  site.post({ name: `/api/updates/allMemory`, public: true }, (req, res) => {
    let where = req.body.where || {};
    let select = req.body.select || { id: 1, title: 1, image: 1, url: 1 };
    let list = [];
    let host = site.getHostFilter(req.host);

    site.siteUpdateList.forEach((doc) => {
      let obj = { ...doc };
      if ((!where.active || doc.active) && doc.host == host) {
        for (const p in obj) {
          if (!Object.hasOwnProperty.call(select, p)) {
            delete obj[p];
          }
        }
        list.push(obj);
      }
    });
    res.json({
      done: true,
      list: list,
    });
  });
};
