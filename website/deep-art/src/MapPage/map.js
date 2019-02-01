import Softmax from 'softmax-fn';

export default function setupPlotly(stateHolder, objIDs, firstID) {
    var Plotly = require('plotly.js-dist');
    const divName = 'myPlot'
    const myPlot = document.getElementById(divName);
    const d3 = Plotly.d3;
    //const nNeighbors = 5;
    const nNeighbors = objIDs.length;
    const firstGenID = firstID;
    const startCoords = [.7, .7];
    const minY = 0.1;
    const maxY = 1.3;
    const minX = 0.1;
    const maxX = 1.3;
    const TIME_TILL_CALL = 350;
    const CLOSE_DIST = .05;
    const thumbnailRoot = "https://deepartstorage.blob.core.windows.net/public/thumbnails4/";
    var lastTimeCalled = Date.now();

    const paintingIds = objIDs;
    const idToIndex = paintingIds.map((x,i) => [x,i]).reduce(function (map, obj) {
            map[obj[0]] = obj[1];
            return map;
        }, {});
    //Non randomed:
    //const locations = [[0.7,1.15], [1.15, 1.0], [1.2,.5], [0.9,.25], [.5, .25], [.2, .5], [.25, 1.0]]

    //Little bit of random:
    const locations = [[0.7-.05,1.15-.01], [1.15+.01, 1.0+.02], [1.2+.03,.5+.04], [0.9+.01,.25-.03], [.5-.02, .25+0.0], [.2+.02, .5+.03], [.25+.04, 1.0+.05]];

    const paintingUrls = paintingIds.map(id => thumbnailRoot + id.toString() + ".jpg");
    const imageProps = {
        "xref": "x",
        "yref": "y",
        "sizex": 0.2,
        "sizey": 0.2,
        "layer": "above",
        "xanchor": "center",
        "yanchor": "middle"
    };
    const images = paintingUrls.map((url, i) => Object.assign(
        {
            "source": url,
            "x": locations[i][0],
            "y": locations[i][1]
        }, imageProps));

    const data = [
        {
            x: locations.map(xy => xy[0]),
            y: locations.map(xy => xy[1]),
            mode: 'markers',
            type: 'scatter',
            hoverinfo: "none",
            layer: "below",
            marker: { size: 10, color: "#6A6A6A", symbol: "square" },
        },
        {
            x: [startCoords[0]],
            y: [startCoords[1]],
            mode: 'markers',
            type: 'scatter',
            hoverinfo: "none",
            name: 'primary',
            layer: "above",
            marker: {
                size: 15,
                color: 'rgb(0, 0, 0)',
                symbol: "square",
            },
        }
    ];

    const layout = {
        showlegend: false,
        shapes: getLinesToNeighbors(startCoords, locations),
        margin: { 'l': 0, 'r': 0, 't': 0, 'b': 0 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        xaxis: { range: [minX, maxX], fixedrange: true, showgrid: false },
        yaxis: { range: [minY, maxY], fixedrange: true, showgrid: false },
        images: images,
        autosize: true
    };

    /* ---------------------------------------------------------------------------
     * ---------------------------MAIN METHOD CALLS-------------------------------
     * ---------------------------------------------------------------------------
     */


    populateImageSeeds(paintingIds);
    firstTimeGenImage(firstGenID);

    Plotly.plot(divName, data, layout,
        {
            showSendToCloud: true,
            responsive: true,
            displayModeBar: false
        }
    ).then(attach);


    /* ---------------------------------------------------------------------------
     * ---------------------------------------------------------------------------
     * ---------------------------------------------------------------------------
     */

    /**
   * Calls an API, sending a seed, and getting back an ArrayBuffer reprsenting that image
   * This function directly saves the image data and ArrayBuffer to state
   * @param {string} seedArr - string version of a 1xSEED_LENGTH array of floats between -1,1  
   * @param {Float[]} labelArr - data version of a 1000 length array of floats between 0,1
   */
    function getGenImage(seedArr, labelArr) {

        let labels = `[[${labelArr.toString()}]]`;
        const apiURL = 'https://methack-api.azure-api.net/biggan/labels?subscription-key=43d3f563ea224c4c990e437ada74fae8';
        const Http = new XMLHttpRequest();
        const data = new FormData();
        data.append('seed', seedArr);
        data.append('labels', labels);
        Http.responseType = "arraybuffer";
        Http.open("POST", apiURL);
        Http.send(data);
        Http.onreadystatechange = (e) => {
            if (Http.readyState === 4) {
                try {
                    let imgData = btoa(String.fromCharCode.apply(null, new Uint8Array(Http.response)));
                    stateHolder.setState({ genImg: imgData, genArr: Http.response });

                } catch (e) {
                    console.log('malformed request:' + Http.responseText);
                }
            }
        }
    }

    /**
     * Converts a 2D array string into a 1D array of floats
     * @param {string} arrayString - string version of a 1x? array of floats
     * @returns {Float[]} - The 1D float array from arrayString
     */
    function twoDArrayStringToOneDArray(arrayString) {
        let numbers = arrayString.substring(2, arrayString.length - 2); //cut off the "[[]]"
        let arrayNum = numbers.split(',').map(function (item) {
            return parseFloat(item);
        });
        return (arrayNum);
    }

    /**
    * Given a list of art ID's, direct sets 'images' state to be {id: {latents, labels}}
    * @param {Int[]} paintingIds - Array of art ID's
    */
    function populateImageSeeds(paintingIds){
        const imageToSeedUrl = "https://deepartstorage.blob.core.windows.net/public/inverted/biggan1/seeds/";
        var prealloc = [];
        paintingIds.forEach(function (id, i) {
            prealloc[i] = { latents: [], labels: [] };
            prealloc[i].latents = new Array(140).fill(0);
            prealloc[i].labels = new Array(1000).fill(0);
            stateHolder.setState({ images: prealloc });
        });

        paintingIds.forEach(function (id, i) {
            const Http = new XMLHttpRequest();
            Http.open("GET", imageToSeedUrl + id + ".json");
            Http.send();
            Http.onreadystatechange = (e) => {
                if (Http.readyState === 4) {
                    try {
                        const response = JSON.parse(Http.responseText);
                        const imagesString = JSON.stringify(stateHolder.state.images);
                        const imagesCopy = JSON.parse(imagesString);

                        imagesCopy[i] = { latents: [], labels: [] };
                        imagesCopy[i].latents = response.latents;
                        imagesCopy[i].labels = response.labels;

                        stateHolder.setState({ images: imagesCopy });
                    } catch {
                        console.log('malformed request:' + Http.responseText);
                    }
                }
            }
        })
    }

    /**
      * Sets up component state the first time for the selected image represented by id
      * @param {int} id - object ID of the initial piece of art to generate an image for
      */
    function firstTimeGenImage(id) {

        const baseMetUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/';
        const metApiUrl = baseMetUrl + id;

        const Http = new XMLHttpRequest();
        Http.open("GET", metApiUrl);
        Http.send();
        Http.onreadystatechange = (e) => {
            if (Http.readyState === 4) {
                try {
                    const response = JSON.parse(Http.responseText);
                    stateHolder.setState({
                        imgData: response.primaryImage,
                        apiData: response
                    })

                    const imageToSeedUrl = "https://deepartstorage.blob.core.windows.net/public/inverted/biggan1/seeds/";
                    const fileName = response.objectID.toString() + ".json";
                    const Http2 = new XMLHttpRequest();
                    Http2.open("GET", imageToSeedUrl + fileName);
                    Http2.send();
                    Http2.onreadystatechange = (e) => {
                        if (Http2.readyState === 4) {
                            try {
                                let response = JSON.parse(Http2.responseText);
                                let seed = [response.latents].toString();
                                seed = `[[${seed}]]`;
                                let label = response.labels;
                                stateHolder.setState({
                                    genSeed: twoDArrayStringToOneDArray(seed),
                                    genLabel: response.labels
                                });
                                getGenImage(seed, label);
                            } catch (err) {
                                console.log('malformed request:' + Http2.responseText);
                            }
                        }
                    }
                } catch (err) {;
                    console.log('malformed request:' + Http.responseText);
                }
            }
        }

    }

    /**
     * If a click is super close to a point, generates an image based on that point's object, then returns false
     * @param {int[]} ids - list of object IDs, in the same order as distances 
     * @param {float[]} distances - list of distances from click to points, in same order as ids
     */
    function checkIfNotSuperClose(ids, distances){
        let isNotSuperClose = true;
        for (let i = 0; i < distances.length; i++){
            if (distances[i] < CLOSE_DIST){
                isNotSuperClose = false;
                firstTimeGenImage(ids[i]);
            }
        }
        return isNotSuperClose;
    }

    /**
       * Given an object of neighbors and their index and distance, returns a label and latent representing a generated image
       * @param {Int[]} ids: is array of obj ids,
       * @param {Float[]} distances: are the distances to those,
       * of the closest neighbors to a click, where the number of neighbors taken  were decided earlier in the stack
       */
    function interpolateAndSet(ids, distances) {

        if (checkIfNotSuperClose(ids, distances)) {
            const ratios = Softmax(scalarMultiplyVector(distances, -5));
            //console.log(ratios);
            let totalLatent = new Array(140).fill(0);
            let totalLabel = new Array(1000).fill(0);
            ratios.forEach(function (r, i) {
                const index = idToIndex[ids[i]];
    
                const labels = stateHolder.state.images[index].labels;
                const latents = stateHolder.state.images[index].latents;
                totalLatent = addVector(totalLatent, scalarMultiplyVector(latents, r));
                totalLabel = addVector(totalLabel, scalarMultiplyVector(labels, r));
            });
    
            getGenImage(`[[${totalLatent.toString()}]]`, totalLabel);
        }


    }

    /**
     * adds two vectors of the same length together!
     * @param {Float[]} v1 - vector 1
     * @param {Float[]} v2 - vector 2
     */
    function addVector(v1, v2) {
        return v1.map((v, i) => v + v2[i]);
    }

    /**
     * Multiplies a vector by a scalar
     * @param {Float[]} vec 
     * @param {Float} scalar 
     */
    function scalarMultiplyVector(vec, scalar) {
        return vec.map(v => v * scalar)
    }

    /**
     * makes a line object from point to nn
     */
    function getLine(point, nn) {
        return {
            type: 'line',
            x0: point[0],
            y0: point[1],
            x1: nn[0],
            y1: nn[1],
            layer: "below",
            line: {
                color: 'rgba(200, 200, 200, .7)',
                width: 2
            }
        }
    };

    function getLinesToNeighbors(point, locations) {
        return getNearestNeighbors(point, locations).map(nn => getLine(point, nn))
    };

    function getLinesToNeighborsOnPlot(point) {
        return getNearestNeighborsOnPlot(point).map(nn => getLine(point, nn))
    };

    /**
     * Changes from mouse coords to plotly coords
     * @param {int} x - x coord in pixels of the mouse 
     * @param {int} y - y coord in pixels of the mouse 
     */
    function toPlotlyCoords(x, y) {
        const width = myPlot.clientWidth + 8;
        const height = myPlot.clientHeight + 8;
        const relX = (x - myPlot.offsetLeft) / width;
        const relY = (y - myPlot.offsetTop) / height;
        const plotlyX = relX * (maxX - minX) + minX;
        const plotlyY = (1.0 - relY) * (maxY - minY) + minY;
        return [plotlyX, plotlyY];
    }

    /**
     * updates the location of the main marker and updates the generated image periodically
     * @param {int[]} point - the point of the marker 
     */
    function updatePOI(point) {
        Plotly.restyle(divName, { 'x': [[point[0]]], 'y': [[point[1]]] }, 1);
        let roundedX = Math.round(1000.0*point[0])/1000.0;
        let roundedY = Math.round(1000.0*point[1])/1000.0;
        stateHolder.setState({
            cursorPoint: [roundedX,roundedY]
        });
        Plotly.relayout(divName, { 'shapes': getLinesToNeighborsOnPlot(point) });
        const distancesAndIds = getNearestNeighborsOnPlot(point).map(nn =>
            [calculateDistance(nn.slice(0, 2), point), paintingIds[nn[2]]]);
        const ids = distancesAndIds.map(p => p[1]);
        const distances = distancesAndIds.map(p => p[0]);

        const millisSinceLastCall = Date.now() - lastTimeCalled;
        if (millisSinceLastCall > TIME_TILL_CALL) {
            lastTimeCalled = Date.now();
            interpolateAndSet(ids, distances)
        }
    }

    function startDragBehavior() {
        const drag = d3.behavior.drag();
        drag.origin(function () {
            const transform = d3.select(this).attr("transform");
            const translate = transform.substring(10, transform.length - 1).split(/,| /);
            return { x: translate[0], y: translate[1] };
        });
        drag.on("drag", function () {
            updatePOI(toPlotlyCoords(d3.event.sourceEvent.pageX, d3.event.sourceEvent.pageY));
        });
        d3.selectAll(".scatterlayer .trace:last-of-type .points path").call(drag);
    }

    /**
     * gets the "nNeighbors" nearest neighbors of the current marker location
     * @param {int[]} plotlyCoords - coords of the marker
     * @param {int[][]} locations - list of image locations
     */
    function getNearestNeighbors(plotlyCoords, locations) {
        const xs = locations.map(p => p[0]);
        const ys = locations.map(p => p[1]);
        const distancesWithIndicies = xs.map((x, i) => [calculateDistance([x, ys[i]], plotlyCoords), i]);
        distancesWithIndicies.sort();
        const smallestIndicies = distancesWithIndicies.slice(0, nNeighbors).map(pair => pair[1])
        return smallestIndicies.map(i => [xs[i], ys[i], i])
    }

    function getNearestNeighborsOnPlot(plotlyCoords) {
        const xs = myPlot.data[0].x;
        const ys = myPlot.data[0].y;
        return getNearestNeighbors(plotlyCoords, xs.map((x, i) => [x, ys[i]]))
    }

    function calculateDistance(p1, p2) {
        return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
    }

    // function coordToObjID(plotlyCoord) {
    //     let index = locations.indexOf(plotlyCoord);
    //     console.log("INDEX: "+index);
    //     let ID = paintingIds[index];
    //     console.log("ID: "+ID);
    //     return ID
    // }


    function attach() {
        startDragBehavior()
        myPlot.addEventListener('click', function (evt) {
            updatePOI(toPlotlyCoords(evt.pageX, evt.pageY))
        });

        // myPlot.on('plotly_click', function(data) {
        //     //console.log(JSON.stringify(data.points));
        //     let coord = null;
        //     let index = null;

        //     let thing = data.points.map(point => (
        //         {pointNumber: point.pointNumber, x: point.x, y: point.y}
        //     ))
        //     console.log(JSON.stringify(thing));
        //     for (let i = data.points.length-1; i > -1; i--){
        //         coord = [data.points[i].x, data.points[i].y];
        //         index = data.points[i].pointNumber
        //     }
        //     console.log("INDEX: "+index);
        //     console.log("Coord: "+coord);
        //     //let id = coordToObjID(coord);
        //     let id = paintingIds[index];
        //     console.log("ID: "+id);
        //     firstTimeGenImage(id);
        // })
    };
}
