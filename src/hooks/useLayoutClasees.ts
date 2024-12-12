import { LayoutType } from '../components/LayoutControls';

export const useLayoutClasses = (layout: LayoutType) => {
  switch (layout) {
    case 'grid':
      return {
        container: 'grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 h-[calc(100vh-8rem)]',
        remote: 'w-full aspect-video lg:aspect-auto h-[calc(50vh-2rem)] lg:h-full',
        local: 'w-full aspect-video lg:aspect-auto h-[calc(50vh-2rem)] lg:h-full'
      };
    case 'left':
      return {
        container: 'flex flex-col lg:flex-row p-4 gap-4 h-[calc(100vh-8rem)]',
        remote: 'flex-1 lg:flex-none lg:w-1/3 aspect-video lg:aspect-auto h-[calc(50vh-2rem)] lg:h-[calc(100vh-8rem)]',
        local: 'flex-1 lg:w-2/3 aspect-video lg:aspect-auto h-[calc(50vh-2rem)] lg:h-[calc(100vh-8rem)]'
      };
    case 'right':
      return {
        container: 'flex flex-col-reverse lg:flex-row-reverse p-4 gap-4 h-[calc(100vh-8rem)]',
        remote: 'flex-1 lg:flex-none lg:w-1/3 aspect-video lg:aspect-auto h-[calc(50vh-2rem)] lg:h-[calc(100vh-8rem)]',
        local: 'flex-1 lg:w-2/3 aspect-video lg:aspect-auto h-[calc(50vh-2rem)] lg:h-[calc(100vh-8rem)]'
      };
    default: // pip (Picture-in-Picture)
      return {
        container: 'relative w-full h-auto',
        remote: 'w-full h-auto aspect-video',
        local: 'absolute bottom-4 right-4 w-32 h-24 sm:w-48 sm:h-32 lg:w-64 lg:h-48 z-10 shadow-lg border border-gray-300 rounded-lg bg-white'
      };
  }
};
