module.exports = function init(site) {
  site.storeAccountsStatus = [
    {
      name: "available",
      Ar: "متاح",
      En: "Available",
    },
    {
      name: "reserved",
      Ar: "محجوز",
      En: "Reserved",
    },
    {
      name: "sold",
      Ar: "تم البيع",
      En: "Sold",
    },
  ];
  site.genders = [
    { id: 1, nameEn: "Male", nameAr: "ذكر" },
    { id: 2, nameEn: "Female", nameAr: "أنثى" },
  ];

  
  site.post("/api/storeAccountsStatus", (req, res) => {
    res.json({
      done: true,
      list: site.storeAccountsStatus,
    });
  });

  site.post("/api/genders", (req, res) => {
    res.json({
      done: true,
      list: site.genders,
    });
  });

};
