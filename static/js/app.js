
function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  const sampleMetadadaJsonPromise = d3.json("/metadata/"+sample);

  // Use d3 to select the panel with id of `#sample-metadata`
  const metadataPanel = d3.select("#sample-metadata");

  // Use `.html("") to clear any existing metadata
  metadataPanel.html("");

  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.

  sampleMetadadaJsonPromise.then(sampleJson => {
    Object.entries(sampleJson).forEach(
      entry => metadataPanel.append("p")
                            .attr("style","font-size:12px")
                            .text(entry[0]+": "+entry[1])
      );

    } 
  );

  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);
  
}

async function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
    samplesJsonPromise = await d3.json("/samples/"+sample);

    // @TODO: Build a Bubble Chart using the sample data

    const trace = {
      x: samplesJsonPromise.otu_ids,
      y: samplesJsonPromise.sample_values,
      mode: "markers",
      marker: {
        size: samplesJsonPromise.sample_values,
        sizeref: 2.0 * Math.max(...samplesJsonPromise.sample_values) / (15.5**2),
        color: samplesJsonPromise.otu_ids,
        colorscale: 'Earth'
      },
      text: samplesJsonPromise.otu_labels
    };

    const data = [trace];

    const layout = {
      margin:{
        l: 40,
        t: 0
      },
      xaxis: {
        title: 'OTU ID'
      },
      hovermode: "closest"
    };

    Plotly.newPlot('bubble', data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    const pieTrace = {
      values: samplesJsonPromise.sample_values.slice(0,10),
      labels: samplesJsonPromise.otu_ids.slice(0,10),
      hovertext: samplesJsonPromise.otu_labels.slice(0,10),
      hoverinfo: 'text',
      type: 'pie'
    };

    const pieData = [pieTrace];

    const pieLayout = {
      margin:{
        l: 0,
        t: 0
      }
    };

    Plotly.newPlot('pie', pieData, pieLayout);
  
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  
  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
