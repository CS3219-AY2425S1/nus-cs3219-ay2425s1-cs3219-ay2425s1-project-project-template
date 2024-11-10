import React from 'react';
import { Link } from 'react-router-dom';

function MatchingFailedPage() {

  return (
    <div className="h-[calc(100vh-65px)] w-full bg-[#1a1a1a] flex flex-col justify-start items-center">
      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center gap-5">
        <div className="self-stretch text-center text-white text-3xl font-bold leading-tight">
          Oh no! Seems like everyone is busy right now...
        </div>

        <div className="self-stretch text-center text-white text-3xl font-bold leading-tight">
          Would you like to try again?
        </div>

        {/* Cancel Button */}
        <div className="flex flex-row w-full justify-between">
          <Link to='/topic'>
            <button className="btn btn-secondary">
              Back
            </button>
          </Link>
          <Link to='/matching'>
            <button className="btn btn-primary">
              Rematch
            </button>
          </Link>
        </div>
      </main>
    </div>
  );

}

export default MatchingFailedPage;
