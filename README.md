# CogniLoop - Expert Annotation Tool

A high-integrity, human-in-the-loop annotation interface for psychology specialists to refine data principles and annotate text samples with precision and efficiency.

![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![React](https://img.shields.io/badge/React-19.2-61dafb)
![Vite](https://img.shields.io/badge/Vite-6.4-646cff)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1-38bdf8)

## 🎯 Overview

CogniLoop is a specialized annotation platform designed for psychology researchers and data scientists to review, categorize, and refine text samples based on predefined principles. The tool combines AI-generated insights with expert human judgment to create high-quality annotated datasets.

## ✨ Features

### Core Functionality
- **Dynamic Principle Management**: Triple-click to rename principles, with real-time updates across the interface
- **Drag-and-Drop Reassignment**: Expand rows and drag them to different principles for easy recategorization
- **Column Resizing**: Apple-style smooth column resizing with visual feedback and minimum width constraints
- **Inline Editing**: Click to edit principle definitions, inclusion/exclusion criteria, and expert opinions
- **Undo/Redo Support**: Full undo history (Ctrl/Cmd+Z) for row reassignments with 50-action memory
- **Responsive Grid Layout**: Horizontal scrolling with sticky headers for large datasets

### Annotation Workflow
- **Context-Aware Display**: View preceding, target, and following text for comprehensive context
- **AI-Generated Insights**: Review LLM justifications and evidence quotes
- **Expert Opinion Layer**: Add and edit expert annotations with multi-line support
- **Score Visualization**: Track multiple annotator scores (A1, A2, A3)
- **Expandable Rows**: Double-click to expand rows for detailed review and editing

### Data Integrity
- **Principle-Based Organization**: Filter and view samples by principle assignment
- **Inclusion/Exclusion Criteria**: Define clear boundaries for each principle
- **Visual Feedback**: Drag-over highlighting and smooth transitions
- **Non-Destructive Editing**: All changes are tracked and can be undone

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2 with TypeScript
- **Build Tool**: Vite 6.4
- **Styling**: Tailwind CSS 4.1
- **State Management**: React Hooks (useState, useMemo, useEffect)
- **Fonts**: Inter (Google Fonts)

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/cogniloop-annotation.git
cd cogniloop-annotation

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your API keys (if using AI features)
# GEMINI_API_KEY=your_gemini_api_key_here

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 🔌 API Integration

### Backend API Endpoints (To be implemented)

The application expects the following REST API endpoints for full functionality:

#### Principles API

```typescript
// Get all principles
GET /api/principles
Response: Principle[]

// Update principle
PUT /api/principles/:id
Body: {
  label_name?: string;
  definition?: string;
  inclusion_criteria?: string;
  exclusion_criteria?: string;
}
Response: Principle

// Create principle
POST /api/principles
Body: {
  label_name: string;
  definition: string;
  inclusion_criteria: string;
  exclusion_criteria: string;
}
Response: Principle

// Delete principle
DELETE /api/principles/:id
Response: { success: boolean }
```

#### Data Rows API

```typescript
// Get all data rows (with optional principle filter)
GET /api/data-rows?principle_id=:id
Response: DataRow[]

// Update data row
PUT /api/data-rows/:id
Body: {
  principle_id?: number;
  expert_opinion?: string;
  A1_Score?: number;
  A2_Score?: number;
  A3_Score?: number;
}
Response: DataRow

// Bulk reassign rows
POST /api/data-rows/bulk-reassign
Body: {
  row_ids: string[];
  target_principle_id: number;
}
Response: { updated: number }
```

#### AI Integration API

```typescript
// Generate LLM justification for a data row
POST /api/ai/generate-justification
Body: {
  row_id: string;
  principle_id: number;
  context: {
    preceding: string;
    target: string;
    following: string;
  }
}
Response: {
  justification: string;
  evidence_quote: string;
  confidence: number;
}

// Batch process multiple rows
POST /api/ai/batch-process
Body: {
  row_ids: string[];
  principle_id: number;
}
Response: {
  processed: number;
  results: Array<{
    row_id: string;
    justification: string;
    evidence_quote: string;
  }>
}
```

#### Export API

```typescript
// Export annotated data
GET /api/export?format=json|csv&principle_id=:id
Response: File download

// Get annotation statistics
GET /api/statistics
Response: {
  total_rows: number;
  annotated_rows: number;
  principles: Array<{
    id: number;
    name: string;
    row_count: number;
    completion_rate: number;
  }>
}
```

### Data Types

```typescript
interface Principle {
  id: number;
  label_name: string;
  definition: string;
  inclusion_criteria: string;
  exclusion_criteria: string;
}

interface DataRow {
  id: string;
  preceding: string;
  target: string;
  following: string;
  A1_Score: number;
  A2_Score: number;
  A3_Score: number;
  principle_id: number;
  llm_justification: string;
  llm_evidence_quote: string;
  expert_opinion: string;
}
```

## 🚀 Usage

### Basic Workflow

1. **Select a Principle**: Click a principle in the sidebar to view its assigned data rows
2. **Review Samples**: Examine the context (preceding, target, following text) along with AI-generated justifications
3. **Expand for Details**: Double-click any row to expand it and enable drag-and-drop
4. **Add Expert Opinion**: Click the expert opinion field in expanded rows to add your annotations
5. **Reassign if Needed**: Drag expanded rows to different principles in the sidebar
6. **Refine Principles**: Click principle definitions or criteria to edit them inline
7. **Undo Mistakes**: Use Ctrl/Cmd+Z to undo recent reassignments

### Keyboard Shortcuts

- **Ctrl/Cmd+Z**: Undo last row reassignment
- **Enter**: Save editable field
- **Shift+Enter**: New line in textarea fields
- **Double-Click**: Expand/collapse data rows
- **Triple-Click**: Edit principle name (in sidebar)

### Column Resizing

- Hover over column borders to reveal the resize handle
- Click and drag to adjust column widths
- Minimum widths are enforced to maintain readability

## 📁 Project Structure

```
cogniloop-annotation/
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx           # Principle navigation
│   │   ├── HeaderPanel.tsx       # Principle details editor
│   │   ├── DataRowItem.tsx       # Individual data row
│   │   └── ResizeHandle.tsx      # Column resize control
│   ├── hooks/
│   │   └── useColumnResizer.ts   # Column width management
│   ├── types.ts                  # TypeScript interfaces
│   ├── App.tsx                   # Main application
│   ├── index.tsx                 # Entry point
│   └── index.css                 # Global styles
├── public/
├── principles.json               # Principle definitions (git-ignored)
├── samples.json                  # Data samples (git-ignored)
├── simple.json                   # Sample data for testing
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── package.json
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Gemini API (for AI-powered features)
GEMINI_API_KEY=your_api_key_here

# Backend API Base URL
VITE_API_BASE_URL=http://localhost:8000/api

# Development
VITE_PORT=3000
```

### Vite Configuration

The `vite.config.ts` is pre-configured with:
- React plugin
- Path aliases (`@/` → root directory)
- Environment variable injection
- Development server on port 3000

## 🧪 Development

### Running Tests (To be implemented)

```bash
npm run test
```

### Code Quality

```bash
# Linting
npm run lint

# Type checking
npm run type-check
```

### Data Files

The application uses two main JSON files (git-ignored for privacy):
- `principles.json`: Principle definitions
- `samples.json`: Annotated data samples

A sample file `simple.json` is included for reference and testing.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new files
- Follow React Hooks best practices
- Use Tailwind utility classes (avoid custom CSS when possible)
- Maintain consistent naming conventions
- Add JSDoc comments for complex functions

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with React, TypeScript, and Vite
- UI styled with Tailwind CSS
- Font: Inter by Rasmus Andersson

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Note**: This tool is designed for research purposes. Ensure compliance with data privacy regulations (GDPR, HIPAA, etc.) when annotating sensitive data.
