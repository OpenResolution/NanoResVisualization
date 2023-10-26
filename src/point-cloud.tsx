import React, { useState, useEffect } from 'react';
import * as THREE from 'three';

type PointCloudProps = {
    fileName: string;
};

export default function PointCloud({fileName}: PointCloudProps) {
    console.log(fileName)
    const [positions, setPositions] = useState(new Float32Array());
    const [colors, setColors] = useState(new Float32Array());

    useEffect(() => {
        async function loadData() {
            const fileContent = await fetch(fileName);
            console.log(fileContent)
            const data = await fileContent.text()
            const rows = data.split('\n');
            console.log(rows)

            const headers = rows[0].split(',');

            const csvData: Array<{ [key: string]: string }> = [];

            for (let i = 1; i < rows.length; i++) {
                const currentRow = rows[i].split(',');
                const rowData: { [key: string]: string } = {};

                for (let j = 0; j < headers.length; j++) {
                    rowData[headers[j].trim()] = currentRow[j];
                }

                csvData.push(rowData);
            }

            const pointsDataArray: number[] = [];
            csvData.forEach(e => {
                const x = parseFloat(e["x [nm]"]);
                const y = parseFloat(e["y [nm]"]);
                const z = parseFloat(e["z [nm]"]);
                if (isNaN(x) || isNaN(y) || isNaN(z))
                    return;

                pointsDataArray.push(x, y, z);
            });
            const dimensions = new Int32Array([pointsDataArray.length / 3, 3]);

            const pointsData = new Float32Array(pointsDataArray);

            const { positions, colors } = generatePointCloudFromData(pointsData, dimensions, true, 0.1);
            console.log(positions);
            console.log(colors);
            setPositions(positions);
            setColors(colors);
        }

        loadData();

    }, [fileName])

    return (
        <points>
            <bufferGeometry attach="geometry">
              <bufferAttribute
                  attach="attributes-position"
                  count={positions.length / 3}
                  array={positions}
                  itemSize={3}
                  usage={THREE.DynamicDrawUsage}
                />
                <bufferAttribute
                  attach="attributes-color"
                  count={colors.length / 3}
                  array={colors}
                  itemSize={3}
                  usage={THREE.DynamicDrawUsage}
                />
            </bufferGeometry>
            <pointsMaterial attach="material" vertexColors size={10} sizeAttenuation={false} />
        </points>
      ); 
}

function generatePointCloudFromData(pointsData: Float32Array, dimensions: Int32Array, framed = false, ticks: number) {
    const numPoints = dimensions[0];

    const positions = new Float32Array(numPoints * 3);
    const colors = new Float32Array(numPoints * 3);

    for (let i = 0; i < numPoints; i++) {
        positions[3 * i] = pointsData[dimensions[1] * i];
        positions[3 * i + 1] = pointsData[dimensions[1] * i + 1];
        positions[3 * i + 2] = pointsData[dimensions[1] * i + 2];
        switch (dimensions[1]) {
            // case 3:
            // 	colors[3*i] = 1;
            // 	colors[3*i+1] = 1;
            // 	colors[3*i+2] = 1;
            // 	break;
            case 4:
                colors[3 * i] = pointsData[dimensions[1] * i + 3];
                colors[3 * i + 1] = pointsData[dimensions[1] * i + 3];
                colors[3 * i + 2] = pointsData[dimensions[1] * i + 3];
                break;
            case 6:
                colors[3 * i] = pointsData[dimensions[1] * i + 3];
                colors[3 * i + 1] = pointsData[dimensions[1] * i + 4];
                colors[3 * i + 2] = pointsData[dimensions[1] * i + 5];
                break;
        }
    }

    // Rescale and center the geometry & color the particles based on coordinates
    let xMin = Infinity, xMax = -Infinity;
    let yMin = Infinity, yMax = -Infinity;
    let zMin = Infinity, zMax = -Infinity;
    for (let i = 0; i < numPoints; i++) {
        xMin = Math.min(xMin, positions[3 * i]);
        xMax = Math.max(xMax, positions[3 * i]);
        yMin = Math.min(yMin, positions[3 * i + 1]);
        yMax = Math.max(yMax, positions[3 * i + 1]);
        zMin = Math.min(zMin, positions[3 * i + 2]);
        zMax = Math.max(zMax, positions[3 * i + 2]);
    }
    const xRange = xMax - xMin;
    const yRange = yMax - yMin;
    const zRange = zMax - zMin;
    if (dimensions[1] == 3) {
        for (let i = 0; i < numPoints; i++) {
            const color = colormap((positions[3 * i + 2] - zMin) / zRange);

            colors[3 * i] = color[0];
            colors[3 * i + 1] = color[1];
            colors[3 * i + 2] = color[2];
        }
    }
    const xCenter = (xMax + xMin) / 2;
    const yCenter = (yMax + yMin) / 2;
    const zCenter = (zMax + zMin) / 2;
    const scale = 1. / Math.max(xRange, yRange, zRange);
    for (let i = 0; i < numPoints; i++) {
        positions[3 * i] = (positions[3 * i] - xCenter) * scale;
        positions[3 * i + 1] = (positions[3 * i + 1] - yCenter) * scale;
        positions[3 * i + 2] = (positions[3 * i + 2] - zCenter) * scale;
    }
    xMin = (xMin - xCenter) * scale;
    xMax = (xMax - xCenter) * scale;
    yMin = (yMin - yCenter) * scale;
    yMax = (yMax - yCenter) * scale;
    zMin = (zMin - zCenter) * scale;
    zMax = (zMax - zCenter) * scale;

    return {positions, colors};
}

function colormap(t: number) {
    const a = -2.;

    const color = new THREE.Color();

    // color.setHSL((1.-t)*0.66, 1., 0.5);  // HSL 2/3~0
    color.setHSL(2. / 3. * (1. - (a * (t - 0.5) ** 3 + (4. - a) / 4. * (t - 0.5) + 0.5)), 1., 0.55 + 0.15 * (1. - 8. * (t - 0.5) ** 2));  // Similar to Jet

    return [color.r, color.g, color.b];
}