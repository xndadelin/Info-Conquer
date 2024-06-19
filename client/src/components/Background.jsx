import { CircleNodes } from "../utils/CircleNodes"
import { Code } from "../utils/Code"
import { Gears } from "../utils/Gears"
import { Network } from "../utils/Network"
import { Terminal } from "../utils/Terminal"

export const Background = () => {
    return (
        <div className="background fixed w-full h-full bg-black">
            <Code/>
            <div className="glow-red top-[50%] fixed w-[300px] h-[300px]"></div>
            <CircleNodes/>    
            <div className="glow-white blur-3xl right-0 top-[20%] fixed w-[300px] h-[300px]"></div>
            <Terminal/>
            <Network/>
            <Gears/>
        </div>
    )
}