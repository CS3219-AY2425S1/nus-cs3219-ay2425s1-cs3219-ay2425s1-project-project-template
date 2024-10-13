import React from 'react';

type ProblemProps = {};

const Problem: React.FC<ProblemProps> = () => {
    return (
        <div className="flex flex-col h-screen p-4">
            {/* Title bar for the problem */}
            <div className="workspacecomponent">
                <h2 className="text-xl font-semibold text-gray-800">Problem</h2>
            </div>
            {/* Problem content */}
            <div className="flex-grow p-6 bg-white rounded-b-lg shadow-sm">
                <p className="text-gray-700">Problem details will go here...</p>
            </div>
        </div>
    );
};

export default Problem;
