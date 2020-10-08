const categories = ['chemistry', 'economics', 'literature', 'medicine', 'peace', 'physics'];

let data_country_count = [];
d3.csv('/data/count_per-country-continent.csv').then(data => {
  data_country_count = data;
  callGraphs();
  // display_colors(data_country_count);
}).catch(error => {
  console.log(error);
});

// Get data per year, per sex
// d3.csv('/data/data_per-year_per-sex.csv').then(data => {
//   // callOverview(data);
// }).catch(error => {
//   console.log(error);
// })

// Call overview graphe function and prepare data for other graphes
function callGraphs() {
  const dataOverview = d3.csv('/data/nobels_overview.csv').then(data => {
    const dataYearSex = prepareSexPerYearData(data);
    const dataCategorySex = prepareSexPerCategoryData(data);

    getOuterRadius(data);
    generateOverview(data, categories, dataYearSex, dataCategorySex);
  }).catch(error => {
    console.log(error);
  });
}

// Prepare data for the sex per year graph
function prepareSexPerYearData(data) {
  const yearMin = 1900;
  const yearMax = d3.max(data, d => d.year);
  
  // Generate the initial array
  let dataYearSex = [];
  for (let i = yearMin; i <= yearMax; i++) {
    dataYearSex.push({
      year: i,
      sum_men: 0,
      sum_women: 0,
    });
  }

  // Fill the array with data
  data.forEach(nobel => {
    const index = dataYearSex.findIndex(data => data.year === parseInt(nobel.year));
    nobel.sex === 'Male' ? dataYearSex[index].sum_men += 1 : dataYearSex[index].sum_women += 1;
  });
  return dataYearSex;
}

// Prepare data for the sex per category graph
function prepareSexPerCategoryData(data) {

  // Generate the initial array
  let dataCategorySex = [];
  categories.forEach(category => {
    dataCategorySex.push({
      category: category,
      sum_men: 0,
      sum_women: 0,
    })
  });

  // Fill the array with data
  data.forEach(nobel => {
    const index = dataCategorySex.findIndex(data => data.category === nobel.category.toLowerCase());
    nobel.sex === 'Male' ? dataCategorySex[index].sum_men += 1 : dataCategorySex[index].sum_women += 1;
  });
  return dataCategorySex;
}
