'use client';

import { useState, useRef } from 'react';
import { downloadPDF, generatePDF } from '@/lib/pdfGenerator';
import apiDocConfig from '@/config/api-doc-config.json';
import dynamic from 'next/dynamic';

// Dynamically import Monaco Editor to avoid SSR issues
const Editor = dynamic(() => import('@monaco-editor/react'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-gray-500">Loading JSON Editor...</div>
        </div>
    ),
});

export default function AtlasApiDoc() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [customConfig, setCustomConfig] = useState(null);
    const [showJsonStructure, setShowJsonStructure] = useState(false);
    const [editorValue, setEditorValue] = useState('');
    const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'editor'
    const [uploadedFileName, setUploadedFileName] = useState('');
    const [isValidJson, setIsValidJson] = useState(false);
    const [editorHeight, setEditorHeight] = useState(400);
    const [isResizing, setIsResizing] = useState(false);
    const fileInputRef = useRef(null);
    const editorRef = useRef(null);
    const resizeRef = useRef(null);

    const handleDownload = async () => {
        try {
            setLoading(true);
            setError(null);
            const configToUse = customConfig || apiDocConfig;
            await downloadPDF(configToUse);
        } catch (err) {
            console.error('Failed to download PDF:', err);
            setError('Failed to generate PDF: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = async () => {
        try {
            setLoading(true);
            setError(null);
            const configToUse = customConfig || apiDocConfig;
            await generatePDF(configToUse);
        } catch (err) {
            console.error('Failed to preview PDF:', err);
            setError('Failed to generate PDF: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const jsonConfig = JSON.parse(e.target.result);

                    // Validate required structure
                    if (!jsonConfig.metadata || !jsonConfig.metadata.title) {
                        setError('JSON must have metadata.title field');
                        return;
                    }
                    if (!jsonConfig.pages || !Array.isArray(jsonConfig.pages)) {
                        setError('JSON must have pages array');
                        return;
                    }

                    setCustomConfig(jsonConfig);
                    setEditorValue(JSON.stringify(jsonConfig, null, 2));
                    setUploadedFileName(file.name);
                    setIsValidJson(true);
                    setError(null);
                } catch (err) {
                    setError('Invalid JSON file. Please check the file format: ' + err.message);
                    setIsValidJson(false);
                    setUploadedFileName('');
                }
            };
            reader.readAsText(file);
        } else {
            setError('Please select a valid JSON file.');
            setIsValidJson(false);
            setUploadedFileName('');
        }
    };

    const handleEditorChange = (value) => {
        setEditorValue(value || '');
        setError(null);

        // Try to parse and validate in real-time
        if (value && value.trim()) {
            try {
                const jsonConfig = JSON.parse(value);

                // Validate required structure
                if (jsonConfig.metadata && jsonConfig.metadata.title && jsonConfig.pages && Array.isArray(jsonConfig.pages)) {
                    setCustomConfig(jsonConfig);
                    setIsValidJson(true);
                } else {
                    setIsValidJson(false);
                }
            } catch (err) {
                // Don't show error while typing, just clear the config
                setCustomConfig(null);
                setIsValidJson(false);
            }
        } else {
            setCustomConfig(null);
            setIsValidJson(false);
        }
    };

    const validateAndSetJsonText = () => {
        const textToValidate = activeTab === 'editor' ? editorValue : '';

        if (textToValidate.trim()) {
            try {
                const jsonConfig = JSON.parse(textToValidate);

                // Validate required structure
                if (!jsonConfig.metadata || !jsonConfig.metadata.title) {
                    setError('JSON must have metadata.title field');
                    return;
                }
                if (!jsonConfig.pages || !Array.isArray(jsonConfig.pages)) {
                    setError('JSON must have pages array');
                    return;
                }

                setCustomConfig(jsonConfig);
                setIsValidJson(true);
                setError(null);
            } catch (err) {
                const errorMessage = err.message;
                // Try to extract line and column information
                const lineMatch = errorMessage.match(/line (\d+)/);
                const columnMatch = errorMessage.match(/column (\d+)/);
                const positionMatch = errorMessage.match(/position (\d+)/);
                
                let enhancedError = 'Invalid JSON format. Please check your JSON syntax: ' + errorMessage;
                
                if (lineMatch && columnMatch) {
                    enhancedError += ` (line ${lineMatch[1]}, column ${columnMatch[1]})`;
                } else if (positionMatch) {
                    enhancedError += ` (position ${positionMatch[1]})`;
                }
                
                setError(enhancedError);
                setIsValidJson(false);
            }
        } else {
            setCustomConfig(null);
            setIsValidJson(false);
        }
    };

    const resetToDefault = () => {
        setCustomConfig(null);
        setEditorValue('');
        setUploadedFileName('');
        setIsValidJson(false);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Handle editor resizing
    const handleMouseDown = (e) => {
        setIsResizing(true);
        const startY = e.clientY;
        const startHeight = editorHeight;

        const handleMouseMove = (e) => {
            const deltaY = e.clientY - startY;
            const newHeight = Math.max(200, Math.min(800, startHeight + deltaY));
            setEditorHeight(newHeight);
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
                        API Documentation
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Generate comprehensive, professional API documentation with our advanced JSON-powered generator
                    </p>
                </div>

                {error && (
                    <div className="mb-8 p-5 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl shadow-sm animate-in slide-in-from-top-2 duration-300">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-semibold text-red-800 mb-1">JSON Validation Error</h3>
                                <p className="text-red-700 text-sm whitespace-pre-wrap leading-relaxed">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modern Upload/Editor Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden mb-8 transition-all duration-300 hover:shadow-2xl">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 px-8 py-6">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white">
                                JSON Configuration Studio
                            </h3>
                        </div>
                        <p className="text-blue-100 leading-relaxed">
                            Upload a JSON file or use our advanced editor to create your API documentation with real-time validation
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex bg-slate-50 border-b border-slate-200">
                        <button
                            onClick={() => setActiveTab('upload')}
                            className={`px-6 py-4 font-semibold text-sm transition-all duration-200 relative ${activeTab === 'upload'
                                    ? 'text-blue-700 bg-white shadow-sm'
                                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                                }`}
                        >
                            <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <span>Upload File</span>
                            </div>
                            {activeTab === 'upload' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('editor')}
                            className={`px-6 py-4 font-semibold text-sm transition-all duration-200 relative ${activeTab === 'editor'
                                    ? 'text-blue-700 bg-white shadow-sm'
                                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                                }`}
                        >
                            <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                                <span>Code Editor</span>
                            </div>
                            {activeTab === 'editor' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                            )}
                        </button>
                    </div>

                    <div className="px-6 pb-6">
                        {/* Upload Tab */}
                        {activeTab === 'upload' && (
                            <div className="space-y-4">
                                {!uploadedFileName ? (
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-500">
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500">JSON files only</p>
                                            </div>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                className="hidden"
                                                accept=".json"
                                                onChange={handleFileUpload}
                                            />
                                        </label>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <div>
                                                    <p className="text-sm font-medium text-green-800">File uploaded successfully</p>
                                                    <p className="text-xs text-green-600">{uploadedFileName}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setUploadedFileName('');
                                                    setCustomConfig(null);
                                                    setIsValidJson(false);
                                                    if (fileInputRef.current) {
                                                        fileInputRef.current.value = '';
                                                    }
                                                }}
                                                className="text-green-600 hover:text-green-800 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* JSON Editor Tab */}
                        {activeTab === 'editor' && (
                            <div className="space-y-6 animate-in fade-in-50 duration-300">
                                <div className="relative">
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="block text-sm font-bold text-slate-800">
                                            Advanced JSON Editor
                                        </label>
                                        <div className="flex items-center space-x-2 text-xs text-slate-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                            </svg>
                                            <span>Drag to resize</span>
                                        </div>
                                    </div>
                                    
                                    {/* Editor Container with Modern Styling */}
                                    <div className="relative group">
                                        <div 
                                            className="border-2 border-slate-200 rounded-2xl overflow-hidden shadow-lg transition-all duration-200 group-hover:border-blue-300 group-hover:shadow-xl"
                                            style={{ 
                                                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                                                minHeight: `${editorHeight}px`
                                            }}
                                        >
                                            <div className="bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-600">
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex space-x-1.5">
                                                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                                    </div>
                                                    <span className="text-slate-300 text-sm font-medium">config.json</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <div className={`w-2 h-2 rounded-full ${isValidJson ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
                                                    <span className="text-xs text-slate-400">
                                                        {isValidJson ? 'Valid JSON' : 'Invalid JSON'}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <Editor
                                                height={`${editorHeight - 50}px`}
                                                defaultLanguage="json"
                                                value={editorValue}
                                                onChange={handleEditorChange}
                                                onMount={(editor, monaco) => {
                                                    editorRef.current = editor;

                                                    // Configure JSON validation
                                                    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
                                                        validate: true,
                                                        allowComments: false,
                                                        schemas: [],
                                                        enableSchemaRequest: false,
                                                    });
                                                }}
                                                options={{
                                                    minimap: { enabled: true },
                                                    fontSize: 14,
                                                    lineNumbers: 'on',
                                                    roundedSelection: false,
                                                    scrollBeyondLastLine: false,
                                                    automaticLayout: true,
                                                    tabSize: 2,
                                                    insertSpaces: true,
                                                    wordWrap: 'on',
                                                    formatOnPaste: true,
                                                    formatOnType: true,
                                                    folding: true,
                                                    bracketPairColorization: { enabled: true },
                                                    suggest: {
                                                        showKeywords: false,
                                                        showSnippets: false,
                                                    },
                                                    padding: { top: 16, bottom: 16 },
                                                    smoothScrolling: true,
                                                    cursorBlinking: 'smooth',
                                                    renderLineHighlight: 'gutter',
                                                }}
                                                theme="vs-dark"
                                            />
                                        </div>
                                        
                                        {/* Resize Handle */}
                                        <div
                                            ref={resizeRef}
                                            onMouseDown={handleMouseDown}
                                            className={`absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize group/resize ${
                                                isResizing ? 'bg-blue-500' : 'bg-transparent hover:bg-blue-400/20'
                                            } transition-colors duration-200 flex items-center justify-center`}
                                        >
                                            <div className="w-12 h-1 bg-slate-400 rounded-full group-hover/resize:bg-blue-500 transition-colors duration-200"></div>
                                        </div>
                                    </div>
                                    
                                    <p className="mt-3 text-xs text-slate-500 flex items-center space-x-2">
                                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        <span>Professional JSON editor with syntax highlighting, real-time validation, and intelligent auto-completion</span>
                                    </p>
                                </div>
                                
                                {/* Action Buttons */}
                                {editorValue && (
                                    <div className="flex flex-wrap gap-3 animate-in slide-in-from-bottom-2 duration-300">
                                        <button
                                            onClick={validateAndSetJsonText}
                                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>Validate JSON</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (editorRef.current) {
                                                    editorRef.current.getAction('editor.action.formatDocument').run();
                                                }
                                            }}
                                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2a2 2 0 002-2V5a2 2 0 00-2-2z" />
                                            </svg>
                                            <span>Format JSON</span>
                                        </button>
                                        <button
                                            onClick={() => setEditorValue('')}
                                            className="px-6 py-3 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-xl hover:from-slate-600 hover:to-slate-700 transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            <span>Clear</span>
                                        </button>
                                    </div>
                                )}
                                
                                {!editorValue && (
                                    <div className="text-center py-8 animate-in fade-in-50 duration-500">
                                        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-2">Ready to Start</h3>
                                        <p className="text-slate-600 mb-6 max-w-md mx-auto">
                                            Load a sample configuration to get started, or begin writing your own JSON structure
                                        </p>
                                        <button
                                            onClick={() => {
                                                const sampleJson = JSON.stringify(apiDocConfig, null, 2);
                                                setEditorValue(sampleJson);
                                                setCustomConfig(apiDocConfig);
                                                setIsValidJson(true);
                                            }}
                                            className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 text-sm font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-3 mx-auto"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                            <span>Load Sample Configuration</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4 mt-8 p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl border border-slate-200">
                            <button
                                onClick={() => setShowJsonStructure(!showJsonStructure)}
                                className="px-5 py-2.5 bg-white text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md border border-slate-200 flex items-center space-x-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>{showJsonStructure ? 'Hide' : 'Show'} JSON Structure</span>
                            </button>
                            <button
                                onClick={() => {
                                    // Download the current config as a sample
                                    const dataStr = JSON.stringify(apiDocConfig, null, 2);
                                    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
                                    const exportFileDefaultName = 'sample-api-config.json';
                                    const linkElement = document.createElement('a');
                                    linkElement.setAttribute('href', dataUri);
                                    linkElement.setAttribute('download', exportFileDefaultName);
                                    linkElement.click();
                                }}
                                className="px-5 py-2.5 bg-white text-purple-700 rounded-xl hover:bg-purple-50 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md border border-purple-200 flex items-center space-x-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>Download Sample</span>
                            </button>
                            {(customConfig || editorValue) && (
                                <button
                                    onClick={resetToDefault}
                                    className="px-5 py-2.5 bg-white text-slate-600 rounded-xl hover:bg-slate-50 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md border border-slate-200 flex items-center space-x-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span>Reset to Default</span>
                                </button>
                            )}
                            
                            {/* PDF Generation Buttons - Integrated */}
                            <div className="flex gap-3 ml-auto">
                                <button
                                    onClick={handleDownload}
                                    disabled={!isValidJson || loading}
                                    className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2 ${
                                        isValidJson && !loading
                                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700'
                                            : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none transform-none'
                                    }`}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Generating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span>Download PDF</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handlePreview}
                                    disabled={!isValidJson || loading}
                                    className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2 ${
                                        isValidJson && !loading
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                                            : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none transform-none'
                                    }`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <span>Preview PDF</span>
                                </button>
                            </div>
                        </div>
                        
                        {/* Status Message */}
                        {!isValidJson && (
                            <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl animate-in slide-in-from-bottom-2 duration-300">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </div>
                                    <p className="text-amber-800 text-sm font-medium">
                                        {uploadedFileName || editorValue ? 
                                            'Please validate your JSON configuration to enable PDF generation' : 
                                            'Upload a JSON file or use the editor to get started with PDF generation'
                                        }
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* JSON Structure Documentation */}
                {showJsonStructure && (
                    <div className="bg-gray-50 rounded-lg p-6 mb-8 border">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                📋 JSON Configuration Structure
                            </h3>
                            <button
                                onClick={() => {
                                    const jsonStructure = JSON.stringify({
                                        "metadata": {
                                            "title": "Your API Documentation",
                                            "author": "Your Team",
                                            "subject": "API Reference",
                                            "keywords": "API, Documentation, REST",
                                            "version": "1.0",
                                            "filename": "your-api-documentation.pdf"
                                        },
                                        "api": {
                                            "baseUrl": "https://api.yourcompany.com/",
                                            "version": "v1",
                                            "protocol": "HTTPS",
                                            "authMethod": "API Key (Header-based)",
                                            "authHeader": "x-api-key"
                                        },
                                        "colors": {
                                            "primary": "#1e40af",
                                            "primaryDark": "#1e293b",
                                            "secondary": "#2563eb",
                                            "success": "#10b981",
                                            "warning": "#d97706",
                                            "error": "#dc2626"
                                        },
                                        "pages": [
                                            {
                                                "id": "overview",
                                                "sections": [
                                                    {
                                                        "type": "header",
                                                        "title": "API Documentation"
                                                    },
                                                    {
                                                        "type": "section",
                                                        "title": "Get Loads Details",
                                                        "endpoints": [
                                                            {
                                                                "method": "GET",
                                                                "path": "/api/DomoData/GetLoads",
                                                                "description": "Retrieves detailed information about loads.",
                                                                "parameters": [
                                                                    {
                                                                        "name": "LoadStatusIds",
                                                                        "type": "array[integer]",
                                                                        "description": "Filter by specific load status IDs",
                                                                        "category": "status"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }, null, 2);
                                    navigator.clipboard.writeText(jsonStructure).then(() => {
                                        alert('JSON structure copied to clipboard!');
                                    });
                                }}
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                            >
                                📋 Copy Structure
                            </button>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                            <pre className="text-sm text-gray-100">
{`{
  "metadata": {
    "title": "Your API Documentation",
    "author": "Your Team",
    "subject": "API Reference",
    "keywords": "API, Documentation, REST",
    "version": "1.0",
    "filename": "your-api-documentation.pdf"
  },
  "api": {
    "baseUrl": "https://api.yourcompany.com/",
    "version": "v1",
    "protocol": "HTTPS",
    "authMethod": "API Key (Header-based)",
    "authHeader": "x-api-key"
  },
  "colors": {
    "primary": "#1e40af",
    "primaryDark": "#1e293b",
    "secondary": "#2563eb",
    "success": "#10b981",
    "warning": "#d97706",
    "error": "#dc2626"
  },
  "pages": [
    {
      "id": "overview",
      "sections": [
        {
          "type": "header",
          "title": "API Documentation"
        },
        {
          "type": "section",
          "title": "Get Loads Details",
          "endpoints": [
            {
              "method": "GET",
              "path": "/api/DomoData/GetLoads",
              "description": "Retrieves detailed information about loads.",
              "parameters": [
                {
                  "name": "LoadStatusIds",
                  "type": "array[integer]",
                  "description": "Filter by specific load status IDs",
                  "category": "status"
                },
                {
                  "name": "JobIds",
                  "type": "array[integer]",
                  "description": "Filter by specific job IDs",
                  "category": "job"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}`}
                            </pre>
                        </div>
                        <div className="mt-4 text-sm text-gray-600">
                            <h4 className="font-semibold mb-2">Enhanced Structure Components:</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <h5 className="font-medium mb-1">Endpoint Definition:</h5>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li><code className="bg-gray-200 px-1 rounded">method</code> - HTTP method (GET, POST, etc.)</li>
                                        <li><code className="bg-gray-200 px-1 rounded">path</code> - API endpoint path</li>
                                        <li><code className="bg-gray-200 px-1 rounded">description</code> - Detailed endpoint description</li>
                                        <li><code className="bg-gray-200 px-1 rounded">parameters</code> - Array of parameter objects</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="font-medium mb-1">Parameter Properties:</h5>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li><code className="bg-gray-200 px-1 rounded">name</code> - Parameter name</li>
                                        <li><code className="bg-gray-200 px-1 rounded">type</code> - Data type (string, integer, array, etc.)</li>
                                        <li><code className="bg-gray-200 px-1 rounded">description</code> - Parameter description</li>
                                        <li><code className="bg-gray-200 px-1 rounded">category</code> - Grouping category (optional)</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                <h5 className="font-medium text-blue-900 mb-2">Parameter Categories:</h5>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-blue-800 text-sm">
                                    <div><code className="bg-blue-200 px-1 rounded">status</code> - Status filters</div>
                                    <div><code className="bg-blue-200 px-1 rounded">job</code> - Job-related filters</div>
                                    <div><code className="bg-blue-200 px-1 rounded">customer</code> - Customer filters</div>
                                    <div><code className="bg-blue-200 px-1 rounded">plant</code> - Plant filters</div>
                                    <div><code className="bg-blue-200 px-1 rounded">product</code> - Product filters</div>
                                    <div><code className="bg-blue-200 px-1 rounded">truck</code> - Truck filters</div>
                                    <div><code className="bg-blue-200 px-1 rounded">hauler</code> - Hauler filters</div>
                                    <div><code className="bg-blue-200 px-1 rounded">driver</code> - Driver filters</div>
                                    <div><code className="bg-blue-200 px-1 rounded">load</code> - Load filters</div>
                                    <div><code className="bg-blue-200 px-1 rounded">purchase-order</code> - PO filters</div>
                                    <div><code className="bg-blue-200 px-1 rounded">original</code> - Original values</div>
                                    <div><code className="bg-blue-200 px-1 rounded">new</code> - New/updated values</div>
                                    <div><code className="bg-blue-200 px-1 rounded">sorting</code> - Sort parameters</div>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-green-50 rounded-lg">
                                <h5 className="font-medium text-green-900 mb-1">Table Configuration:</h5>
                                <p className="text-green-800 text-sm">Use <code className="bg-green-200 px-1 rounded">columnWidths</code> array to control table column proportions. Values should sum to 1.0 (e.g., [0.25, 0.2, 0.15, 0.4]).</p>
                            </div>
                            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                                <h5 className="font-medium text-purple-900 mb-1">Best Practices:</h5>
                                <ul className="text-purple-800 text-sm space-y-1">
                                    <li>• <code className="bg-purple-200 px-1 rounded">parameters</code> - Define parameters directly in endpoint object (cleaner structure)</li>
                                    <li>• <code className="bg-purple-200 px-1 rounded">category</code> - Group related parameters for better organization</li>
                                    <li>• <code className="bg-purple-200 px-1 rounded">format</code> - Specify data format</li>
                                    <li>• <code className="bg-purple-200 px-1 rounded">subsections</code> - Optional: Use only when you need additional tables/content</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Features Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        ✨ Documentation Features
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-start">
                            <svg
                                className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <div>
                                <p className="font-medium text-gray-900 text-sm">
                                    Complete API Reference
                                </p>
                                <p className="text-gray-600 text-xs mt-1">
                                    All endpoints with detailed parameters and responses
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <svg
                                className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <div>
                                <p className="font-medium text-gray-900 text-sm">
                                    Authentication Guide
                                </p>
                                <p className="text-gray-600 text-xs mt-1">
                                    Security implementation and best practices
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <svg
                                className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <div>
                                <p className="font-medium text-gray-900 text-sm">
                                    Code Examples
                                </p>
                                <p className="text-gray-600 text-xs mt-1">
                                    Ready-to-use code snippets and examples
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <svg
                                className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <div>
                                <p className="font-medium text-gray-900 text-sm">
                                    Error Handling
                                </p>
                                <p className="text-gray-600 text-xs mt-1">
                                    Comprehensive error codes and troubleshooting
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}