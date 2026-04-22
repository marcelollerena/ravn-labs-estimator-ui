# Typography Configuration

## Google Fonts Import

Add to your HTML `<head>` or CSS:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

## Font Usage

- **Headings:** Inter (600-700 weight)
- **Body text:** Inter (400-500 weight)
- **Code/technical:** JetBrains Mono (400-500 weight)

## CSS Application

```css
font-family: 'Inter', system-ui, sans-serif;
font-family: 'JetBrains Mono', monospace;
```

## Tailwind Classes

```
font-['Inter',system-ui,sans-serif]
font-['JetBrains_Mono',monospace]
```
