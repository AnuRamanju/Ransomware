
import { useEffect, useState, useRef } from 'react';
import { Database, BrainCircuit, Bell, FileText } from 'lucide-react';

interface StepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
  isVisible: boolean;
  isLast?: boolean;
}

const Step = ({ icon, title, description, index, isVisible, isLast = false }: StepProps) => {
  return (
    <div className={`flex flex-col items-center transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{ transitionDelay: `${index * 200}ms` }}>
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-cyber-blue/10 border border-cyber-blue/30 flex items-center justify-center mb-4">
          {icon}
        </div>
        {!isLast && (
          <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-cyber-blue/50 to-transparent transform translate-y-px"></div>
        )}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400 text-center max-w-xs">{description}</p>
    </div>
  );
};

const HowItWorksSection = () => {
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

  const steps = [
    {
      icon: <Database className="h-6 w-6 text-cyber-blue" />,
      title: 'Honeypot Deployment',
      description: 'Strategically placed decoy systems attract ransomware and malicious activities for analysis.',
    },
    {
      icon: <BrainCircuit className="h-6 w-6 text-cyber-blue" />,
      title: 'AI Analysis',
      description: 'Deep learning models analyze behavior patterns to identify ransomware and potential threats.',
    },
    {
      icon: <Bell className="h-6 w-6 text-cyber-blue" />,
      title: 'Alert Generation',
      description: 'When suspicious activity is detected, instant alerts are triggered for immediate response.',
    },
    {
      icon: <FileText className="h-6 w-6 text-cyber-blue" />,
      title: 'Logging & Reporting',
      description: 'Comprehensive logs and reports provide insights for future threat prevention and analysis.',
    },
  ];

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-20 bg-cyber-dark overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 40% 60%, rgba(59, 130, 246, 0.3) 0%, rgba(15, 23, 42, 0) 40%)`,
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="mb-6 inline-block">
            <div className="bg-cyber-blue/10 text-cyber-blue px-4 py-1 rounded-full text-sm font-semibold">
              How It Works
            </div>
          </div>
          
          <h2 className={`text-3xl sm:text-4xl font-bold leading-tight mb-6 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            The Protection Process
          </h2>
          
          <p className={`text-gray-300 max-w-2xl mx-auto transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
            Our four-step approach provides continuous protection against ransomware threats through an automated, AI-driven workflow.
          </p>
        </div>
        
        {/* Desktop process */}
        <div className="hidden md:flex justify-between items-start max-w-5xl mx-auto mb-16">
          {steps.map((step, index) => (
            <Step
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
              index={index}
              isVisible={isVisible}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
        
        {/* Mobile process (vertical) */}
        <div className="md:hidden space-y-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className={`flex items-start transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{ transitionDelay: `${index * 200}ms` }}>
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 rounded-full bg-cyber-blue/10 border border-cyber-blue/30 flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="absolute top-12 left-6 h-12 border-l border-dashed border-cyber-blue/30"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
