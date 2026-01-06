# JSON Configuration Schema Reference

Complete reference for all available configuration options in the Dynamic PDF Generator.

## Table of Contents

1. [Root Structure](#root-structure)
2. [Metadata](#metadata)
3. [API Configuration](#api-configuration)
4. [Colors](#colors)
5. [Pages](#pages)
6. [Section Types](#section-types)
7. [Variable Replacement](#variable-replacement)
8. [Examples](#examples)

---

## Root Structure

```json
{
  "metadata": { },      // Required: PDF metadata
  "api": { },           // Optional: Variables for replacement
  "colors": { },        // Optional: Color theme (uses defaults if omitted)
  "pages": [ ]          // Required: Array of page definitions
}
```

---

## Metadata

Defines PDF document properties.

```json
{
  "metadata": {
    "title": "string",        // Required: PDF title
    "author": "string",       // Required: PDF author
    "subject": "string",      // Optional: PDF subject
    "keywords": "string",     // Optional: PDF keywords
    "version": "string",      // Required: Document version
    "filename": "string"      // Required: Default download filename
  }
}
```

**Example:**
```json
{
  "metadata": {
    "title": "API Documentation",
    "author": "Acme Corp",
    "subject": "REST API Reference",
    "keywords": "API, REST, Documentation",
    "version": "2.0",
    "filename": "api-docs-v2.pdf"
  }
}
```

---

## API Configuration

Define variables that can be referenced throughout the document using `{api.variableName}`.

```json
{
  "api": {
    "anyKey": "anyValue",
    "nested": {
      "value": "can be nested"
    }
  }
}
```

**Example:**
```json
{
  "api": {
    "baseUrl": "https://api.example.com/",
    "version": "v2",
    "protocol": "HTTPS",
    "authMethod": "Bearer Token",
    "authHeader": "Authorization",
    "company": {
      "name": "Acme Corp",
      "email": "support@acme.com"
    }
  }
}
```

**Usage in content:**
```json
{
  "content": "Connect to {api.baseUrl} using {api.protocol}"
}
```

---

## Colors

Customize the color theme. All colors are optional and will use defaults if omitted.

```json
{
  "colors": {
    "primary": "#hexcode",        // Main brand color
    "primaryDark": "#hexcode",    // Darker variant
    "secondary": "#hexcode",      // Secondary brand color
    "success": "#hexcode",        // Success state color
    "warning": "#hexcode",        // Warning state color
    "error": "#hexcode"           // Error state color
  }
}
```

**Default Colors:**
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

---

## Pages

An array of page objects. Each page contains sections.

```json
{
  "pages": [
    {
      "id": "unique-page-id",      // Required: Unique identifier
      "sections": [ ]               // Required: Array of section objects
    }
  ]
}
```

---

## Section Types

### 1. Header Section

Creates a prominent header with bottom border.

```json
{
  "type": "header",
  "title": "string"              // Required: Header text
}
```

**Example:**
```json
{
  "type": "header",
  "title": "API Documentation v{api.version}"
}
```

---

### 2. Basic Section

Standard content section with title and body text.

```json
{
  "type": "section",
  "title": "string",             // Optional: Section title
  "content": "string",           // Optional: Body text
  "helpText": "string"           // Optional: Italic helper text
}
```

**Example:**
```json
{
  "type": "section",
  "title": "Introduction",
  "content": "Welcome to our API documentation. This guide covers all endpoints.",
  "helpText": "Pro tip: Start with the Getting Started section"
}
```

---

### 3. Section with Lists

#### Bullet List

```json
{
  "type": "section",
  "title": "string",
  "content": "string",
  "list": {
    "type": "bullet",
    "items": [
      "First item",
      "Second item",
      "Third item"
    ]
  }
}
```

#### Numbered List

```json
{
  "type": "section",
  "title": "string",
  "content": "string",
  "list": {
    "type": "numbered",
    "items": [
      "Step one",
      "Step two",
      "Step three"
    ]
  }
}
```

**Example:**
```json
{
  "type": "section",
  "title": "Setup Instructions",
  "content": "Follow these steps to get started:",
  "list": {
    "type": "numbered",
    "items": [
      "Install dependencies using npm install",
      "Configure your API key in .env file",
      "Start the development server",
      "Make your first API request"
    ]
  }
}
```

---

### 4. Info Box

Highlighted box for important information.

```json
{
  "type": "infoBox",
  "title": "string",             // Optional: Box title
  "variant": "string",           // Optional: "default"|"blue"|"green"|"red"|"yellow"
  "content": "string",           // Optional: Body text
  "items": [ ],                  // Optional: Key-value pairs
  "list": { }                    // Optional: Bullet or numbered list
}
```

#### Info Box with Key-Value Pairs

```json
{
  "type": "infoBox",
  "title": "API Details",
  "variant": "blue",
  "items": [
    { "label": "Base URL", "value": "{api.baseUrl}" },
    { "label": "Version", "value": "{api.version}" },
    { "label": "Protocol", "value": "{api.protocol}" }
  ]
}
```

#### Info Box with List

```json
{
  "type": "infoBox",
  "variant": "yellow",
  "title": "Important Notes",
  "content": "Please be aware of:",
  "list": {
    "type": "bullet",
    "items": [
      "Rate limits apply to all endpoints",
      "Authentication is required",
      "HTTPS is mandatory"
    ]
  }
}
```

---

### 5. Table

Create structured data tables.

```json
{
  "type": "section",
  "title": "string",
  "helpText": "string",
  "table": {
    "headers": ["Col 1", "Col 2", "Col 3"],
    "columnWidths": [0.3, 0.3, 0.4],        // Must sum to ≈1.0
    "rows": [
      ["Cell 1", "Cell 2", "Cell 3"],
      ["Cell 4", "Cell 5", "Cell 6"]
    ]
  }
}
```

**Example:**
```json
{
  "type": "section",
  "title": "API Parameters",
  "helpText": "All parameters are optional unless marked as required",
  "table": {
    "headers": ["Parameter", "Type", "Required", "Description"],
    "columnWidths": [0.2, 0.15, 0.15, 0.5],
    "rows": [
      ["id", "integer", "Yes", "Unique identifier"],
      ["name", "string", "Yes", "User's name"],
      ["email", "string", "Yes", "User's email"],
      ["age", "integer", "No", "User's age"],
      ["active", "boolean", "No", "Account status"]
    ]
  }
}
```

---

### 6. Code Block

Display formatted code or API requests.

```json
{
  "type": "section",
  "title": "string",
  "helpText": "string",
  "codeBlock": {
    "code": "string"             // Code content (supports \n for newlines)
  }
}
```

**Example:**
```json
{
  "type": "section",
  "title": "Example Request",
  "helpText": "Copy and paste this into your terminal",
  "codeBlock": {
    "code": "curl -X GET {api.baseUrl}users \\\n  -H 'Authorization: Bearer YOUR_TOKEN' \\\n  -H 'Content-Type: application/json'"
  }
}
```

---

### 7. Endpoint Cards

Display API endpoint information.

```json
{
  "type": "section",
  "title": "string",
  "endpoints": [
    {
      "method": "GET|POST|PUT|DELETE|PATCH",
      "path": "string",
      "description": "string"
    }
  ]
}
```

**Example:**
```json
{
  "type": "section",
  "title": "User Endpoints",
  "endpoints": [
    {
      "method": "GET",
      "path": "/api/users",
      "description": "Retrieve a list of all users with pagination support"
    },
    {
      "method": "GET",
      "path": "/api/users/{id}",
      "description": "Get detailed information about a specific user"
    },
    {
      "method": "POST",
      "path": "/api/users",
      "description": "Create a new user account with provided details"
    },
    {
      "method": "PUT",
      "path": "/api/users/{id}",
      "description": "Update an existing user's information"
    },
    {
      "method": "DELETE",
      "path": "/api/users/{id}",
      "description": "Permanently delete a user account"
    }
  ]
}
```

---

### 8. Response Box

Highlight HTTP response information.

```json
{
  "type": "section",
  "title": "string",
  "content": "string",
  "responseBox": {
    "code": "string",            // HTTP status code and label
    "description": "string"      // Description of the response
  }
}
```

**Example:**
```json
{
  "type": "section",
  "title": "Success Response",
  "content": "On successful authentication, you will receive:",
  "responseBox": {
    "code": "200 - Success",
    "description": "Authentication successful. A JWT token is returned in the response body."
  }
}
```

---

### 9. Best Practices Section

List of best practices with titles and descriptions.

```json
{
  "type": "section",
  "title": "string",
  "practices": [
    {
      "title": "string",
      "content": "string"
    }
  ]
}
```

**Example:**
```json
{
  "type": "section",
  "title": "Best Practices",
  "practices": [
    {
      "title": "Use Pagination",
      "content": "Always implement pagination for endpoints that return lists. Recommended page size is 50-100 items."
    },
    {
      "title": "Cache Responses",
      "content": "Cache GET request responses when possible to reduce server load and improve performance."
    },
    {
      "title": "Handle Rate Limits",
      "content": "Implement exponential backoff when you receive 429 (Too Many Requests) responses."
    },
    {
      "title": "Secure API Keys",
      "content": "Never expose API keys in client-side code. Store them in environment variables."
    }
  ]
}
```

---

### 10. Subsections

Nest additional content within a section.

```json
{
  "type": "section",
  "title": "string",
  "content": "string",
  "subsections": [
    {
      "type": "infoBox",        // Any valid section type
      // ... section properties
    },
    {
      "type": "securityBadge",
      "text": "string"
    },
    {
      "type": "subsection",
      "title": "string",
      "content": {
        "type": "codeBlock",
        "code": "string"
      }
    }
  ]
}
```

**Example:**
```json
{
  "type": "section",
  "title": "Authentication",
  "content": "Our API uses Bearer token authentication.",
  "subsections": [
    {
      "type": "infoBox",
      "variant": "blue",
      "title": "Authentication Details",
      "items": [
        { "label": "Type", "value": "Bearer Token" },
        { "label": "Header", "value": "Authorization" },
        { "label": "Format", "value": "Bearer <token>" }
      ]
    },
    {
      "type": "securityBadge",
      "text": "Never share your authentication token. Treat it like a password."
    },
    {
      "type": "subsection",
      "title": "Example Header",
      "content": {
        "type": "codeBlock",
        "code": "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }
  ]
}
```

---

### 11. Security Badge

Warning or security notice with yellow background.

```json
{
  "type": "securityBadge",
  "text": "string"
}
```

**Example:**
```json
{
  "type": "section",
  "title": "API Security",
  "subsections": [
    {
      "type": "securityBadge",
      "text": "Keep your API credentials secure. Never commit them to version control or share them publicly."
    }
  ]
}
```

---

## Variable Replacement

Use `{path.to.value}` syntax to reference values from the config.

### Syntax

```
{api.propertyName}              // Top-level api property
{api.nested.property}           // Nested property
{metadata.title}                // Metadata property
```

### Examples

**Config:**
```json
{
  "api": {
    "baseUrl": "https://api.example.com/",
    "version": "v2",
    "company": {
      "name": "Acme Corp",
      "support": "support@acme.com"
    }
  }
}
```

**Usage:**
```json
{
  "content": "Connect to {api.baseUrl} for {api.company.name} API {api.version}"
}
```

**Result:**
```
Connect to https://api.example.com/ for Acme Corp API v2
```

---

## Complete Example

Here's a complete, minimal configuration:

```json
{
  "metadata": {
    "title": "My API",
    "author": "Dev Team",
    "version": "1.0",
    "filename": "my-api.pdf"
  },
  "api": {
    "baseUrl": "https://api.mysite.com/"
  },
  "colors": {
    "primary": "#3b82f6"
  },
  "pages": [
    {
      "id": "main",
      "sections": [
        {
          "type": "header",
          "title": "My API"
        },
        {
          "type": "section",
          "title": "Quick Start",
          "content": "Base URL: {api.baseUrl}",
          "list": {
            "type": "numbered",
            "items": [
              "Get API key",
              "Make request",
              "Handle response"
            ]
          }
        }
      ]
    }
  ]
}
```

---

## Tips

1. **Validation**: Use a JSON validator to check syntax before generating PDFs
2. **Variables**: Define commonly used values in the `api` object for easy updates
3. **Colors**: Stick to hex color codes (#RRGGBB format)
4. **Column Widths**: Table column widths should sum to approximately 1.0
5. **Page Breaks**: The system handles page breaks automatically
6. **Testing**: Start with a simple config and add complexity gradually

---

## Common Patterns

### Multi-Page Document

```json
{
  "pages": [
    {
      "id": "overview",
      "sections": [ /* Overview content */ ]
    },
    {
      "id": "authentication",
      "sections": [ /* Auth content */ ]
    },
    {
      "id": "endpoints",
      "sections": [ /* Endpoint content */ ]
    }
  ]
}
```

### Endpoint Documentation Pattern

```json
{
  "type": "section",
  "title": "GET /users",
  "content": "Retrieves a list of users",
  "subsections": [
    {
      "type": "section",
      "title": "Parameters",
      "table": { /* parameter table */ }
    },
    {
      "type": "section",
      "title": "Example Request",
      "codeBlock": { /* request code */ }
    },
    {
      "type": "section",
      "title": "Response",
      "responseBox": { /* response info */ }
    }
  ]
}
```

---

For more examples, see `simple-example-config.json` and `api-doc-config.json`.
