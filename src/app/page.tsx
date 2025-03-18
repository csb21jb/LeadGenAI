'use client';

import { useState, useEffect } from 'react';
import { Geist } from 'next/font/google';
import { Send, User, Mail, Building, History, Search, X, ExternalLink, ChevronDown, ChevronUp, Moon, Sun, Menu } from 'lucide-react';
import type { PersonResult } from '@/lib/perplexity';
import LeadResultDisplay from '@/components/LeadResultDisplay';

const geistSans = Geist({
  subsets: ['latin'],
});

// Type for search history entries
interface HistoryEntry {
  id: string;
  query: {
    name: string;
    email?: string;
    company?: string;
  };
  timestamp: string;
  html: string;
}

export default function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultHtml, setResultHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // History management
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHistory, setFilteredHistory] = useState<HistoryEntry[]>([]);

  // Add theme state and toggle functionality
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load history and theme preference from localStorage on component mount
  useEffect(() => {
    // Load history
    const savedHistory = localStorage.getItem('leadgeniusHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing saved history:', e);
        // If there's an error parsing, start with empty history
        localStorage.setItem('leadgeniusHistory', JSON.stringify([]));
      }
    }
    
    // Load theme preference
    const savedTheme = localStorage.getItem('leadgeniusTheme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      // Check if user prefers dark mode
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  // Filter history when searchTerm changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredHistory(history);
      return;
    }
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = history.filter(entry => 
      entry.query.name.toLowerCase().includes(lowerSearchTerm) ||
      (entry.query.company && entry.query.company.toLowerCase().includes(lowerSearchTerm)) ||
      (entry.query.email && entry.query.email.toLowerCase().includes(lowerSearchTerm)) ||
      // Also search in the results content (basic text search in HTML)
      entry.html.toLowerCase().includes(lowerSearchTerm)
    );
    
    setFilteredHistory(filtered);
  }, [searchTerm, history]);

  // Save a search to history
  const saveToHistory = (html: string) => {
    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      query: { name, email, company },
      timestamp: new Date().toISOString(),
      html
    };
    
    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('leadgeniusHistory', JSON.stringify(updatedHistory));
  };

  // Load a history entry
  const loadFromHistory = (entry: HistoryEntry) => {
    setName(entry.query.name);
    setEmail(entry.query.email || '');
    setCompany(entry.query.company || '');
    setResultHtml(entry.html);
    setShowHistory(false);
  };

  // Delete a history entry
  const deleteHistoryEntry = (id: string) => {
    const updatedHistory = history.filter(entry => entry.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('leadgeniusHistory', JSON.stringify(updatedHistory));
  };

  // Clear all history
  const clearAllHistory = () => {
    setHistory([]);
    setFilteredHistory([]);
    localStorage.setItem('leadgeniusHistory', JSON.stringify([]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResultHtml(null);
    
    try {
      console.log('Submitting search:', { name, email, company });
      
      // Make the search request
      const response = await fetch('/api/generate-prospects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, company }),
      });
      
      // Log the entire response for debugging
      console.log('API response status:', response.status);
      const data = await response.json();
      console.log('API response data:', data);
      
      // Check if we have HTML content
      if (data.html) {
        console.log('Found HTML content to display');
        
        // Display a warning if there was an error but we still have HTML content
        if (data.error || !response.ok) {
          setError(`Note: ${data.error || 'There might have been an issue with the search, but we found some results'}`);
        }
        
        setResultHtml(data.html);
        saveToHistory(data.html);
        return;
      }
      
      // No HTML content found - this is now a real error case
      console.error('No HTML content found in the response:', data);
      throw new Error(data.error || data.details || 'Failed to search for person - no content found');
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };
  
  // Collapsible section component
  const CollapsibleSection = ({ 
    title, 
    children, 
    defaultOpen = false 
  }: { 
    title: string; 
    children: React.ReactNode; 
    defaultOpen?: boolean 
  }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    
    return (
      <div className={`border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} rounded-lg overflow-hidden`}>
        <button 
          className={`w-full px-4 py-3 ${
            isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-50 text-gray-700'
          } flex items-center justify-between font-medium text-left`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{title}</span>
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
        {isOpen && (
          <div className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`${geistSans.className} min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`w-full ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white'}`}>
        <div className={`py-4 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-200 bg-white shadow-sm'}`}>
          <div className="container mx-auto px-4 flex items-center">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`flex items-center gap-2 p-2 rounded-md ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              } transition-colors duration-200`}
              aria-label="Toggle History"
            >
              <Menu className="h-5 w-5" />
              <span className="text-sm">History</span>
            </button>
            
            <h1 className="text-2xl font-bold flex-1 text-center">Lead Scrapper + OpenAI Web Search</h1>
            
            <button
              onClick={() => {
                try {
                  const newTheme = !isDarkMode;
                  setIsDarkMode(newTheme);
                  localStorage.setItem('leadgeniusTheme', newTheme ? 'dark' : 'light');
                } catch (error) {
                  console.error("Error updating theme:", error);
                }
              }}
              className={`p-2 rounded-md ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              } transition-colors duration-200`}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex min-h-screen">
            {/* History Sidebar */}
            <div 
              className={`fixed inset-y-0 left-0 z-40 w-64 ${
                isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white'
              } shadow-lg transform ${
                showHistory ? 'translate-x-0' : '-translate-x-full'
              } transition-transform duration-200 ease-in-out`}
            >
              <div className="h-full flex flex-col">
                <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Search History</h2>
                    <button 
                      onClick={() => setShowHistory(false)}
                      className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="text"
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border-gray-300 text-gray-700'
                      } rounded-md text-sm`}
                      placeholder="Search history..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  {history.length > 0 && (
                    <button 
                      onClick={clearAllHistory}
                      className="mt-2 text-xs text-red-500 hover:text-red-400"
                    >
                      Clear all history
                    </button>
                  )}
                </div>
                
                <div className="flex-1 overflow-y-auto p-2">
                  {filteredHistory.length === 0 ? (
                    <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mt-4`}>
                      {history.length === 0 ? 'No search history' : 'No matching results'}
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {filteredHistory.map((entry) => (
                        <li key={entry.id} className={`${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                        } rounded-md p-2 text-sm`}>
                          <button 
                            onClick={() => loadFromHistory(entry)}
                            className="w-full text-left"
                          >
                            <div className="font-medium">{entry.query.name}</div>
                            {entry.query.company && (
                              <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-xs`}>{entry.query.company}</div>
                            )}
                            <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs mt-1`}>
                              {formatDate(entry.timestamp)}
                            </div>
                          </button>
                          <div className="flex justify-end mt-1">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteHistoryEntry(entry.id);
                              }}
                              className="text-red-500 hover:text-red-400 text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className={`flex-1 overflow-y-auto p-4 ${showHistory ? 'ml-64' : ''} transition-all duration-200`}>
              <div className="container mx-auto max-w-4xl">
                <div className="space-y-8 pb-10">
                  <div className={`${
                    isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
                  } rounded-lg shadow p-6`}>
                    <h2 className="text-xl font-semibold mb-4">Find Lead Information</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="max-w-md">
                          <label htmlFor="name" className={`block text-sm font-medium ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          } mb-1`}>
                            Name <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <User className={`h-4 w-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                            </div>
                            <input
                              type="text"
                              id="name"
                              className={`block w-full pl-9 pr-3 py-1.5 border ${
                                isDarkMode 
                                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                  : 'border-gray-300 text-gray-700'
                              } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm`}
                              placeholder="John Smith"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="max-w-md">
                          <label htmlFor="email" className={`block text-sm font-medium ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          } mb-1`}>
                            Email (Optional)
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className={`h-4 w-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                            </div>
                            <input
                              type="email"
                              id="email"
                              className={`block w-full pl-9 pr-3 py-1.5 border ${
                                isDarkMode 
                                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                  : 'border-gray-300 text-gray-700'
                              } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm`}
                              placeholder="john@example.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div className="max-w-md">
                          <label htmlFor="company" className={`block text-sm font-medium ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          } mb-1`}>
                            Company (Optional)
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Building className={`h-4 w-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                            </div>
                            <input
                              type="text"
                              id="company"
                              className={`block w-full pl-9 pr-3 py-1.5 border ${
                                isDarkMode 
                                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                  : 'border-gray-300 text-gray-700'
                              } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm`}
                              placeholder="Company name"
                              value={company}
                              onChange={(e) => setCompany(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      {error && (
                        <div className={`${
                          isDarkMode ? 'bg-red-900 border-red-800 text-red-200' : 'bg-red-50 border-red-200 text-red-700'
                        } px-4 py-3 rounded-md border max-w-md`}>
                          <p className="font-medium">Error occurred:</p>
                          <p>{error}</p>
                          <p className="text-sm mt-2">If this is an API error, please check that your OpenAI API key is valid and has access to the gpt-4o-mini-search-preview model. This app uses OpenAI's web search capabilities.</p>
                        </div>
                      )}

                      <div className="max-w-md">
                        <button
                          type="submit"
                          disabled={loading}
                          className={`w-full px-6 py-2 ${
                            isDarkMode 
                              ? 'bg-blue-600 hover:bg-blue-700' 
                              : 'bg-blue-600 hover:bg-blue-700'
                          } text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center gap-2`}
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                              <span>Searching...</span>
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4" />
                              <span>Search</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>

                  {resultHtml && (
                    <LeadResultDisplay html={resultHtml} isDarkMode={isDarkMode} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
