 
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, Bell, Settings, LogOut, User, Home, Monitor, 
  Brain, AlertTriangle, FileText, Menu, Search, Filter,
  Calendar, Download, Mail, Upload, Clock, FileType, Info, Check, 
  AlertCircle, Cpu, MoreHorizontal, Trash, Flag, X, ChevronDown
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import SettingsComponent from "@/components/Settings";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
  { date: 'Mar 1', threats: 2 },
  { date: 'Mar 2', threats: 1 },
  { date: 'Mar 3', threats: 4 },
  { date: 'Mar 4', threats: 3 },
  { date: 'Mar 5', threats: 5 },
  { date: 'Mar 6', threats: 2 },
  { date: 'Mar 7', threats: 7 },
];


// Dummy data for the dashboard
const threatData = [
  { date: '2025-03-01', count: 12 },
  { date: '2025-03-02', count: 19 },
  { date: '2025-03-03', count: 15 },
  { date: '2025-03-04', count: 25 },
  { date: '2025-03-05', count: 32 },
  { date: '2025-03-06', count: 18 },
  { date: '2025-03-07', count: 29 }
];

// Initial honeypot logs data
const initialHoneypotLogs = [
  { 
    id: 1, 
    processType: 'cmd.exe', 
    timestamp: '2025-03-07 14:32:45', 
    detected: true, 
    severity: 'high',
    behaviorSummary: 'File encryption attempt detected on multiple directories' 
  },
  { 
    id: 2, 
    processType: 'python.exe', 
    timestamp: '2025-03-07 12:15:22', 
    detected: false, 
    severity: 'low',
    behaviorSummary: 'Regular file system operations with no encryption patterns' 
  },
  { 
    id: 3, 
    processType: 'powershell.exe', 
    timestamp: '2025-03-07 10:45:11', 
    detected: true, 
    severity: 'medium',
    behaviorSummary: 'Registry modifications and suspicious network connections' 
  },
  { 
    id: 4, 
    processType: 'explorer.exe', 
    timestamp: '2025-03-07 09:22:36', 
    detected: false, 
    severity: 'low',
    behaviorSummary: 'Standard file browsing behavior with no malicious actions' 
  },
  { 
    id: 5, 
    processType: 'unknown', 
    timestamp: '2025-03-06 23:41:17', 
    detected: true, 
    severity: 'high',
    behaviorSummary: 'Shadow copy deletion and ransomware note creation' 
  }
];

const aiPredictions = [
  { id: 1, prediction: 'Ransomware', confidence: 97, timestamp: '2025-03-07 14:35:12' },
  { id: 2, prediction: 'Safe', confidence: 99, timestamp: '2025-03-07 12:18:45' },
  { id: 3, prediction: 'Ransomware', confidence: 86, timestamp: '2025-03-07 10:48:33' },
  { id: 4, prediction: 'Safe', confidence: 95, timestamp: '2025-03-07 09:25:51' }
];

const alerts = [
  { 
    id: 1, 
    title: 'Suspicious Activity Detected', 
    timestamp: '2025-03-07 14:32:45', 
    severity: 'high',
    description: 'Multiple file encryption attempts detected from process cmd.exe'
  },
  { 
    id: 2, 
    title: 'Unusual Network Traffic', 
    timestamp: '2025-03-07 10:45:11', 
    severity: 'medium',
    description: 'Powershell process attempting to connect to known malicious IP'
  },
  { 
    id: 3, 
    title: 'System File Modification', 
    timestamp: '2025-03-06 23:41:17', 
    severity: 'high',
    description: 'Critical system files being modified by unknown process'
  }
];

// Dashboard component
const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [timeRange, setTimeRange] = useState<string>('today');
  const [processType, setProcessType] = useState<string>('all');
  const [exportFormat, setExportFormat] = useState<string>('pdf');
  const [emailMe, setEmailMe] = useState<boolean>(false);
  const [autoSchedule, setAutoSchedule] = useState<boolean>(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState<boolean>(false);
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
  const [honeypotLogs, setHoneypotLogs] = useState(initialHoneypotLogs);
  
  // Pagination settings
  const itemsPerPage = 10;
  
  // Filter logs based on search term
  const filteredLogs = honeypotLogs.filter(log => 
    log.processType.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  
  // Calculate current logs based on pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);
  
  // Open log details modal
  const openLogDetails = (log: any) => setSelectedLog(log);
  
  // Close log details modal
  const closeLogDetails = () => setSelectedLog(null);
  
  // Toggle notifications panel
  const toggleNotifications = () => setShowNotifications(!showNotifications);

  // Handle pagination
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Reset pagination when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Parse CSV file
  const parseCSV = (text: string) => {
    const rows = text.split('\n');
    const headers = rows[0].split(',');
    
    return rows.slice(1).filter(row => row.trim()).map((row, index) => {
      const values = row.split(',');
      const entry: any = { id: honeypotLogs.length + index + 1 };
      
      headers.forEach((header, i) => {
        const value = values[i] ? values[i].trim() : '';
        const headerKey = header.trim().toLowerCase();
        
        if (headerKey === 'timestamp') {
          entry.processType = value;
        } else if (headerKey === 'action') {
          entry.timestamp = value;
        } else if (headerKey === 'file_extension') {
          entry.detected = value ;
        } else if (headerKey === 'process') {
          entry.severity = value.toLowerCase();
        } else if (headerKey === 'parent_process') {
          entry.behaviorSummary = value;
        }
      });
      
      // Set defaults for any missing fields
      if (!entry.processType) entry.processType = 'unknown';
      if (!entry.timestamp) entry.timestamp = new Date().toISOString().replace('T', ' ').substr(0, 19);
      const randomBinary = Math.round(Math.random());

      if (randomBinary === 0) entry.detected = false;
      if (!entry.severity) entry.severity = 'low';
      if (!entry.behaviorSummary) entry.behaviorSummary = 'No behavior summary available';
      
      return entry;
    });
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const csvText = event.target?.result as string;
        try {
          const parsedData = parseCSV(csvText);
          
          if (parsedData.length > 0) {
            setHoneypotLogs([...parsedData, ...honeypotLogs]);
            toast({
              title: "CSV data imported",
              description: `Added ${parsedData.length} new logs from ${file.name}`,
            });
            // Reset to first page to show the uploaded data
            setCurrentPage(1);
          } else {
            toast({
              title: "No valid data found",
              description: "The CSV file did not contain any valid log entries.",
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({
            title: "Error parsing CSV",
            description: "There was an error processing the CSV file. Please check the format.",
            variant: "destructive",
          });
        }
      };
      
      reader.readAsText(file);
    }
  };

  // Handle logout
  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    navigate('/');
  };

  // Set time range for report
  const setReportTimeRange = (range: string) => {
    setTimeRange(range);
    toast({
      title: `Time range set to: ${range}`,
      description: "Report will be generated for this time period.",
    });
  };

  // Generate and download report
  const generateReport = () => {
    if (!processType || !exportFormat) {
      toast({
        title: "Missing information",
        description: "Please select a process type and export format.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingReport(true);

    // Simulate report generation delay
    setTimeout(() => {
      setIsGeneratingReport(false);
      
      // Create the report content based on format
      let content = '';
      let filename = '';
      let dataType = '';
      
      if (exportFormat === 'pdf') {
        // In a real app, we would generate a PDF
        // For this demo, we'll create a text file with PDF extension
        content = generateReportContent(true);
        filename = `ransomguard_report_${new Date().toISOString().split('T')[0]}.pdf`;
        dataType = 'text/plain';
      } else {
        // CSV format
        content = generateReportContent(false);
        filename = `ransomguard_report_${new Date().toISOString().split('T')[0]}.csv`;
        dataType = 'text/csv';
      }
      
      // Create the download
      const blob = new Blob([content], { type: dataType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Report generated successfully",
        description: `Your ${exportFormat.toUpperCase()} report has been downloaded.`,
      });
      
      if (emailMe && emailAddress) {
        toast({
          title: "Report email sent",
          description: `Your report has been emailed to ${emailAddress}.`,
        });
      }
    }, 2000);
  };

  // Generate report content
  const generateReportContent = (isPdf: boolean) => {
    const filteredLogs = honeypotLogs.filter(log => 
      (processType === 'all' || log.processType === processType)
    );
    
    if (isPdf) {
      // Simple text representation for demo purposes
      let content = `RANSOMGUARD SECURITY REPORT\n`;
      content += `Generated: ${new Date().toLocaleString()}\n`;
      content += `Time Range: ${timeRange}\n`;
      content += `Process Type: ${processType}\n\n`;
      
      content += `SUMMARY\n`;
      content += `Total Logs: ${filteredLogs.length}\n`;
      content += `Threats Detected: ${filteredLogs.filter(log => log.detected).length}\n\n`;
      
      content += `DETAILED LOGS\n`;
      filteredLogs.forEach(log => {
        content += `Process: ${log.processType}\n`;
        content += `Timestamp: ${log.timestamp}\n`;
        content += `Status: ${log.detected ? 'Ransomware' : 'Safe'}\n`;
        content += `Severity: ${log.severity}\n`;
        content += `Behavior: ${log.behaviorSummary}\n\n`;
      });
      
      return content;
    } else {
      // CSV format
      let content = `timestamp,action,file_extension,parent_process,label\n`;
      
      filteredLogs.forEach(log => {
        content += `${log.processType},${log.timestamp},${log.detected ? 'Ransomware' : 'Safe'},${log.severity},"${log.behaviorSummary}"\n`;
      });
      
      return content;
    }
  };

  // Handle email dialog submit
  const handleEmailSubmit = () => {
    if (!emailAddress.includes('@')) {
      toast({
        title: "Invalid email address",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Email address saved",
      description: "Your reports will be emailed to this address.",
    });
    
    setEmailDialogOpen(false);
  };

  // Handle schedule toggle
  const handleScheduleToggle = (checked: boolean) => {
    setAutoSchedule(checked);
    if (checked) {
      toast({
        title: "Weekly schedule enabled",
        description: "Reports will be generated automatically every Monday.",
      });
    } else {
      toast({
        title: "Weekly schedule disabled",
        description: "Automatic report generation has been disabled.",
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-[#0f172a] text-white font-mono flex w-full">
        {/* Sidebar using the shadcn/ui sidebar component */}
        <Sidebar variant="sidebar" collapsible="icon">
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <span className="text-xl font-bold text-cyber-blue">RansomGuard</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === 'dashboard'}
                  onClick={() => setActiveSection('dashboard')}
                  tooltip="Dashboard"
                >
                  <Home size={20} />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === 'honeypotLogs'}
                  onClick={() => setActiveSection('honeypotLogs')}
                  tooltip="Honeypot Logs"
                >
                  <Monitor size={20} />
                  <span>Honeypot Logs</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === 'aiPredictions'}
                  onClick={() => setActiveSection('aiPredictions')}
                  tooltip="AI Predictions"
                >
                  <Brain size={20} />
                  <span>AI Predictions</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === 'alerts'}
                  onClick={() => setActiveSection('alerts')}
                  tooltip="Alerts"
                >
                  <AlertTriangle size={20} />
                  <span>Alerts</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === 'reports'}
                  onClick={() => setActiveSection('reports')}
                  tooltip="Reports"
                >
                  <FileText size={20} />
                  <span>Reports</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <Button variant="destructive" size="sm" className="w-full" onClick={handleLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        
        {/* Main content */}
        <div className="flex-1">
          {/* Top nav */}
          <header className="bg-[#111827]/80 backdrop-blur-sm border-b border-blue-900/20 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4" />
              <h1 className="text-lg font-bold text-cyber-blue">
                Ransomware Behaviour Monitoring
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="relative hover:bg-blue-900/20" 
                  onClick={toggleNotifications}
                >
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>
                
                {/* Notifications panel - without the buttons */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-96 bg-[#111827] border border-blue-900/20 rounded-lg shadow-xl z-20 overflow-hidden neo-blur">
                    <div className="p-4 border-b border-blue-900/20">
                      <h3 className="font-bold">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {alerts.map(alert => (
                        <div key={alert.id} className="p-4 border-b border-blue-900/20 hover:bg-blue-900/10">
                          <div className="flex items-start">
                            <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                              alert.severity === 'high' ? 'bg-red-500' :
                              alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                            }`}></div>
                            <div className="ml-3 flex-1">
                              <p className="font-semibold text-sm">{alert.title}</p>
                              <p className="text-gray-400 text-xs mt-1">{alert.description}</p>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-gray-500">{alert.timestamp}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-blue-900/20"
                onClick={() => setShowSettings(true)}
              >
                <Settings size={20} />
              </Button>
              
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-blue-900/40 text-cyber-blue">RG</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium"></p>
                  {/* <p className="text-xs text-gray-400">Security Analyst</p> */}
                </div>
              </div>
            </div>
          </header>
          
          {/* Dashboard Content */}
          <main className="p-6">
            {activeSection === 'dashboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 bg-[#111827]/90 border border-blue-900/20 rounded-lg p-6 shadow-lg backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Live Threat Monitoring</h2>
                    <div className="flex space-x-2">
                      <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">Low</Badge>
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30">Medium</Badge>
                      <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30">High</Badge>
                    </div>
                  </div>
                  <div className="h-64 w-full bg-[#1a2235] rounded-lg border border-blue-900/20 p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2c3551" />
                        <XAxis dataKey="date" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#334155' }} />
                        <Bar dataKey="threats" fill="#60a5fa" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-4 flex justify-between text-xs text-gray-500">
                    {/* <span>Mar 1</span>
                    <span>Mar 2</span>
                    <span>Mar 3</span>
                    <span>Mar 4</span>
                    <span>Mar 5</span>
                    <span>Mar 6</span>
                    <span>Mar 7</span> */}
                  </div>
                </div>
                
                <div className="bg-[#111827]/90 backdrop-blur-sm border border-blue-900/20 rounded-lg p-6 shadow-lg">
                  <h2 className="text-xl font-bold mb-6">Threat Summary</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Active Honeypots</p>
                        <p className="text-2xl font-bold text-cyber-blue">12</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-blue-900/20 flex items-center justify-center text-cyber-blue">
                        <Cpu />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Threats Detected (24h)</p>
                        <p className="text-2xl font-bold text-red-400">7</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-red-900/20 flex items-center justify-center text-red-400">
                        <AlertCircle />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">AI Model Accuracy</p>
                        <p className="text-2xl font-bold text-green-400">97.3%</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-green-900/20 flex items-center justify-center text-green-400">
                        <Brain />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Honeypot Logs Section */}
            {activeSection === 'honeypotLogs' && (
              <div className="bg-[#111827]/90 backdrop-blur-sm border border-blue-900/20 rounded-lg shadow-lg overflow-hidden mb-6">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Honeypot Logs</h2>
                    <div className="flex space-x-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                        <Input 
                          placeholder="Search by process type..." 
                          className="pl-10 bg-[#1a2235] border-blue-900/20 focus:border-cyber-blue h-9 text-sm"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="relative">
                        <input
                          type="file"
                          id="csvUpload"
                          accept=".csv"
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Button variant="outline" size="sm" className="border-blue-900/20 hover:bg-blue-900/20">
                          <Upload size={16} className="mr-2" /> Upload CSV
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg overflow-hidden border border-blue-900/20">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-blue-900/10 border-blue-900/20">
                          <TableHead className="text-gray-400 font-medium">Timestamp</TableHead>
                          <TableHead className="text-gray-400 font-medium">Action</TableHead>
                          <TableHead className="text-gray-400 font-medium">File_extension</TableHead>
                          <TableHead className="text-gray-400 font-medium">Process</TableHead>
                          {/* <TableHead className="text-gray-400 font-medium w-20">Parent_process</TableHead>
                          <TableHead className="text-gray-400 font-medium w-20">Label</TableHead> */}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentLogs.map(log => (
                          <TableRow 
                            key={log.id} 
                            className="hover:bg-blue-900/10 border-blue-900/20 cursor-pointer"
                            onClick={() => openLogDetails(log)}
                          >
                            <TableCell className="font-mono">
                              <div className="flex items-center">
                                <span className="h-2 w-2 rounded-full bg-cyber-blue mr-2"></span>
                                {log.processType}
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-400 text-sm">{log.timestamp}</TableCell>
                            <TableCell>
                              {log.detected ? (
                                <Badge className="bg-red-500/20 text-red-400 border-none">
                                  Ransomware
                                </Badge>
                              ) : (
                                <Badge className="bg-green-500/20 text-green-400 border-none">
                                  Safe
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-gray-400 text-sm max-w-sm truncate">
                              {log.behaviorSummary}
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                                <MoreHorizontal size={16} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
                    <span>Showing {Math.min(currentLogs.length, itemsPerPage)} of {filteredLogs.length} logs</span>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 border-blue-900/20"
                        onClick={prevPage}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft size={16} /> Previous
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 border-blue-900/20"
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                      >
                        Next <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* AI Model Predictions Section */}
            {activeSection === 'aiPredictions' && (
              <div className="bg-[#111827]/90 backdrop-blur-sm border border-blue-900/20 rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-bold mb-6">AI Model Predictions</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {aiPredictions.map(prediction => (
                    <div 
                      key={prediction.id}
                      className={`p-4 rounded-lg border ${
                        prediction.prediction === 'Ransomware' 
                          ? 'bg-red-500/10 border-red-500/30' 
                          : 'bg-green-500/10 border-green-500/30'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className={`font-bold ${
                            prediction.prediction === 'Ransomware' ? 'text-red-400' : 'text-green-400'
                          }`}>
                            {prediction.prediction}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1">{prediction.timestamp}</p>
                        </div>
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold ${
                          prediction.prediction === 'Ransomware' 
                            ? 'bg-red-500/20 text-red-400' 
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {prediction.confidence}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="h-48 w-full bg-[#1a2235] rounded-lg flex items-center justify-center border border-blue-900/20 mb-6">
                  <div className="text-center px-4">
                    <BarChart className="h-8 w-8 text-cyber-blue mx-auto mb-3 opacity-80" />
                    <p className="text-gray-400">Model accuracy over time</p>
                    <p className="text-xs text-gray-500 mt-2">Trending at 97.3% accuracy</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Reports Section */}
            {activeSection === 'reports' && (
              <div className="bg-[#111827]/90 backdrop-blur-sm border border-blue-900/20 rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-bold mb-6">Report Generator</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Time Range</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`border-blue-900/20 ${timeRange === 'today' ? 'bg-blue-900/30 border-cyber-blue' : 'bg-blue-900/5'}`}
                        onClick={() => setReportTimeRange('today')}
                      >
                        <Clock size={16} className="mr-2" /> Today
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`border-blue-900/20 ${timeRange === 'week' ? 'bg-blue-900/30 border-cyber-blue' : ''}`}
                        onClick={() => setReportTimeRange('week')}
                      >
                        <Calendar size={16} className="mr-2" /> This Week
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Process Type</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-[#1a2235] border border-blue-900/20 rounded-md h-10 px-3 text-sm appearance-none focus:border-cyber-blue"
                        value={processType}
                        onChange={(e) => setProcessType(e.target.value)}
                      >
                        <option value="all">All Processes</option>
                        <option value="cmd.exe">cmd.exe</option>
                        <option value="powershell.exe">powershell.exe</option>
                        <option value="python.exe">python.exe</option>
                        <option value="explorer.exe">explorer.exe</option>
                        <option value="unknown">Unknown</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Export Format</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`border-blue-900/20 ${exportFormat === 'pdf' ? 'bg-blue-900/30 border-cyber-blue' : 'bg-blue-900/5'}`}
                        onClick={() => setExportFormat('pdf')}
                      >
                        <FileText size={16} className="mr-2" /> PDF
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`border-blue-900/20 ${exportFormat === 'csv' ? 'bg-blue-900/30 border-cyber-blue' : ''}`}
                        onClick={() => setExportFormat('csv')}
                      >
                        <FileType size={16} className="mr-2" /> CSV
                      </Button>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      className="w-full bg-cyber-blue hover:bg-cyber-blue/90 relative"
                      onClick={generateReport}
                      disabled={isGeneratingReport}
                    >
                      {isGeneratingReport ? (
                        <>
                          <span className="animate-pulse">Generating Report...</span>
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="h-4 w-4 rounded-full border-2 border-white border-opacity-20 border-t-white animate-spin"></span>
                          </span>
                        </>
                      ) : (
                        <>
                          <Download size={16} className="mr-2" /> Generate Report
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm pt-2">
                    <div className="flex items-center">
                      <Checkbox 
                        id="email-me" 
                        checked={emailMe}
                        onCheckedChange={(checked) => {
                          setEmailMe(!!checked);
                          if (checked) {
                            setEmailDialogOpen(true);
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-600 bg-[#1a2235] text-cyber-blue focus:ring-cyber-blue"
                      />
                      {/* <label htmlFor="email-me" className="ml-2 text-gray-400">Email me the report</label> */}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-gray-500 hover:text-cyber-blue transition-colors"
                      onClick={() => setEmailDialogOpen(true)}
                    >
                      <Mail size={16} />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Checkbox 
                        id="auto-schedule" 
                        checked={autoSchedule}
                        onCheckedChange={(checked) => handleScheduleToggle(!!checked)}
                        className="h-4 w-4 rounded border-gray-600 bg-[#1a2235] text-cyber-blue focus:ring-cyber-blue"
                      />
                      {/* <label htmlFor="auto-schedule" className="ml-2 text-gray-400">Weekly auto-schedule</label> */}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-gray-500 hover:text-cyber-blue transition-colors"
                      onClick={() => {
                        setAutoSchedule(!autoSchedule);
                        handleScheduleToggle(!autoSchedule);
                      }}
                    >
                      <Calendar size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Alerts Section */}
            {activeSection === 'alerts' && (
              <div className="bg-[#111827]/90 backdrop-blur-sm border border-blue-900/20 rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-bold mb-6">Alerts</h2>
                
                <div className="space-y-4">
                  {alerts.map(alert => (
                    <div 
                      key={alert.id}
                      className={`p-4 rounded-lg border ${
                        alert.severity === 'high' ? 'bg-red-500/10 border-red-500/30' :
                        alert.severity === 'medium' ? 'bg-yellow-500/10 border-yellow-500/30' :
                        'bg-green-500/10 border-green-500/30'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold">{alert.title}</h3>
                          <p className="text-sm text-gray-400 mt-1">{alert.description}</p>
                          <p className="text-xs text-gray-500 mt-2">{alert.timestamp}</p>
                        </div>
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          alert.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                          alert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          <AlertTriangle size={16} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      
        {/* Log details modal - without the Flag as Suspicious and Export Log buttons */}
        {selectedLog && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-[#111827]/95 backdrop-blur-sm border border-blue-900/30 rounded-lg w-full max-w-2xl shadow-xl">
              <div className="flex justify-between items-center p-6 border-b border-blue-900/20">
                <h2 className="text-xl font-bold">Log Details</h2>
                <Button variant="ghost" size="icon" onClick={closeLogDetails}>
                  <X size={20} />
                </Button>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Process Type</p>
                    <p className="font-mono">{selectedLog.processType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Timestamp</p>
                    <p>{selectedLog.timestamp}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Status</p>
                    {selectedLog.detected ? (
                      <Badge className="bg-red-500/20 text-red-400 border-none">
                        Ransomware
                      </Badge>
                    ) : (
                      <Badge className="bg-green-500/20 text-green-400 border-none">
                        Safe
                      </Badge>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Severity</p>
                    <Badge className={`border-none ${
                      selectedLog.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                      selectedLog.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {selectedLog.severity.charAt(0).toUpperCase() + selectedLog.severity.slice(1)}
                    </Badge>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-400 mb-1">Behavior Summary</p>
                  <p className="text-gray-300">{selectedLog.behaviorSummary}</p>
                </div>
                
                <div className="bg-[#1a2235] border border-blue-900/20 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-400 mb-2">Full Behavior Pattern</p>
                  <div className="text-xs font-mono text-gray-300 whitespace-pre-wrap">
                    {`Process: ${selectedLog.processType}\nStarted: ${selectedLog.timestamp}\nActivity log:\n1. ${selectedLog.behaviorSummary}\n2. Access to system directory detected\n3. Multiple file operations in quick succession\n${selectedLog.detected ? '4. Encryption patterns detected\n5. Ransom note creation attempt' : '4. Normal system operations\n5. No encryption patterns detected'}`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Email Dialog */}
        <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
          <DialogContent className="bg-[#111827] border border-blue-900/30 text-white">
            <DialogHeader>
              <DialogTitle>Enter Email Address</DialogTitle>
              <DialogDescription className="text-gray-400">
                We'll send your generated reports to this email address.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <label htmlFor="email" className="text-sm text-gray-400 block mb-2">Email Address</label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                value={emailAddress} 
                onChange={(e) => setEmailAddress(e.target.value)}
                className="bg-[#1a2235] border-blue-900/20 focus:border-cyber-blue"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleEmailSubmit}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Settings Dialog */}
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent className="bg-[#111827] border border-blue-900/30 text-white max-w-2xl">
            <SettingsComponent onClose={() => setShowSettings(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
