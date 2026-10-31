import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export default function PullToRefresh({ onRefresh, children, enabled = true, threshold = 80 }) {
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const touchStartY = useRef(0);
  const containerRef = useRef(null);

  const handleTouchStart = (e) => {
    if (!enabled || refreshing) return;
    const container = containerRef.current;
    if (!container) return;
    
    // Only trigger if scrolled to top
    if (container.scrollTop <= 0) {
      touchStartY.current = e.touches[0].clientY;
      setPulling(true);
    }
  };

  const handleTouchMove = (e) => {
    if (!pulling || !enabled || refreshing) return;
    const container = containerRef.current;
    if (!container || container.scrollTop > 0) {
      setPulling(false);
      setPullDistance(0);
      return;
    }

    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - touchStartY.current);
    
    // Add resistance: pull distance grows slower the further you pull
    const resistance = 0.5;
    const dampened = distance * resistance;
    
    setPullDistance(Math.min(dampened, threshold * 1.5));
    
    // Prevent default scrolling when pulling down
    if (distance > 10) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = async () => {
    if (!pulling || !enabled) return;
    setPulling(false);

    if (pullDistance >= threshold && !refreshing) {
      setRefreshing(true);
      setPullDistance(threshold);
      
      try {
        if (onRefresh) {
          await onRefresh();
        }
      } catch (error) {
        console.error('Pull to refresh error:', error);
      } finally {
        // Smooth collapse animation
        setTimeout(() => {
          setPullDistance(0);
          setRefreshing(false);
        }, 300);
      }
    } else {
      setPullDistance(0);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pulling, pullDistance, refreshing, enabled]);

  const progress = Math.min(100, (pullDistance / threshold) * 100);

  return (
    <div className="relative h-full overflow-hidden">
      {/* Pull indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200 ease-out z-10 pointer-events-none"
        style={{
          height: Math.min(pullDistance, threshold * 1.2),
          opacity: pullDistance > 10 ? 1 : 0
        }}
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
          <RefreshCw
            className={`w-5 h-5 text-blue-600 transition-transform ${refreshing ? 'animate-spin' : ''}`}
            style={{
              transform: refreshing ? '' : `rotate(${progress * 3.6}deg)`
            }}
          />
          <span className="text-sm font-medium text-slate-700">
            {refreshing ? 'Refreshing...' : pullDistance >= threshold ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </div>
      </div>

      {/* Scrollable content */}
      <div
        ref={containerRef}
        className="h-full overflow-y-auto scroll-container"
        style={{
          transform: refreshing ? `translateY(${threshold}px)` : `translateY(${pullDistance}px)`,
          transition: refreshing || !pulling ? 'transform 0.2s ease-out' : 'none'
        }}
      >
        {children}
      </div>
    </div>
  );
}