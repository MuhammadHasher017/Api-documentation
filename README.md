# Dynamic PDF Generator for Next.js

A flexible, JSON-driven PDF generation system for Next.js applications using `@react-pdf/renderer`. Simply update a JSON configuration file to change your PDF content - no code changes required!

## 🚀 Features

- **JSON-Driven Configuration**: Update PDF content by editing a single JSON file
- **Dynamic Variable Replacement**: Use `{api.baseUrl}` style variables throughout your content
- **Flexible Styling**: Customize colors, fonts, and layouts via JSON
- **Multiple Section Types**: Support for headers, tables, code blocks, lists, info boxes, and more
- **Automatic Pagination**: Smart page breaks and content wrapping
- **Download or Preview**: Generate PDFs for download or open in new tab

## 📦 Installation

1. Install dependencies:

```bash
npm install @react-pdf/renderer
```

2. Copy the following files to your Next.js project:

```
your-project/
├── config/
│   └── api-doc-config.json       # PDF configuration
├── lib/
│   ├── DynamicPDFDocument.jsx    # PDF document component
│   └── pdfGenerator.js           # PDF generation utilities
└── app/
    └── api-docs/
        └── page.jsx              # Example page with download button
```

## 🎯 Quick Start

### Basic Usage

```jsx
'use client';

import { downloadPDF } from '@/lib/pdfGenerator';
import config from '@/config/api-doc-config.json';

export default function MyPage() {
  const handleDownload = async () => {
    await downloadPDF(config);
  };

  return (
    <button onClick={handleDownload}>
      Download PDF
    </button>
  );
}
```

### Usage with Your Custom Button Component

```jsx
import { downloadPDF } from '@/lib/pdfGenerator';
import apiDocConfig from '@/config/api-doc-config.json';

const handleDownloadApiDoc = async () => {
  try {
    await downloadPDF(apiDocConfig);
  } catch (error) {
    console.error('Failed to generate PDF:', error);
  }
};

// Your existing button component
<AtlasButton
  title={t('settings.apiDocumentation')}
  onPressHandler={handleDownloadApiDoc}
  isFilledButton={true}
/>
```

## 📋 JSON Configuration Structure

### Root Level Structure

```json
{
  "metadata": { },      // PDF metadata
  "api": { },           // API configuration (for variable replacement)
  "colors": { },        // Color theme
  "pages": [ ]          // Array of page definitions
}
```

### 1. Metadata Section

```json
{
  "metadata": {
    "title": "My API Documentation",
    "author": "Your Company",
    "subject": "API Documentation",
    "keywords": "API, REST, Documentation",
    "version": "1.0",
    "filename": "my-api-docs.pdf"
  }
}
```

### 2. API Configuration (Variables)

Define variables that can be referenced throughout your content using `{api.variableName}`:

```json
{
  "api": {
    "baseUrl": "https://api.example.com/",
    "version": "v1",
    "protocol": "HTTPS",
    "authMethod": "API Key",
    "authHeader": "x-api-key"
  }
}
```

**Usage in content:**
```json
{
  "content": "The base URL is {api.baseUrl}"
}
```

### 3. Colors Theme

```json
{
  "colors": {
    "primary": "#1e40af",
    "primaryDark": "#1e293b",
    "secondary": "#2563eb",
    "success": "#10b981",
    "warning": "#d97706",
    "error": "#dc2626"
  }
}
```

### 4. Pages Array

Each page contains sections:

```json
{
  "pages": [
    {
      "id": "page-1",
      "sections": [
        // Section definitions go here
      ]
    }
  ]
}
```

## 🎨 Section Types

### Header Section

```json
{
  "type": "header",
  "title": "My Document Title"
}
```

### Basic Section

```json
{
  "type": "section",
  "title": "Section Title",
  "content": "Section content here...",
  "helpText": "Optional helper text in italic"
}
```

### Section with Numbered List

```json
{
  "type": "section",
  "title": "Steps to Follow",
  "content": "Follow these steps:",
  "list": {
    "type": "numbered",
    "items": [
      "First step",
      "Second step",
      "Third step"
    ]
  }
}
```

### Section with Bullet List

```json
{
  "type": "section",
  "title": "Features",
  "list": {
    "type": "bullet",
    "items": [
      "Feature one",
      "Feature two",
      "Feature three"
    ]
  }
}
```

### Info Box

```json
{
  "type": "infoBox",
  "title": "Quick Info",
  "variant": "blue",
  "items": [
    { "label": "API Version", "value": "{api.version}" },
    { "label": "Protocol", "value": "{api.protocol}" }
  ]
}
```

**Variants:** `default`, `blue`, `green`, `red`, `yellow`

### Info Box with List

```json
{
  "type": "infoBox",
  "variant": "blue",
  "title": "Important Notes",
  "content": "Please note the following:",
  "list": {
    "type": "bullet",
    "items": [
      "Note one",
      "Note two"
    ]
  }
}
```

### Table

```json
{
  "type": "section",
  "title": "Parameters",
  "table": {
    "headers": ["Name", "Type", "Description"],
    "columnWidths": [0.3, 0.2, 0.5],
    "rows": [
      ["id", "integer", "Unique identifier"],
      ["name", "string", "User name"],
      ["email", "string", "Email address"]
    ]
  }
}
```

### Code Block

```json
{
  "type": "section",
  "title": "Example Request",
  "codeBlock": {
    "code": "GET {api.baseUrl}api/users\nHeaders:\n{api.authHeader}: your_key_here"
  }
}
```

### Endpoint Card

```json
{
  "type": "section",
  "title": "Endpoints",
  "endpoints": [
    {
      "method": "GET",
      "path": "/api/users",
      "description": "Retrieve all users from the system"
    },
    {
      "method": "POST",
      "path": "/api/users",
      "description": "Create a new user"
    }
  ]
}
```

### Response Box

```json
{
  "type": "section",
  "title": "Response",
  "responseBox": {
    "code": "200 - Success",
    "description": "Request processed successfully"
  }
}
```

### Best Practices Section

```json
{
  "type": "section",
  "title": "Best Practices",
  "practices": [
    {
      "title": "Use Pagination",
      "content": "Always use pagination for large datasets"
    },
    {
      "title": "Cache Responses",
      "content": "Cache API responses to improve performance"
    }
  ]
}
```

### Security Badge

```json
{
  "type": "section",
  "subsections": [
    {
      "type": "securityBadge",
      "text": "Keep your API key secure and never share it publicly"
    }
  ]
}
```

### Subsections

You can nest subsections for more complex layouts:

```json
{
  "type": "section",
  "title": "Authentication",
  "content": "This API uses API key authentication.",
  "subsections": [
    {
      "type": "infoBox",
      "items": [
        { "label": "Method", "value": "API Key" },
        { "label": "Header", "value": "x-api-key" }
      ]
    },
    {
      "type": "securityBadge",
      "text": "Never expose your API key in client code"
    },
    {
      "type": "subsection",
      "title": "Example Header",
      "content": {
        "type": "codeBlock",
        "code": "x-api-key: your_api_key_here"
      }
    }
  ]
}
```

## 🔧 API Functions

### downloadPDF(config, filename?)

Downloads the PDF file.

```javascript
import { downloadPDF } from '@/lib/pdfGenerator';
import config from '@/config/api-doc-config.json';

await downloadPDF(config);
// or with custom filename
await downloadPDF(config, 'custom-name.pdf');
```

### generatePDF(config)

Opens the PDF in a new browser tab.

```javascript
import { generatePDF } from '@/lib/pdfGenerator';
import config from '@/config/api-doc-config.json';

await generatePDF(config);
```

### getPDFBlob(config)

Returns PDF as a Blob (useful for uploads or further processing).

```javascript
import { getPDFBlob } from '@/lib/pdfGenerator';
import config from '@/config/api-doc-config.json';

const blob = await getPDFBlob(config);
// Use blob for upload, etc.
```

## 🎯 Complete Example Configuration

Here's a minimal complete example:

```json
{
  "metadata": {
    "title": "My API Docs",
    "author": "Your Company",
    "version": "1.0",
    "filename": "api-docs.pdf"
  },
  "api": {
    "baseUrl": "https://api.example.com/",
    "version": "v1"
  },
  "colors": {
    "primary": "#1e40af",
    "success": "#10b981"
  },
  "pages": [
    {
      "id": "main",
      "sections": [
        {
          "type": "header",
          "title": "API Documentation"
        },
        {
          "type": "section",
          "title": "Getting Started",
          "content": "Welcome to our API. Base URL: {api.baseUrl}",
          "list": {
            "type": "numbered",
            "items": [
              "Get your API key",
              "Make your first request",
              "Review the documentation"
            ]
          }
        },
        {
          "type": "infoBox",
          "variant": "blue",
          "title": "Quick Info",
          "items": [
            { "label": "Version", "value": "{api.version}" },
            { "label": "Base URL", "value": "{api.baseUrl}" }
          ]
        }
      ]
    }
  ]
}
```

## 🔄 Variable Replacement

Use curly braces to reference any value from your config:

```json
{
  "api": {
    "baseUrl": "https://api.example.com/",
    "version": "v2"
  }
}
```

Then reference in content:
```json
{
  "content": "API version {api.version} is available at {api.baseUrl}"
}
```

Result: "API version v2 is available at https://api.example.com/"

## 🎨 Customizing Styles

To customize the PDF appearance, you can modify the colors in your config:

```json
{
  "colors": {
    "primary": "#your-color",
    "primaryDark": "#your-color",
    "secondary": "#your-color",
    "success": "#your-color",
    "warning": "#your-color",
    "error": "#your-color"
  }
}
```

For more advanced styling, edit the `createStyles` function in `DynamicPDFDocument.jsx`.

## 🐛 Troubleshooting

### PDF Not Generating

1. Check that all required fields are present in your JSON
2. Validate your JSON syntax (use a JSON validator)
3. Check browser console for error messages

### Content Not Showing

1. Verify section types are spelled correctly
2. Check that variable references match your config structure
3. Ensure arrays and objects are properly formatted

### Page Break Issues

If content is cutting off at page boundaries, adjust the `minPresenceAhead` values in the component or restructure your content into smaller sections.

## 📝 License

This component is provided as-is for use in your projects.

## 🤝 Contributing

Feel free to customize and extend this component for your needs!

---

**Need help?** Check the example configuration in `api-doc-config.json` for a complete working example.
