
import { useEffect, useState, useRef } from 'react';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const TypingEffect = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (currentIndex < text.length && isTyping) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100);

      return () => clearTimeout(timeout);
    } else if (currentIndex >= text.length) {
      setIsTyping(false);
      const timeout = setTimeout(() => {
        setDisplayText('');
        setCurrentIndex(0);
        setIsTyping(true);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, isTyping]);

  return (
    <div className="h-8 sm:h-10">
      <div className="typing-container">
        {displayText}
      </div>
    </div>
  );
};

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      if (sectionRef.current) {
        const scrollY = window.scrollY;
        const parallaxValue = scrollY * 0.5;
        if (sectionRef.current) {
          sectionRef.current.style.backgroundPositionY = `${parallaxValue}px`;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center bg-cyber-darker overflow-hidden"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, rgba(15, 23, 42, 0) 50%)`,
      }}
    >
      {/* Background grid */}
      <div 
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Glowing circles */}
      <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyber-blue opacity-5 blur-3xl transition-opacity duration-1000 ${isVisible ? 'opacity-5' : 'opacity-0'}`} />
      <div className={`absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-cyber-purple opacity-5 blur-3xl transition-opacity duration-1000 ${isVisible ? 'opacity-5' : 'opacity-0'}`} />

      {/* Content */}
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <div className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-cyber-blue/10 rounded-full border border-cyber-blue/30 animate-pulse-blue">
                <Shield className="h-8 w-8 text-cyber-blue" />
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              <span className="cyber-gradient-text glow">Ransomware Behaviour</span><br />
              <span>Monitoring through Honeypots</span>
            </h1>
            
            <div className="text-xl sm:text-2xl text-gray-300 mb-8">
              <TypingEffect text="Powered by AI. Protected by Deep Learning. Secured by You." />
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
              <Link to="/signin" className="cyber-btn text-base">
                Sign In
              </Link>
              <Link to="/signup" className="cyber-btn-primary text-base">
                Get Started
              </Link>
            </div>
          </div>

          <div className={`mt-16 transition-all duration-1000 delay-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="p-1.5 rounded-lg bg-gradient-to-r from-cyber-blue/20 to-cyber-purple/20 backdrop-blur-sm">
              <div className="rounded bg-cyber-darker p-4 sm:p-6">
                <p className="text-sm text-gray-400 mb-2">Active Threat Monitoring</p>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2 items-center">
                    <div className="h-2 w-2 rounded-full bg-cyber-blue animate-pulse"></div>
                    <span className="text-sm text-cyber-blue">14 Honeypots Active</span>
                  </div>
                  <div className="flex space-x-2 items-center">
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-sm text-red-400">3 Threats Detected Today</span>
                  </div>
                  <div className="hidden sm:flex space-x-2 items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm text-green-400">System Protected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cyber-dark to-transparent"></div>
    </section>
  );
};

export default HeroSection;
