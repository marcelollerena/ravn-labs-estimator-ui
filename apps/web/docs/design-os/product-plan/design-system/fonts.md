# Typography Configuration

## Google Fonts Import

Add to your HTML `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

## Font Usage

- **Headings:** Inter (semibold/bold, 15px+ for page titles)
- **Body text:** Inter (regular/medium, 13px for dense UI)
- **Labels/Badges:** Inter (medium, 11-12px uppercase tracking-wider for section headers)
- **Code/Technical:** JetBrains Mono (regular, 11-12px for hour ranges, format badges, char counts)

## Font Scale

| Element | Size | Weight | Notes |
|---------|------|--------|-------|
| Page title | 15px | 600 (semibold) | In PageHeader |
| Section header | 12px | 500 (medium) | Uppercase, tracking-wider |
| Body text | 13px | 400 (regular) | Primary content |
| Nav items | 13px | 500 (medium) | Sidebar navigation |
| Badge text | 11px | 500 (medium) | Status indicators |
| Mono data | 11-12px | 400 (regular) | JetBrains Mono for technical data |
