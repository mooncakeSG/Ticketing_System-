'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Plus, User, MessageSquare, AlertCircle } from 'lucide-react';
import { ResponsiveButton, ResponsiveCard, ResponsiveText } from '../layout/responsive-layout';
import { StepProgress } from '../ui/progress';

interface TicketStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ticketSteps: TicketStep[] = [
  {
    id: 'basic',
    title: 'Basic Information',
    description: 'Enter ticket title and description',
    icon: <Plus className="h-5 w-5" />
  },
  {
    id: 'details',
    title: 'Additional Details',
    description: 'Set priority, type, and assignee',
    icon: <AlertCircle className="h-5 w-5" />
  },
  {
    id: 'contact',
    title: 'Contact Information',
    description: 'Add requester details',
    icon: <User className="h-5 w-5" />
  },
  {
    id: 'review',
    title: 'Review & Submit',
    description: 'Review all information before creating',
    icon: <Check className="h-5 w-5" />
  }
];

interface TicketFormData {
  title: string;
  description: string;
  priority: string;
  type: string;
  assignee: string;
  requesterName: string;
  requesterEmail: string;
}

export function MobileTicketCreationFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<TicketFormData>({
    title: '',
    description: '',
    priority: 'medium',
    type: 'bug',
    assignee: '',
    requesterName: '',
    requesterEmail: ''
  });

  const handleNext = () => {
    if (currentStep < ticketSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Handle ticket creation
    console.log('Creating ticket:', formData);
  };

  const updateFormData = (field: keyof TicketFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateFormData('title', e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                placeholder="Enter ticket title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                rows={4}
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground resize-none"
                placeholder="Describe the issue..."
              />
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => updateFormData('priority', e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => updateFormData('type', e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="bug">Bug</option>
                <option value="feature">Feature Request</option>
                <option value="support">Support</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Assignee</label>
              <input
                type="text"
                value={formData.assignee}
                onChange={(e) => updateFormData('assignee', e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                placeholder="Enter assignee name"
              />
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-2">Requester Name *</label>
              <input
                type="text"
                value={formData.requesterName}
                onChange={(e) => updateFormData('requesterName', e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                placeholder="Enter requester name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Requester Email *</label>
              <input
                type="email"
                value={formData.requesterEmail}
                onChange={(e) => updateFormData('requesterEmail', e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                placeholder="Enter requester email"
              />
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <ResponsiveCard>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">Title</span>
                  <p className="font-medium">{formData.title}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Description</span>
                  <p className="text-sm">{formData.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Priority</span>
                    <p className="font-medium capitalize">{formData.priority}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Type</span>
                    <p className="font-medium capitalize">{formData.type}</p>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Requester</span>
                  <p className="font-medium">{formData.requesterName}</p>
                  <p className="text-sm text-muted-foreground">{formData.requesterEmail}</p>
                </div>
              </div>
            </ResponsiveCard>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="p-2 disabled:opacity-50"
            aria-label="Previous step"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <ResponsiveText size="lg" className="font-semibold">
            {ticketSteps[currentStep].title}
          </ResponsiveText>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Progress */}
      <div className="p-4">
        <StepProgress
          steps={ticketSteps.map(step => step.title)}
          currentStep={currentStep}
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <ResponsiveCard>
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
        </ResponsiveCard>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
        <div className="flex justify-between">
          <ResponsiveButton
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="bg-secondary hover:bg-secondary/80 disabled:opacity-50"
          >
            Previous
          </ResponsiveButton>
          
          {currentStep === ticketSteps.length - 1 ? (
            <ResponsiveButton
              onClick={handleSubmit}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Create Ticket
            </ResponsiveButton>
          ) : (
            <ResponsiveButton
              onClick={handleNext}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </ResponsiveButton>
          )}
        </div>
      </div>
    </div>
  );
} 