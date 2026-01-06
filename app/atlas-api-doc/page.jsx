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
    const fileInputRef = useRef(null);
    const editorRef = useRef(null);

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

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Atlas API Documentation
                    </h1>
                    <p className="text-lg text-gray-600">
                        Generate comprehensive API documentation PDF
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
                        <div className="flex">
                            <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h3 className="text-sm font-medium text-red-800">JSON Validation Error</h3>
                                <p className="text-red-700 text-sm mt-1 whitespace-pre-wrap">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modern Upload/Editor Section */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            📄 JSON Configuration
                        </h3>
                        <p className="text-sm text-gray-600">
                            Upload a JSON file or use the editor to create your API documentation
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex mb-4 border-b px-6">
                        <button
                            onClick={() => setActiveTab('upload')}
                            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === 'upload'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            📤 Upload File
                        </button>
                        <button
                            onClick={() => setActiveTab('editor')}
                            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === 'editor'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            🎨 JSON Editor
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
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        JSON Editor with Syntax Highlighting:
                                    </label>
                                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                                        <Editor
                                            height="400px"
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
                                                minimap: { enabled: false },
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
                                            }}
                                            theme="vs-dark"
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">
                                        Full-featured JSON editor with syntax highlighting, error detection, and auto-formatting.
                                    </p>
                                </div>
                                {editorValue && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={validateAndSetJsonText}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                                        >
                                            ✓ Validate JSON
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (editorRef.current) {
                                                    editorRef.current.getAction('editor.action.formatDocument').run();
                                                }
                                            }}
                                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm font-medium"
                                        >
                                            🎨 Format JSON
                                        </button>
                                        <button
                                            onClick={() => setEditorValue('')}
                                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                )}
                                {!editorValue && (
                                    <button
                                        onClick={() => {
                                            const sampleJson = JSON.stringify(apiDocConfig, null, 2);
                                            setEditorValue(sampleJson);
                                            setCustomConfig(apiDocConfig);
                                            setIsValidJson(true);
                                        }}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                                    >
                                        📝 Load Sample JSON
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 mt-6 p-4 bg-gray-50 rounded-lg border-t">
                            <button
                                onClick={() => setShowJsonStructure(!showJsonStructure)}
                                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm font-medium"
                            >
                                {showJsonStructure ? 'Hide' : 'Show'} JSON Structure
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
                                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors text-sm font-medium"
                            >
                                ⬇️ Download Sample
                            </button>
                            {(customConfig || editorValue) && (
                                <button
                                    onClick={resetToDefault}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
                                >
                                    Reset to Default
                                </button>
                            )}
                            
                            {/* PDF Generation Buttons - Integrated */}
                            <div className="flex gap-2 ml-auto">
                                <button
                                    onClick={handleDownload}
                                    disabled={!isValidJson || loading}
                                    className={`px-6 py-2 rounded-md font-medium text-sm transition-colors ${
                                        isValidJson && !loading
                                            ? 'bg-green-600 text-white hover:bg-green-700'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Generating...
                                        </div>
                                    ) : (
                                        '📄 Download PDF'
                                    )}
                                </button>
                                <button
                                    onClick={handlePreview}
                                    disabled={!isValidJson || loading}
                                    className={`px-6 py-2 rounded-md font-medium text-sm transition-colors ${
                                        isValidJson && !loading
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    👁️ Preview PDF
                                </button>
                            </div>
                        </div>
                        
                        {/* Status Message */}
                        {!isValidJson && (
                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    <p className="text-yellow-800 text-sm">
                                        {uploadedFileName || editorValue ? 
                                            'Please validate your JSON to enable PDF generation' : 
                                            'Upload a JSON file or use the editor to enable PDF generation'
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
                                    <li>• <code className="bg-purple-200 px-1 rounded">format</code> - Specify data format (e.g., "int32" for integers)</li>
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