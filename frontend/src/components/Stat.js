import { useState } from 'react'

const Stat = ( props ) => {
    const [isHovered, setIsHovered] = useState(false);

    console.log(this);

    return <div className="stat" style={props.style} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        {/* { isHovered && (
        <div className="tooltip">
            <p>{props.text}</p>
        </div>
        )} */}
        <div className="tooltip">
            <p>{props.text}</p>
        </div>
        {props.children}
    </div>
};

export default Stat;