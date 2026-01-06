# 🚀 Quick Setup Guide

This is a complete, ready-to-run Next.js application with dynamic PDF generation.

## 📦 Installation

1. **Navigate to the project directory:**
   ```bash
   cd pdf-generator-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   ```
   http://localhost:3000
   ```

That's it! The app is ready to use.

## 🎯 What You'll See

When you open the app, you'll see:

- **API Documentation PDF** - A complete example with all features
- **Simple Example PDF** - A simplified version for learning
- Download and Preview buttons for each PDF

## 📁 Project Structure

```
pdf-generator-app/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.jsx           # Root layout
│   └── page.jsx             # Main page with PDF buttons
│
├── lib/
│   ├── DynamicPDFDocument.jsx   # PDF document component
│   └── pdfGenerator.js          # PDF generation utilities
│
├── config/
│   ├── api-doc-config.json      # Full API documentation config
│   └── simple-example-config.json  # Simple example config
│
├── public/                   # Static files
│
├── package.json              # Dependencies
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── jsconfig.json             # JavaScript configuration
├── .eslintrc.json            # ESLint configuration
├── .gitignore                # Git ignore rules
│
├── README.md                 # Full documentation
├── PROJECT_STRUCTURE.md      # Project organization guide
├── JSON_SCHEMA_REFERENCE.md  # Complete JSON schema reference
└── SETUP.md                  # This file
```

## 🎨 Customizing Your PDFs

### Option 1: Modify Existing Configs

Edit the files in the `/config` folder:

```bash
# Edit the API documentation
nano config/api-doc-config.json

# Edit the simple example
nano config/simple-example-config.json
```

### Option 2: Create New Configs

1. Create a new JSON file in `/config`:
   ```bash
   touch config/my-custom-doc.json
   ```

2. Use the schema from `JSON_SCHEMA_REFERENCE.md`

3. Import and use it in your page:
   ```jsx
   import myConfig from '@/config/my-custom-doc.json';
   
   <button onClick={() => downloadPDF(myConfig)}>
     Download My PDF
   </button>
   ```

## 🔧 Common Customizations

### Change Colors

Edit your config JSON:

```json
{
  "colors": {
    "primary": "#your-color",
    "secondary": "#your-color"
  }
}
```

### Add New Content Sections

Add to the `pages[].sections[]` array in your config:

```json
{
  "type": "section",
  "title": "My New Section",
  "content": "My content here"
}
```

### Use Variables

Define variables in the `api` object:

```json
{
  "api": {
    "myVariable": "My Value"
  }
}
```

Reference them with `{api.myVariable}` anywhere in your content.

## 📚 Documentation

- **README.md** - Complete usage guide and examples
- **PROJECT_STRUCTURE.md** - How to organize your files
- **JSON_SCHEMA_REFERENCE.md** - All available JSON options

## 🐛 Troubleshooting

### Error: Module not found

Make sure you ran `npm install` first.

### PDF not generating

1. Check the browser console for errors
2. Validate your JSON syntax
3. Ensure all required fields are present

### Styles not working

Run `npm run dev` again to rebuild Tailwind CSS.

## 🚀 Production Build

To create a production build:

```bash
npm run build
npm start
```

## 📝 Next Steps

1. ✅ Run `npm install`
2. ✅ Run `npm run dev`
3. ✅ Open http://localhost:3000
4. ✅ Click "Download" or "Preview" on any PDF
5. ✅ Edit `config/api-doc-config.json` to customize
6. ✅ Refresh the page and generate again

## 🎓 Learning Resources

1. Start with `simple-example-config.json` to understand the basics
2. Read `JSON_SCHEMA_REFERENCE.md` for all options
3. Look at `api-doc-config.json` for advanced examples
4. Check `README.md` for detailed documentation

## 💡 Tips

- Use the Preview button to view PDFs before downloading
- Test with the simple example first
- Validate your JSON before generating
- Check the schema reference for all section types

---

**Need Help?** Check the documentation files or open an issue on GitHub.

**Happy PDF Generating! 🎉**
