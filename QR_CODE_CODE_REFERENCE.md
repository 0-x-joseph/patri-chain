# QR Code Feature - Code Reference Guide

## 📍 File Locations

### 1. Product Detail Component (MAIN QR CODE LOGIC)
**File:** `/src/components/artisan/products/product-detail-content.tsx`

**Key Sections:**
- **Lines 1-6:** Imports (added `QRCodeSVG` from qrcode.react)
- **Lines 26-28:** State management for QR display
  ```tsx
  const [showQRCode, setShowQRCode] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  ```

- **Lines 72-130:** Download and Print Functions
  - `downloadQRCode()` - Converts SVG to PNG and downloads
  - `printQRCode()` - Opens print dialog with QR code

- **Lines 200-270:** QR Code UI Section in Details Tab
  - "Generate QR Code" button
  - Download/Print/Hide buttons
  - QRCodeSVG component rendering

### 2. Public Product Verification Page (NEW)
**File:** `/src/app/product/verify/[id]/page.tsx`

**Key Content:**
- Async page component that accepts dynamic `[id]` parameter
- Metadata configuration for SEO
- Renders `ProductVerificationContent` component

### 3. Product Verification Component (NEW)
**File:** `/src/components/public/product-verification-content.tsx`

**Key Sections:**
- **Lines 1-24:** Imports and type definitions
- **Lines 46-52:** useEffect hook that fetches product data
- **Lines 54-130:** `ProductVerificationContent` component
  - Loading state
  - Error handling
  - Product details display
  - Verification badges
  - Scan history timeline
  - Blockchain information

## 🔧 Implementation Details

### QR Code Generation
```typescript
// Location: product-detail-content.tsx lines 219-227
<QRCodeSVG
  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/product/verify/${product.id}`}
  size={256}
  level="H"
  includeMargin={true}
/>
```

### QR Code Download
```typescript
// Location: product-detail-content.tsx lines 72-86
const downloadQRCode = () => {
  // 1. Get SVG element
  const svg = qrRef.current?.querySelector('svg');
  // 2. Convert SVG to PNG
  // 3. Create download link
  // 4. Trigger download
}
```

### QR Code Print
```typescript
// Location: product-detail-content.tsx lines 88-130
const printQRCode = () => {
  // 1. Get SVG element
  // 2. Open print window
  // 3. Draw SVG in new window canvas
  // 4. Trigger native print dialog
}
```

### Public Verification Page Layout
```typescript
// Location: product-verification-content.tsx lines 145-200
<div className="min-h-screen bg-gradient-to-b...">
  {/* Header */}
  {/* Status Badge */}
  {/* Product Details Card */}
  {/* Verifications Card */}
  {/* Blockchain Info Card */}
</div>
```

## 🎯 Feature-to-Code Mapping

| Feature | File | Lines | Function |
|---------|------|-------|----------|
| QR Code Generation | product-detail-content.tsx | 219-227 | QRCodeSVG component |
| QR Code Display | product-detail-content.tsx | 200-270 | Details tab UI section |
| QR Download | product-detail-content.tsx | 72-86 | downloadQRCode() |
| QR Print | product-detail-content.tsx | 88-130 | printQRCode() |
| Public Verification | product-verification-content.tsx | 145-180 | Main component render |
| Verification Status | product-verification-content.tsx | 150-160 | Status badge section |
| Scan History | product-verification-content.tsx | 200-230 | Recent verifications |

## 🔄 Data Flow

### Generate QR Code
```
User clicks "Generate QR Code"
↓
setShowQRCode(true)
↓
QRCodeSVG renders with value="/product/verify/{productId}"
↓
User sees QR code displayed
```

### Download QR Code
```
User clicks "Download"
↓
downloadQRCode() called
↓
SVG → PNG conversion
↓
Browser download triggered
↓
File saved as "{product-name}-qr.png"
```

### Print QR Code
```
User clicks "Print"
↓
printQRCode() called
↓
New window opens
↓
SVG drawn on canvas
↓
Browser print dialog opens
↓
User prints or saves as PDF
```

### Public Verification
```
Customer scans QR code
↓
Phone redirects to /product/verify/{id}
↓
ProductVerificationContent fetches product data
↓
Page displays:
  - Product info
  - Authenticity badge
  - Verification history
  - Blockchain status
```

## 📋 Component Props

### ProductDetailContent
```typescript
interface Props {
  productId: string  // Product ID from URL params
}
```

### ProductVerificationContent
```typescript
interface Props {
  productId: string  // Product ID from URL params
}
```

## 🎨 UI Components Used

- **QRCodeSVG** - From `qrcode.react`
- **Button** - Custom/shadcn styling
- **Card** - Custom/shadcn styling  
- **Badge** - Custom/shadcn styling
- **Icons** - From `lucide-react`

## 🔗 Dependencies

### Installed Packages
```json
{
  "qrcode.react": "latest",
  "qrcode": "latest"
}
```

### Import Statements
```typescript
// In product-detail-content.tsx
import { QRCodeSVG } from 'qrcode.react';
import { Printer } from 'lucide-react';
import { useRef } from 'react';

// In product-verification-content.tsx
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';
```

## 🧪 Testing Code Snippets

### Test Generate QR Code
```javascript
// In browser console
document.querySelector('[onclick*="Generate"]')?.click();
// QR code should appear in Details tab
```

### Test QR Code Content
```javascript
// Get the SVG element
const svg = document.querySelector('svg[height="256"]');
// Check if it exists and is visible
console.log(svg !== null && svg.offsetHeight > 0);
```

### Test Public Page
```javascript
// In browser console at artisan site
const productId = document.querySelector('[href*="/artisan/products/"]')?.href?.split('/').pop();
window.open(`/product/verify/${productId}`);
```

## 🚀 API Endpoints

### Used by QR Features
```
GET /api/artisan/products/{id}
- Fetches product details
- Used by both artisan and public pages
- Returns: product info + verifications
```

## 📱 Responsive Design

- **Desktop:** QR code at 256x256px in centered card
- **Tablet:** Same layout, responsive card width
- **Mobile:** Stacked layout, full-width card
- **Print:** Optimized for A4 paper

## 🔐 Security Considerations

✅ **Public Page Security:**
- No authentication required (intentional)
- Only public product data exposed
- No artisan personal information
- No sensitive data in QR code value

✅ **Data Validation:**
- Product existence checked before display
- Invalid product ID shows friendly error
- API returns 404 for non-existent products

## 🎯 Key Points

1. **QR Code URL Structure:** `/product/verify/{productId}`
2. **QR Code Format:** SVG, converted to PNG for download
3. **Print Quality:** High resolution (256x256px)
4. **Public Access:** No authentication needed
5. **Mobile Friendly:** Responsive design for all devices
6. **Dark Mode:** Full support (no theme-specific code needed)

## 📚 Related Files

- `/QR_CODE_TESTING_GUIDE.md` - Test cases and procedures
- `/QR_CODE_IMPLEMENTATION_SUMMARY.md` - High-level overview
- Docker/Compose files - Development setup
- Package.json - Dependencies
