"use client"
import { useState, useEffect, useRef } from 'react'

// Declare Twitter widgets for TypeScript
declare global {
  interface Window {
    twttr: {
      widgets: {
        load: () => void;
        createTweet: (tweetId: string, container: HTMLElement, options?: object) => Promise<HTMLElement>;
      };
    };
  }
}

// Twitter links will be passed as props

const TwitterCard = ({ url, index }: { url: string; index: number }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const getTweetId = (url: string) => {
    const match = url.match(/status\/(\d+)/);
    return match ? match[1] : null;
  };

  const tweetId = getTweetId(url);
  
  useEffect(() => {
    if (!tweetId || !containerRef.current) return;
    
    let isMounted = true;
    const currentContainer = containerRef.current;
    
    const loadTweet = async () => {
      try {
        if (window.twttr && window.twttr.widgets && currentContainer && isMounted) {
          // Create a fresh container for the tweet
          const tweetContainer = document.createElement('div');
          currentContainer.appendChild(tweetContainer);
          
          await window.twttr.widgets.createTweet(tweetId, tweetContainer, {
            theme: 'light',
            width: 350,
            align: 'center',
            conversation: 'none',
            cards: 'hidden'
          });
          
          if (isMounted) {
            setIsLoaded(true);
            setError(false);
          }
        }
      } catch (err) {
        console.error('Error loading tweet:', err);
        if (isMounted) {
          setError(true);
          setIsLoaded(false);
        }
      }
    };

    // Add a small delay to prevent overwhelming the API
    const timeoutId = setTimeout(loadTweet, index * 200);
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      
      // Clean up the container
      if (currentContainer) {
        try {
          currentContainer.innerHTML = '';
        } catch {
          // Ignore cleanup errors
        }
      }
    };
  }, [tweetId, index]);
  
  return (
    <div ref={cardRef} className="flex-shrink-0 w-[320px] sm:w-[380px] md:w-[420px] lg:w-[450px] bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#81D7B4]/10 rounded-full blur-2xl"></div>
      <div className="relative z-10 p-4">
        {tweetId ? (
          <div ref={containerRef} className="tweet-container min-h-[150px] max-h-[400px] w-full overflow-hidden">
            {!isLoaded && !error && (
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-[#81D7B4] rounded-full mx-auto mb-2"></div>
                <p className="text-gray-500">Loading tweet...</p>
              </div>
            )}
            {error && (
              <div className="text-center p-4">
                <p className="text-gray-500 mb-2">Failed to load tweet</p>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-[#81D7B4] hover:underline">
                  View on X
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-500">Unable to load tweet</p>
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-[#81D7B4] hover:underline">
              View on X
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const TwitterFeed = ({ links }: { links: string[] }) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tweetsLoaded, setTweetsLoaded] = useState(false);

  useEffect(() => {
    // Load Twitter widgets script only when component mounts
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.onload = () => {
      if (window.twttr) {
        window.twttr.widgets.load();
        setTweetsLoaded(true);
      }
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      const existingScript = document.querySelector('script[src="https://platform.twitter.com/widgets.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  useEffect(() => {
    if (!tweetsLoaded) return;
    
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let animationFrameId: number;
    const scroll = () => {
      if (!isHovered) {
        scroller.scrollLeft += 0.5;
        if (scroller.scrollLeft >= scroller.scrollWidth / 2) {
          scroller.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHovered, tweetsLoaded]);

  const duplicatedLinks = [...links, ...links];

  return (
    <div
      ref={scrollerRef}
      className="relative w-full overflow-x-auto scrollbar-hide [mask-image:_linear_gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex w-max gap-6 pb-4">
        {duplicatedLinks.map((url, index) => (
          <TwitterCard key={index} url={url} index={index} />
        ))}
      </div>
    </div>
  );
};

export default TwitterFeed;