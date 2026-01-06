# 📄 PDF Generator App

A modern Next.js application for generating professional PDFs from JSON configuration files.

## ✨ Features

- 🎨 **JSON-Driven Configuration** - Update PDFs by editing JSON, no code changes needed
- 🔄 **Dynamic Variables** - Use `{api.variable}` syntax throughout your content
- 📊 **Rich Content Types** - Tables, lists, code blocks, info boxes, endpoints, and more
- 🎨 **Custom Styling** - Configure colors and themes via JSON
- 📱 **Responsive Design** - Beautiful UI built with Tailwind CSS
- ⚡ **Fast Generation** - Powered by @react-pdf/renderer 4.3.1
- 🔍 **Preview & Download** - View PDFs before downloading

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
# Navigate to http://localhost:3000
```

## 📖 Documentation

- **SETUP.md** - Quick setup guide (start here!)
- **README.md** - Complete usage documentation
- **PROJECT_STRUCTURE.md** - File organization guide
- **JSON_SCHEMA_REFERENCE.md** - JSON schema reference

## 🎯 Usage Example

### 1. Import your config and generator

```jsx
import { downloadPDF } from '@/lib/pdfGenerator';
import myConfig from '@/config/my-config.json';
```

### 2. Call the download function

```jsx
const handleDownload = async () => {
  await downloadPDF(myConfig);
};
```

### 3. Add to your button

```jsx
<button onClick={handleDownload}>
  Download PDF
</button>
```

## 📋 Config Structure

```json
{
  "metadata": {
    "title": "My Document",
    "author": "Your Name",
    "version": "1.0",
    "filename": "my-doc.pdf"
  },
  "api": {
    "baseUrl": "https://api.example.com/"
  },
  "colors": {
    "primary": "#3b82f6"
  },
  "pages": [
    {
      "id": "page1",
      "sections": [
        {
          "type": "header",
          "title": "My Document"
        },
        {
          "type": "section",
          "title": "Introduction",
          "content": "Welcome to my document"
        }
      ]
    }
  ]
}
```

## 🎨 Available Section Types

- `header` - Page header with title
- `section` - Basic content section
- `infoBox` - Highlighted information box (variants: blue, green, red, yellow)
- `table` - Data tables with custom column widths
- `codeBlock` - Code snippets and examples
- `endpoints` - API endpoint cards
- `responseBox` - HTTP response information
- `practices` - Best practices list
- `securityBadge` - Security warnings

See `JSON_SCHEMA_REFERENCE.md` for complete details.

## 📁 Project Structure

```
pdf-generator-app/
├── app/              # Next.js pages
├── lib/              # PDF components & utilities
├── config/           # JSON configurations
└── public/           # Static assets
```

## 🔧 Configuration

### Adding New PDFs

1. Create a new JSON file in `/config/`
2. Define your content structure
3. Import and use in your component

### Customizing Styles

Edit the `colors` object in your config:

```json
{
  "colors": {
    "primary": "#yourcolor",
    "secondary": "#yourcolor"
  }
}
```

### Using Variables

Define variables in the `api` section:

```json
{
  "api": {
    "baseUrl": "https://api.example.com/",
    "version": "v2"
  }
}
```

Use them anywhere with `{api.baseUrl}` or `{api.version}`.

## 🛠️ Tech Stack

- **Next.js 14** - React framework
- **React 18** - UI library
- **@react-pdf/renderer 4.3.1** - PDF generation
- **Tailwind CSS** - Styling
- **JavaScript** - Programming language

## 📦 Scripts

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🎓 Examples

### Simple Example

```jsx
import { downloadPDF } from '@/lib/pdfGenerator';

const simpleConfig = {
  metadata: {
    title: "Quick Guide",
    version: "1.0",
    filename: "guide.pdf"
  },
  pages: [{
    id: "main",
    sections: [{
      type: "header",
      title: "Quick Guide"
    }]
  }]
};

await downloadPDF(simpleConfig);
```

### With Variables

```json
{
  "api": {
    "companyName": "Acme Corp",
    "email": "support@acme.com"
  },
  "pages": [{
    "sections": [{
      "type": "section",
      "content": "Contact {api.companyName} at {api.email}"
    }]
  }]
}
```

## 🐛 Troubleshooting

**PDF not generating?**
- Check browser console for errors
- Validate JSON syntax
- Ensure all required fields are present

**Styles not working?**
- Run `npm run dev` to rebuild
- Clear browser cache

**Module not found?**
- Run `npm install` again
- Check import paths in code

## 📄 License

This project is open source and available for use in your projects.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 🔗 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React-PDF Documentation](https://react-pdf.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Made with ❤️ for easy PDF generation**
