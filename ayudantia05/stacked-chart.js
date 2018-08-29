const margin = {top: 20, right: 165, bottom: 20, left: 30};

const WIDTH = 960,
    HEIGHT = 500;

const width =  WIDTH - margin.left - margin.right,
    height = HEIGHT - margin.top - margin.bottom;

const countries = ['Venezuela', 'Peru', 'Argentina', 'Colombia'];

const svg = d3.select('body')
    .append('svg')
        .attr('width', WIDTH)
        .attr('height', HEIGHT)
    .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

d3.json('./stacked-data.json').then(data => {
        
        // Esto retorna un objeto Stack en d3, todavia no se realiza la transformación
        // de la data. 
        const stack = d3.stack()
                    .keys(countries)
                    .order(d3.stackOrderNone)
                    .offset(d3.stackOffsetNone);

        console.log(stack);

        const series = stack(data);
        
        console.log(series);

        const xScale = d3.scaleBand()
                    .rangeRound([0, width])
                    .domain(data.map(d => d.year))
                    .paddingInner(0.1);

        console.log(xScale('2011'));
        console.log(xScale('2014'));

        const maxPopulation = d3.max(series.flat(2));

        const yScale = d3.scaleLinear()
                        .range([height, 0])
                        .domain([0, maxPopulation * 1.1]);

        const colorScale = d3.scaleOrdinal()
                            .domain(countries)
                            // .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b'])
                            .range(d3.schemeCategory10.slice(1,6));
        
        svg.selectAll('.serie')
            .data(series)
            .enter().append('g')
                .attr('class', 'serie')
                .attr('fill', d => colorScale(d.key))
            .selectAll('rect')
                .data(d => d)
                .enter().append('rect')
                    .attr('x', d => xScale(d.data.year))
                    .attr('y', d => yScale(d[1]))
                    .attr('height', d => yScale(d[0]) - yScale(d[1]))
                    .attr('width', xScale.bandwidth());

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale).ticks(10, 's');

        svg.append('g')
                .attr('class', 'axis axis--x')
                .attr('transform', `translate(0,${height})`)
                .call(xAxis)

        svg.append('g')
                .attr('class', 'axis axis--y')
                .call(yAxis)
            // .append('text')
            //     .attr('x', 0)
            //     .attr('y', yScale)
            //     .attr('dy', '0.35em')
            //     .attr('text-anchor', 'start')
            //     .attr('fill', '#000')
            //     .attr('text', "Población')

        const legend = svg.selectAll('.legend')
            .data(countries)
            .enter().append('g')
                .attr('class', 'legend')
                .attr('transform', (d,i) => `translate(0,${i * 20})`)
                .style('font', '10px sans-serif');
        
        legend.append('rect')
            .attr('x', width + 18)
            .attr('width', 18)
            .attr('height', 18)
            .attr('fill', colorScale);
  
        legend.append('text')
            .attr('x', width + 44)
            .attr('y', 9)
            .attr('dy', '.35em')
            .attr('text-anchor', 'start')
            .text(d => d);
            

    });
