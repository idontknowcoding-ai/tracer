import React from 'react';
import './Sidebar.css';

const Sidebar = ({ scenarios, currentScenario, onSelectScenario }) => {
    return (
        <div className="sidebar">
            <h2 className="sidebar-title">Tracer</h2>
            <div className="sidebar-menu">
                {Object.entries(scenarios).map(([key, data]) => (
                    <button
                        key={key}
                        className={`sidebar-item ${currentScenario === key ? 'active' : ''}`}
                        onClick={() => onSelectScenario(key)}
                    >
                        {data.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
