# MintDesk Color System

## 🎨 **PRIMARY COLOR PALETTE**

### **Mint Green (Primary)**
- **Primary**: `#10B981` (emerald-500)
- **Light**: `#34D399` (emerald-400)
- **Dark**: `#059669` (emerald-600)
- **Accent**: `#6EE7B7` (emerald-300)

### **Supporting Colors**
- **Blue**: `#3B82F6` (blue-500) - for links and actions
- **Purple**: `#8B5CF6` (violet-500) - for special elements
- **Orange**: `#F59E0B` (amber-500) - for warnings
- **Red**: `#EF4444` (red-500) - for errors/destructive actions

## 🎯 **GRADIENT COMBINATIONS**

### **Primary Gradients**
```css
/* Main gradient for headers and primary buttons */
bg-gradient-to-r from-emerald-400 to-emerald-500
bg-gradient-to-r from-emerald-500 to-emerald-600

/* Alternative gradients */
bg-gradient-to-r from-emerald-400 to-blue-500
bg-gradient-to-r from-emerald-500 to-blue-600
```

### **Card Gradients**
```css
/* Success cards (green theme) */
bg-gradient-to-br from-emerald-500/10 to-emerald-600/10
border-emerald-500/20
hover:border-emerald-500/40

/* Info cards (blue theme) */
bg-gradient-to-br from-blue-500/10 to-blue-600/10
border-blue-500/20
hover:border-blue-500/40

/* Warning cards (orange theme) */
bg-gradient-to-br from-amber-500/10 to-amber-600/10
border-amber-500/20
hover:border-amber-500/40

/* Secondary cards (purple theme) */
bg-gradient-to-br from-violet-500/10 to-violet-600/10
border-violet-500/20
hover:border-violet-500/40
```

## 🚀 **COMPONENT-SPECIFIC COLORS**

### **Buttons**
```typescript
// Primary button (mint green)
className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"

// Secondary button
className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"

// Success button
className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"

// Warning button
className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"

// Destructive button
className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
```

### **Headers**
```typescript
// Main page headers
className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent"

// Section headers
className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent"
```

### **Cards**
```typescript
// Primary cards
className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-gray-700/50 hover:border-emerald-500/50 hover:from-gray-900/80 hover:to-gray-800/80"

// Success cards
className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border-emerald-500/20 hover:border-emerald-500/40"

// Info cards
className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20 hover:border-blue-500/40"

// Warning cards
className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border-amber-500/20 hover:border-amber-500/40"
```

## 📱 **STATUS COLORS**

### **Priority Colors**
- **Low**: `info` (blue) - `#3B82F6`
- **Medium**: `warning` (amber) - `#F59E0B`
- **High**: `destructive` (red) - `#EF4444`

### **Status Colors**
- **Active**: `success` (emerald) - `#10B981`
- **Archived**: `secondary` (gray) - `#6B7280`
- **Spam**: `destructive` (red) - `#EF4444`

## 🎨 **AVATAR GRADIENTS**

### **User Avatars**
```typescript
// Primary user avatar
className="bg-gradient-to-br from-emerald-500 to-emerald-600"

// Alternative avatar
className="bg-gradient-to-br from-emerald-400 to-blue-500"

// Special user avatar
className="bg-gradient-to-br from-emerald-500 to-violet-500"
```

## 🌟 **SPECIAL EFFECTS**

### **Shadows**
```typescript
// Primary shadow
className="shadow-lg shadow-emerald-500/10"

// Success shadow
className="shadow-lg shadow-emerald-500/20"

// Info shadow
className="shadow-lg shadow-blue-500/10"

// Warning shadow
className="shadow-lg shadow-amber-500/10"
```

### **Focus States**
```typescript
// Input focus
className="focus:border-emerald-500 focus:ring-emerald-500"

// Button focus
className="focus:ring-emerald-500 focus:ring-2"
```

## 📊 **PAGE-SPECIFIC THEMES**

### **Dashboard/Home**
- Primary: Emerald gradients
- Accent: Blue for charts and data

### **Tickets**
- Primary: Emerald for active tickets
- Warning: Amber for pending tickets
- Destructive: Red for urgent tickets

### **Messages**
- Primary: Emerald for active messages
- Info: Blue for unread messages
- Secondary: Gray for archived messages

### **Reports**
- Primary: Emerald for success metrics
- Info: Blue for informational data
- Warning: Amber for attention items

### **Analytics**
- Primary: Emerald for positive trends
- Info: Blue for neutral data
- Warning: Amber for negative trends

### **Settings**
- Primary: Emerald for save actions
- Info: Blue for informational settings
- Warning: Amber for destructive actions

## 🎯 **IMPLEMENTATION GUIDELINES**

### **Consistency Rules**
1. **Primary Actions**: Always use emerald green
2. **Secondary Actions**: Use blue
3. **Destructive Actions**: Use red
4. **Warnings**: Use amber/orange
5. **Success States**: Use emerald green
6. **Info States**: Use blue

### **Gradient Usage**
1. **Headers**: Use emerald gradients
2. **Buttons**: Use emerald for primary, blue for secondary
3. **Cards**: Use appropriate color based on content type
4. **Avatars**: Use emerald gradients
5. **Icons**: Use emerald for primary actions

### **Accessibility**
1. **Contrast**: Ensure 4.5:1 contrast ratio minimum
2. **Color Blind**: Don't rely solely on color for information
3. **Focus**: Clear focus indicators with emerald color
4. **States**: Clear hover, active, and disabled states

---

## 🎉 **RESULT**

This color system provides:
- **Brand Consistency**: MintDesk identity with emerald green
- **Visual Hierarchy**: Clear distinction between different elements
- **Accessibility**: Proper contrast and focus states
- **Modern Design**: Gradient effects and smooth transitions
- **Scalability**: Easy to apply across all pages

**Ready to implement across all pages!** 🎨✨ 