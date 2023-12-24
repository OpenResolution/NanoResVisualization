import React, { useState, forwardRef, MutableRefObject } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { View } from '@react-three/drei';
import useRefs from 'react-use-refs';
import { Mesh } from 'three'
import ParticlesVisualization from './partical_visualization';

// interface MainPanelProps {
//     a: string
//     // Additional props can be added here if needed
// }

// const MainPanel = forwardRef<HTMLDivElement, MainPanelProps>((props, fref) => {
//     return <div ref={fref} className="panel" style={{ gridArea: 'main' }}></div>;
// });

// interface SidePanelProps {
//     which: string;
// }

// const SidePanel = forwardRef<HTMLDivElement, SidePanelProps>(({ which }, fref) => {
//     return <div ref={fref} className="panel" style={{ gridArea: which }}></div>;
// });

export default function App() {
    const cameraPhi = 0.3*Math.PI;
    const cameraTheta = Math.PI / 6;
    const cameraDistance = 2;
    const [cameraPosition, setCameraPosition] = useState(new THREE.Vector3(
        cameraDistance * Math.cos(cameraTheta) * Math.cos(cameraPhi),
        cameraDistance * Math.sin(cameraTheta),
        cameraDistance * Math.cos(cameraTheta) * Math.sin(cameraPhi)
    ));
    // const cameraLookAt = new THREE.Vector3(0, 0, 0);

    // const [visualizer3DView, projectionView, controlPanelView] = useRefs<HTMLDivElement>(null);

    return (
        // <div className="container">
        <div className="full-screen-container">
            {/* <Canvas className="canvas">
                <View index={1} track={visualizer3DView as MutableRefObject<HTMLElement>}>
                    <PointCloud/>
                </View>
                <View index={2} track={projectionView as MutableRefObject<HTMLElement>}></View>
                <View index={3} track={controlPanelView as MutableRefObject<HTMLElement>}></View>
            </Canvas>

            <MainPanel ref={visualizer3DView} />
            <SidePanel ref={projectionView} which="top" />
            <SidePanel ref={controlPanelView} which="bottom" /> */}

            <Canvas
                camera={{
                    fov: 60,
                    // near: 0.0001,
                    // far: 100,
                    position: cameraPosition,
                    // rotation: [0, 0, 0]
                }}
            >
                <color attach="background" args={['black']}/>
                <ParticlesVisualization />
            </Canvas>
        </div>
    );
}