import React from "react";

const ShimmerEffect: React.FC = () => {
  return (
    <div className="bg-black min-h-screen p-8">
      <div className="animate-pulse rounded-xl p-6 h-full">
        {/* Individual Stats Shimmer Effect */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="animate-pulse bg-gradient-to-r from-gray-300 to-gray-400 h-24 rounded-xl w-full">
            <div className="h-full flex flex-col justify-between p-4">
              <div className="h-6 bg-gray-300 rounded-md mb-2"></div>
              <div className="h-4 bg-gray-300 rounded-md"></div>
            </div>
          </div>
          <div className="animate-pulse bg-gradient-to-r from-gray-300 to-gray-400 h-24 rounded-xl w-full">
            <div className="h-full flex flex-col justify-between p-4">
              <div className="h-6 bg-gray-300 rounded-md mb-2"></div>
              <div className="h-4 bg-gray-300 rounded-md"></div>
            </div>
          </div>
          <div className="animate-pulse bg-gradient-to-r from-gray-300 to-gray-400 h-24 rounded-xl w-full">
            <div className="h-full flex flex-col justify-between p-4">
              <div className="h-6 bg-gray-300 rounded-md mb-2"></div>
              <div className="h-4 bg-gray-300 rounded-md"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="animate-pulse bg-gradient-to-r from-gray-300 to-gray-400 h-24 rounded-xl w-full">
            <div className="h-full flex flex-col justify-between p-4">
              <div className="h-6 bg-gray-300 rounded-md mb-2"></div>
              <div className="h-4 bg-gray-300 rounded-md"></div>
            </div>
          </div>
          <div className="animate-pulse bg-gradient-to-r from-gray-300 to-gray-400 h-24 rounded-xl w-full">
            <div className="h-full flex flex-col justify-between p-4">
              <div className="h-6 bg-gray-300 rounded-md mb-2"></div>
              <div className="h-4 bg-gray-300 rounded-md"></div>
            </div>
          </div>
          <div className="animate-pulse bg-gradient-to-r from-gray-300 to-gray-400 h-24 rounded-xl w-full">
            <div className="h-full flex flex-col justify-between p-4">
              <div className="h-6 bg-gray-300 rounded-md mb-2"></div>
              <div className="h-4 bg-gray-300 rounded-md"></div>
            </div>
          </div>
        </div>

        {/* Action Buttons Shimmer Effect */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="animate-pulse bg-gradient-to-r from-gray-300 to-gray-400 h-40 rounded-xl w-full">
            <div className="h-full flex justify-center items-center p-6">
              <div className="w-24 h-6 bg-gray-300 rounded-md"></div>
            </div>
          </div>
          <div className="animate-pulse bg-gradient-to-r from-gray-300 to-gray-400 h-40 rounded-xl w-full">
            <div className="h-full flex justify-center items-center p-6">
              <div className="w-24 h-6 bg-gray-300 rounded-md"></div>
            </div>
          </div>
        </div>

        {/* Transaction Shimmer Effect */}
        <div className="animate-pulse bg-gradient-to-r from-gray-300 to-gray-400 h-12 w-full mb-6 rounded-xl">
          <div className="h-full flex justify-between items-center p-4">
            <div className="h-4 w-1/2 bg-gray-300 rounded-md"></div>
            <div className="h-4 w-1/4 bg-gray-300 rounded-md"></div>
          </div>
        </div>
        <div className="animate-pulse bg-gradient-to-r from-gray-300 to-gray-400 h-12 w-full mb-6 rounded-xl">
          <div className="h-full flex justify-between items-center p-4">
            <div className="h-4 w-1/2 bg-gray-300 rounded-md"></div>
            <div className="h-4 w-1/4 bg-gray-300 rounded-md"></div>
          </div>
        </div>
        <div className="animate-pulse bg-gradient-to-r from-gray-300 to-gray-400 h-12 w-full mb-6 rounded-xl">
          <div className="h-full flex justify-between items-center p-4">
            <div className="h-4 w-1/2 bg-gray-300 rounded-md"></div>
            <div className="h-4 w-1/4 bg-gray-300 rounded-md"></div>
          </div>
        </div>  
        <div className="animate-pulse bg-gradient-to-r from-gray-300 to-gray-400 h-12 w-full mb-6 rounded-xl">
          <div className="h-full flex justify-between items-center p-4">
            <div className="h-4 w-1/2 bg-gray-300 rounded-md"></div>
            <div className="h-4 w-1/4 bg-gray-300 rounded-md"></div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ShimmerEffect;
