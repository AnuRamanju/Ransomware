
import { useEffect, useState, useRef } from 'react';
import { Shield, Server, Lock, Database } from 'lucide-react';

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-20 bg-cyber-dark overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.3) 0%, rgba(15, 23, 42, 0) 40%)`,
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side: Text explaining the system */}
          <div className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="mb-6 inline-block">
              <div className="bg-cyber-blue/10 text-cyber-blue px-4 py-1 rounded-full text-sm font-semibold">
                About Our Solution
              </div>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight">
              An AI-driven Security Framework
            </h2>
            
            <p className="text-gray-300 mb-6">
              Our advanced cybersecurity platform combines honeypot technology with state-of-the-art deep learning models to detect, analyze, and neutralize ransomware threats before they can compromise your systems.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="mt-1 mr-4 flex-shrink-0 w-8 h-8 flex items-center justify-center bg-cyber-blue/10 rounded-full">
                  <Shield className="h-4 w-4 text-cyber-blue" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Proactive Protection</h3>
                  <p className="text-gray-400">Our honeypots act as decoys to attract and isolate ransomware, allowing our AI to analyze attack patterns in a safe environment.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mt-1 mr-4 flex-shrink-0 w-8 h-8 flex items-center justify-center bg-cyber-blue/10 rounded-full">
                  <Server className="h-4 w-4 text-cyber-blue" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Continuous Learning</h3>
                  <p className="text-gray-400">Our deep learning models continuously evolve to recognize new threat patterns and ransomware variants as they emerge.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mt-1 mr-4 flex-shrink-0 w-8 h-8 flex items-center justify-center bg-cyber-blue/10 rounded-full">
                  <Database className="h-4 w-4 text-cyber-blue" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Comprehensive Analytics</h3>
                  <p className="text-gray-400">Gain insights into attack vectors and protect your organization with detailed threat intelligence and reporting.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side: Cybersecurity illustration */}
          <div className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative">
              {/* Animated hexagon grid background */}
              <div className="absolute inset-0 z-0">
                <svg width="100%" height="100%" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="hexagonPattern" width="30" height="52" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
                      <path d="M10,17.32l5,8.66a10,10,0,0,0,10,0l5-8.66a10,10,0,0,0,0-10l-5-8.66a10,10,0,0,0-10,0l-5,8.66A10,10,0,0,0,10,17.32Z" fill="none" stroke="#3B82F6" strokeOpacity="0.2" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#hexagonPattern)" />
                </svg>
              </div>
              
              {/* Main illustration */}
              <div className="relative bg-cyber-darker p-6 rounded-lg border border-cyber-blue/20 shadow-lg shadow-cyber-blue/5 aspect-square max-w-md mx-auto overflow-hidden">
                {/* Central node */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-4 border-cyber-blue bg-cyber-blue/20 flex items-center justify-center z-20 animate-pulse-blue">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                
                {/* Connecting lines */}
                <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="200" cy="200" r="80" fill="none" stroke="#3B82F6" strokeOpacity="0.2" strokeWidth="1" />
                  <circle cx="200" cy="200" r="120" fill="none" stroke="#3B82F6" strokeOpacity="0.15" strokeWidth="1" />
                  <circle cx="200" cy="200" r="160" fill="none" stroke="#3B82F6" strokeOpacity="0.1" strokeWidth="1" />
                  
                  {/* Radial lines */}
                  {Array.from({ length: 8 }).map((_, i) => {
                    const angle = (i * Math.PI) / 4;
                    const x1 = 200;
                    const y1 = 200;
                    const x2 = 200 + Math.cos(angle) * 180;
                    const y2 = 200 + Math.sin(angle) * 180;
                    return (
                      <line 
                        key={i}
                        x1={x1} 
                        y1={y1} 
                        x2={x2} 
                        y2={y2} 
                        stroke="#3B82F6" 
                        strokeOpacity="0.2" 
                        strokeWidth="1"
                      />
                    );
                  })}
                  
                  {/* Moving dots */}
                  {Array.from({ length: 8 }).map((_, i) => {
                    const angle = (i * Math.PI) / 4;
                    const animationDelay = i * 0.5;
                    return (
                      <circle 
                        key={i}
                        cx="200" 
                        cy="200" 
                        r="2" 
                        fill="#3B82F6"
                        opacity="0.8"
                      >
                        <animateMotion
                          path={`M0,0 L${Math.cos(angle) * 160},${Math.sin(angle) * 160}`}
                          dur="3s"
                          repeatCount="indefinite"
                          begin={`${animationDelay}s`}
                        />
                      </circle>
                    );
                  })}
                </svg>
                
                {/* Glowing effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-cyber-blue opacity-10 blur-xl"></div>
                
                {/* Peripheral nodes */}
                {Array.from({ length: 8 }).map((_, i) => {
                  const angle = (i * Math.PI) / 4;
                  const x = 50 + Math.cos(angle) * 45 + "%";
                  const y = 50 + Math.sin(angle) * 45 + "%";
                  const animationDelay = i * 0.25;
                  
                  return (
                    <div 
                      key={i}
                      className="absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyber-dark border border-gray-600 flex items-center justify-center z-20"
                      style={{ 
                        left: x, 
                        top: y, 
                        animationDelay: `${animationDelay}s`,
                        animation: 'pulse-blue 3s infinite'
                      }}
                    >
                      <div className="h-2 w-2 rounded-full bg-cyber-blue"></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
