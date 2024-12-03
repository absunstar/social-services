module.exports = function init(site) {


  let collection_name = 'stores_items'

  let source = {
    name: 'Security System',
    Ar: 'نظام الحماية'
  }

  let image_url = '/images/users.png'

  let login_message = {
    name: 'user Login',
    Ar: 'مستخدم سجل دخول'
  }
  let logout_message = {
    name: 'user Logout',
    Ar: 'مستخدم سجل خروج'
  }
  let register_message = {
    name: 'New user Register',
    Ar: 'تم أشتراك مستخدم جديد'
  }
  let add_message = {
    name: 'New User Added',
    Ar: 'تم إضافة مستخدم جديد'
  }
  let update_message = {
    name: ' User  updated',
    Ar: 'تم تعديل   مستخدم'
  }
  let delete_message = {
    name: ' User  dleteted',
    Ar: 'تم حذف  مستخدم  '
  }


  site.on('user register', function (result) {
    site.call('please monitor action', ({
      obj: {
        company: result.doc.company,
        branch: result.doc.branch,
        icon: image_url,
        source: source,
        message: register_message,
        value: {
          name: result.doc.email,
          Ar: result.doc.email
        },
        add: result.doc,
        action: 'add'
      },
      result: result
    }))
  })

  site.on('user login', function (result) {

    site.call('please monitor action', ({
      obj: {
        company: result.doc.company,
        branch: result.doc.branch,
        icon: image_url,
        source: source,
        message: login_message,
        value: {
          name: result.doc.email,
          Ar: result.doc.email
        },
        action: 'info'
      },
      result: result
    }))

  })

  site.on('user logout', function (result) {

    site.call('please monitor action', ({
      obj: {
        company: result.doc.company,
        branch: result.doc.branch,
        icon: image_url,
        source: source,
        message: logout_message,
        value: {
          name: result.doc.email,
          Ar: result.doc.email
        },

        action: 'info'
      },
      result: result
    }))

  })

  site.on('user add', function (result) {
    site.call('please monitor action', ({
      obj: {
        company: result.doc.company,
        branch: result.doc.branch,
        icon: image_url,
        source: source,
        message: add_message,
        value: {
          name: result.doc.email,
          Ar: result.doc.email
        },

        add: result.doc,
        action: 'add'
      },
      result: result
    }))
  })

  site.on('user update', function (result) {

    site.call('please monitor action', ({
      obj: {
        company: result.doc.company,
        branch: result.doc.branch,
        icon: image_url,
        source: source,
        message: update_message,
        value: {
          name: result.doc.email,
          Ar: result.doc.email
        },

        update: site.objectDiff(result.update.$set, result.doc),
        action: 'update'
      },
      result: result
    }))
  })

  site.on('user delete', function (result) {
    site.call('please monitor action', ({
      obj: {
        company: result.doc.company,
        branch: result.doc.branch,
        icon: image_url,
        source: source,
        message: delete_message,
        value: {
          name: result.doc.email,
          Ar: result.doc.email
        },

        delete: result.doc,
        action: 'delete'
      },
      result: result
    }))
  })

}