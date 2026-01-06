# Project Structure for Next.js Dynamic PDF Generator

## 📁 Recommended Folder Structure

```
your-nextjs-project/
│
├── app/                          # Next.js App Router
│   ├── api-docs/                 # Example page
│   │   └── page.jsx              # Page with download button
│   └── layout.jsx
│
├── lib/                          # Utility functions
│   ├── DynamicPDFDocument.jsx    # Main PDF document component
│   └── pdfGenerator.js           # PDF generation utilities
│
├── config/                       # Configuration files
│   └── api-doc-config.json       # PDF content configuration
│
├── public/                       # Static assets
│
├── package.json
└── README.md
```

## 📄 File Placement Guide

### 1. Core PDF Components

**Location:** `/lib/`

Files:
- `DynamicPDFDocument.jsx` - The main React-PDF component
- `pdfGenerator.js` - Utility functions for generating PDFs

### 2. Configuration

**Location:** `/config/`

Files:
- `api-doc-config.json` - Your PDF content configuration
- You can create multiple configs: `user-guide-config.json`, `terms-config.json`, etc.

### 3. Pages/Routes

**Location:** `/app/[your-route]/`

Example:
- `/app/api-docs/page.jsx` - API documentation download page
- `/app/settings/page.jsx` - Settings page with download button

### 4. Alternative Structure (Pages Router)

If using the Pages Router instead of App Router:

```
your-nextjs-project/
│
├── pages/
│   ├── api-docs.jsx              # API docs page
│   └── settings.jsx              # Settings page
│
├── lib/
│   ├── DynamicPDFDocument.jsx
│   └── pdfGenerator.js
│
├── config/
│   └── api-doc-config.json
│
└── package.json
```

## 🔧 Integration with Existing Components

### Option 1: Direct Integration in Your Component

```jsx
// app/settings/page.jsx
'use client';

import { downloadPDF } from '@/lib/pdfGenerator';
import apiDocConfig from '@/config/api-doc-config.json';
import { AtlasButton } from '@/components/AtlasButton';

export default function SettingsPage() {
  const handleDownloadApiDoc = async () => {
    try {
      await downloadPDF(apiDocConfig);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      // Handle error (show toast, alert, etc.)
    }
  };

  return (
    <div>
      {/* Your existing settings UI */}
      <AtlasButton
        title="Download API Documentation"
        onPressHandler={handleDownloadApiDoc}
        isFilledButton={true}
      />
    </div>
  );
}
```

### Option 2: Create a Reusable Hook

```jsx
// lib/hooks/usePDFDownload.js
'use client';

import { useState } from 'react';
import { downloadPDF } from '@/lib/pdfGenerator';

export function usePDFDownload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const download = async (config, filename) => {
    try {
      setLoading(true);
      setError(null);
      await downloadPDF(config, filename);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { download, loading, error };
}
```

Usage:
```jsx
// Your component
import { usePDFDownload } from '@/lib/hooks/usePDFDownload';
import apiDocConfig from '@/config/api-doc-config.json';

export default function MyComponent() {
  const { download, loading, error } = usePDFDownload();

  const handleDownload = () => download(apiDocConfig);

  return (
    <AtlasButton
      title="Download PDF"
      onPressHandler={handleDownload}
      isFilledButton={true}
      disabled={loading}
    />
  );
}
```

## 🎯 Multiple PDF Configurations

You can maintain multiple PDF configurations for different documents:

```
config/
├── api-doc-config.json           # API documentation
├── user-guide-config.json        # User guide
├── terms-of-service-config.json  # Terms of service
└── privacy-policy-config.json    # Privacy policy
```

Then use them as needed:

```jsx
import apiDocs from '@/config/api-doc-config.json';
import userGuide from '@/config/user-guide-config.json';

const downloadApiDocs = () => downloadPDF(apiDocs);
const downloadUserGuide = () => downloadPDF(userGuide);
```

## 📦 Import Path Aliases

Make sure your `tsconfig.json` or `jsconfig.json` has path aliases configured:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

This allows you to use clean imports like:
```javascript
import { downloadPDF } from '@/lib/pdfGenerator';
import config from '@/config/api-doc-config.json';
```

## 🚀 Deployment Notes

### Static File Handling

The JSON config files will be bundled with your application. If you need to update them frequently without redeploying:

1. Move configs to `/public/configs/`
2. Fetch them at runtime:

```javascript
const response = await fetch('/configs/api-doc-config.json');
const config = await response.json();
await downloadPDF(config);
```

### Server-Side Generation

If you want to generate PDFs server-side (e.g., for email attachments):

```javascript
// app/api/generate-pdf/route.js
import { pdf } from '@react-pdf/renderer';
import DynamicPDFDocument from '@/lib/DynamicPDFDocument';
import config from '@/config/api-doc-config.json';

export async function GET() {
  const blob = await pdf(<DynamicPDFDocument config={config} />).toBlob();
  
  return new Response(blob, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="document.pdf"',
    },
  });
}
```

## 🎨 TypeScript Support (Optional)

If using TypeScript, create type definitions:

```typescript
// types/pdf-config.d.ts
export interface PDFConfig {
  metadata: {
    title: string;
    author: string;
    subject: string;
    keywords: string;
    version: string;
    filename: string;
  };
  api: {
    baseUrl: string;
    version: string;
    protocol: string;
    authMethod: string;
    authHeader: string;
  };
  colors: {
    primary: string;
    primaryDark: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
  };
  pages: Array<{
    id: string;
    sections: Array<any>; // Define specific section types as needed
  }>;
}
```

Then use it:

```typescript
import { downloadPDF } from '@/lib/pdfGenerator';
import type { PDFConfig } from '@/types/pdf-config';
import apiDocConfig from '@/config/api-doc-config.json';

const config: PDFConfig = apiDocConfig;
await downloadPDF(config);
```

---

**Quick Start:** Copy the files to the recommended locations, update the config JSON, and you're ready to generate PDFs!
