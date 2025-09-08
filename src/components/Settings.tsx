
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { 
  Bell, Moon, Sun, RefreshCw, 
  Clock, ChevronDown,
  Server, Database
} from 'lucide-react';

// Import honeypot logs JSON
// import honeypotLogsData from '@/data/honeypotLogs.json';


const Settings = ({ onClose }: { onClose: () => void }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(false);
  const [refreshRate, setRefreshRate] = useState("5");
  const [language, setLanguage] = useState("english");
  const [dataRetention, setDataRetention] = useState("30");
  const [advancedSectionOpen, setAdvancedSectionOpen] = useState(false);

// New state for honeypot logs
  // const [honeypotLogs, setHoneypotLogs] = useState<any[]>([]);

 // Load the honeypot logs on component mount
  // useEffect(() => {
  //   setHoneypotLogs(honeypotLogsData);
  // }, []);

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully."
    });
    onClose();
  };

  const handleResetDefaults = () => {
    setDarkMode(true);
    setNotifications(true);
    setAutoBackup(false);
    setRefreshRate("5");
    setLanguage("english");
    setDataRetention("30");
    
    toast({
      title: "Settings reset",
      description: "All settings have been reset to default values."
    });
  };

  const toggleAdvancedSection = () => {
    setAdvancedSectionOpen(!advancedSectionOpen);
  };

  return (
    <div className="p-6 max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-bold mb-6">Settings</h2>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-400">Display</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {darkMode ? <Moon size={18} className="mr-2 text-blue-400" /> : <Sun size={18} className="mr-2 text-yellow-400" />}
              <span>Dark Mode</span>
            </div>
            <Switch 
              checked={darkMode} 
              onCheckedChange={(checked) => {
                setDarkMode(checked);
                toast({
                  title: checked ? "Dark mode enabled" : "Light mode enabled",
                  description: "Theme preference has been updated."
                });
              }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <RefreshCw size={18} className="mr-2 text-green-400" />
              <span>Dashboard Refresh Rate</span>
            </div>
            <select 
              value={refreshRate}
              onChange={(e) => {
                setRefreshRate(e.target.value);
                toast({
                  title: "Refresh rate updated",
                  description: `Dashboard will refresh every ${e.target.value} minutes.`
                });
              }}
              className="bg-[#1a2235] border border-blue-900/20 rounded-md h-9 px-3 text-sm appearance-none focus:border-cyber-blue w-24"
            >
              <option value="1">1 min</option>
              <option value="5">5 mins</option>
              <option value="15">15 mins</option>
              <option value="30">30 mins</option>
              <option value="60">1 hour</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Server size={18} className="mr-2 text-purple-400" />
              <span>Language</span>
            </div>
            <select 
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                toast({
                  title: "Language updated",
                  description: `Interface language set to ${e.target.value}.`
                });
              }}
              className="bg-[#1a2235] border border-blue-900/20 rounded-md h-9 px-3 text-sm appearance-none focus:border-cyber-blue w-24"
            >
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="german">German</option>
              <option value="japanese">Japanese</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-400">Notifications</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell size={18} className="mr-2 text-blue-400" />
              <span>Enable Notifications</span>
            </div>
            <Switch 
              checked={notifications} 
              onCheckedChange={(checked) => {
                setNotifications(checked);
                toast({
                  title: checked ? "Notifications enabled" : "Notifications disabled",
                  description: "Your notification preferences have been updated."
                });
              }}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div 
            className="flex items-center justify-between cursor-pointer" 
            onClick={toggleAdvancedSection}
          >
            <h3 className="text-sm font-semibold text-gray-400">Data Management</h3>
            <ChevronDown 
              size={16} 
              className={`text-gray-400 transition-transform duration-200 ${advancedSectionOpen ? 'transform rotate-180' : ''}`} 
            />
          </div>
          
          {advancedSectionOpen && (
            <div className="space-y-4 border-l-2 border-blue-900/20 pl-4 ml-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock size={18} className="mr-2 text-purple-400" />
                  <span>Data Retention (days)</span>
                </div>
                <select 
                  value={dataRetention}
                  onChange={(e) => {
                    setDataRetention(e.target.value);
                    toast({
                      title: "Data retention updated",
                      description: `Logs will be kept for ${e.target.value} days.`
                    });
                  }}
                  className="bg-[#1a2235] border border-blue-900/20 rounded-md h-9 px-3 text-sm appearance-none focus:border-cyber-blue w-24"
                >
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <Button 
          variant="outline" 
          className="border-blue-900/20"
          onClick={handleResetDefaults}
        >
          Reset to Defaults
        </Button>
        <div className="space-x-2">
          <Button variant="outline" className="border-blue-900/20" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
