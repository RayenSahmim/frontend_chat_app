import React, { useState } from 'react';
import { Layout, Grid, FlipHorizontal, MonitorUp } from 'lucide-react';

export type LayoutType = 'pip' | 'grid' | 'left' | 'right';

interface LayoutControlsProps {
  currentLayout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
}

const LayoutControls: React.FC<LayoutControlsProps> = ({ currentLayout, onLayoutChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLayoutChange = (layout: LayoutType) => {
    onLayoutChange(layout);
    setIsOpen(false);
  };

  return (
    <div className="absolute top-4 right-4 z-50">
      <div className="relative">
        <button 
          onClick={toggleMenu}
          className={`bg-[#202225] hover:bg-[#2f3136] text-[#dcddde] p-2 rounded-lg shadow-lg transition-colors ${
            isOpen ? 'bg-[#2f3136]' : ''
          }`}
        >
          <Layout className="w-5 h-5" />
        </button>
        
        {isOpen && (
          <>
            <div 
              className="fixed inset-0" 
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-48 bg-[#18191c] rounded-lg shadow-xl">
              <div className="p-2 space-y-1">
                <button
                  onClick={() => handleLayoutChange('pip')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md ${
                    currentLayout === 'pip' ? 'bg-[#4f545c]' : 'hover:bg-[#2f3136]'
                  }`}
                >
                  <MonitorUp className="w-4 h-4" />
                  <span className="text-sm text-[#dcddde]">Picture in Picture</span>
                </button>
                
                <button
                  onClick={() => handleLayoutChange('grid')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md ${
                    currentLayout === 'grid' ? 'bg-[#4f545c]' : 'hover:bg-[#2f3136]'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  <span className="text-sm text-[#dcddde]">Grid View</span>
                </button>
                
                <button
                  onClick={() => handleLayoutChange('left')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md ${
                    currentLayout === 'left' ? 'bg-[#4f545c]' : 'hover:bg-[#2f3136]'
                  }`}
                >
                  <FlipHorizontal className="w-4 h-4 transform -rotate-90" />
                  <span className="text-sm text-[#dcddde]">Focus Left</span>
                </button>
                
                <button
                  onClick={() => handleLayoutChange('right')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md ${
                    currentLayout === 'right' ? 'bg-[#4f545c]' : 'hover:bg-[#2f3136]'
                  }`}
                >
                  <FlipHorizontal className="w-4 h-4 transform rotate-90" />
                  <span className="text-sm text-[#dcddde]">Focus Right</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LayoutControls;