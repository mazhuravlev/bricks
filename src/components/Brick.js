import React from 'react';

export default function ({ style, color }) {
    const orientationClass = style.width > style.height ? 'hor' : 'ver';
    return (<div className="testbrick" style={style}>
        <div className={orientationClass} style={{ backgroundColor: color }} />
    </div>);
}