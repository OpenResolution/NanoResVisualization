// import { useRef, forwardRef } from "react";
import { extend, useFrame, useThree } from "@react-three/fiber"
// import{OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
// import CustomObject from "./CustomObject";
import PointCloud from './point-cloud';

// extend({OrbitControls});

export default function ParticlesVisualization()
{
    // const a = useRef<HTMLInputElement | null>();

    const {camera, gl} = useThree();

    // useFrame((state, dt) =>
    // {
    //     a.current.rotation.y += 1*dt;
    // });

    // interface ParticlesVisualizationPanelProps {
    //     a: string
    //     // Additional props can be added here if needed
    // }
    // const ParticlesVisualizationPanel = forwardRef<HTMLDivElement, ParticlesVisualizationPanelProps>((props, fref) => {
    //     return <PointCloud fileName='/data/Tubulin_15_cor_605332.csv' ref={a}/>;
    // });

    return <>
        {/* <orbitControls args={[camera, gl.domElement]}/> */}

        <PointCloud fileName='/data/Tubulin_15_cor_605332.csv'/>
    </>
}
