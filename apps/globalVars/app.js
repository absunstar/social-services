module.exports = function init(site) {
  site.storeTypes = [
    {
      name: "public",
      Ar: "عام",
      En: "Public",
    },
    {
      name: "private",
      Ar: "خاص",
      En: "Private",
    }
  ];
  site.genders = [
    { id: 1, nameEn: "Male", nameAr: "ذكر" },
    { id: 2, nameEn: "Female", nameAr: "أنثى" },
  ];

  
  site.post("/api/storeTypes", (req, res) => {
    res.json({
      done: true,
      list: site.storeTypes,
    });
  });

  site.post("/api/genders", (req, res) => {
    res.json({
      done: true,
      list: site.genders,
    });
  });

};
