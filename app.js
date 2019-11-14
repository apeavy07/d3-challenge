// @TODO: YOUR CODE HERE!

let svgWidth = 1000;
let svgHeight = 500;
let margin = {
  top: 30,
  right: 40,
  bottom: 60,
  left: 125
};
let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

let svg = d3
  .select('#scatter')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);
let chartGroup = svg
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);
d3.csv('assets/data/data.csv').then(function(csvData) {
  csvData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  let xLinearScale = d3
    .scaleLinear()
    .domain([7, d3.max(csvData, d => d.poverty)])
    .range([0, width]);
  let yLinearScale = d3
    .scaleLinear()
    .domain([0, d3.max(csvData, d => d.healthcare)])
    .range([height, 0]);

  let bottomAxis = d3.axisBottom(xLinearScale);
  let leftAxis = d3.axisLeft(yLinearScale);

  chartGroup.append('g').call(leftAxis);
  chartGroup
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(bottomAxis);

  let circlesGroup = chartGroup
    .selectAll('circle')
    .data(csvData)
    .enter()
    .append('circle')
    .attr('cx', d => xLinearScale(d.poverty))
    .attr('cy', d => yLinearScale(d.healthcare))
    .attr('r', '15')
    .attr('fill', 'red');

  let toolTip = d3
    .tip()
    .attr('class', 'tooltip')
    .offset([80, -60])
    .html(function(d) {
      return `${d.state}<br>Poverty: ${d.poverty}<br>healthcare: ${d.healthcare}`;
    });

  chartGroup.call(toolTip);

  circlesGroup
    .on('mouseover', function(data) {
      toolTip.show(data, this);
    })

    .on('mouseout', function(data) {
      toolTip.hide(data);
    });

  chartGroup
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left + 40)
    .attr('x', 0 - height / 2)
    .attr('dy', '1em')
    .attr('class', 'axisText')
    .text('Lack of Healthcare');
  chartGroup
    .append('text')
    .attr('transform', `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr('class', 'axisText')
    .text('In Poverty');
});
