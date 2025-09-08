
import { useEffect, useState, useRef } from 'react';
import { BrainCircuit, Lock, BarChart3, Bell, Shield, ServerCog } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
  isVisible: boolean;
}

const FeatureCard = ({ title, description, icon, delay, isVisible }: FeatureCardProps) => {
  return (
    <div 
      className={`feature-card transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} 
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="absolute -top-3 -left-3 w-12 h-12 rounded-full bg-cyber-blue/10 flex items-center justify-center border border-cyber-blue/30 z-10">
        {icon}
      </div>
      <div className="pt-8">
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  );
};

const FeaturesSection = () => {
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

  const features = [
    {
      title: 'AI-Powered Detection',
      description: 'Advanced neural networks trained to identify ransomware behavior patterns with high accuracy.',
      icon: <BrainCircuit className="h-6 w-6 text-cyber-blue" />,
    },
    {
      title: 'Honeypot Integration',
      description: 'Strategically placed decoy systems that attract and isolate malicious activities.',
      icon: <ServerCog className="h-6 w-6 text-cyber-blue" />,
    },
    {
      title: 'Real-time Monitoring Dashboard',
      description: 'Comprehensive visualization of system activity and threat detection in real-time.',
      icon: <BarChart3 className="h-6 w-6 text-cyber-blue" />,
    },
    {
      title: 'Instant Alert System',
      description: 'Immediate notifications when suspicious activities are detected to enable rapid response.',
      icon: <Bell className="h-6 w-6 text-cyber-blue" />,
    },
    {
      title: 'Secure User Authentication',
      description: 'Multi-factor authentication and role-based access control to ensure system integrity.',
      icon: <Lock className="h-6 w-6 text-cyber-blue" />,
    },
    {
      title: 'Threat Intelligence Sharing',
      description: 'Community-driven threat intelligence database to stay ahead of emerging threats.',
      icon: <Shield className="h-6 w-6 text-cyber-blue" />,
    },
  ];

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative py-20 bg-cyber-darker overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 80% 30%, rgba(59, 130, 246, 0.3) 0%, rgba(15, 23, 42, 0) 40%)`,
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="mb-6 inline-block">
            <div className="bg-cyber-blue/10 text-cyber-blue px-4 py-1 rounded-full text-sm font-semibold">
              Features
            </div>
          </div>
          
          <h2 className={`text-3xl sm:text-4xl font-bold leading-tight mb-6 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Advanced Protection Features
          </h2>
          
          <p className={`text-gray-300 max-w-2xl mx-auto transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
            Our platform integrates cutting-edge technology to provide comprehensive protection against ransomware and other cyber threats.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              delay={index * 100}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
