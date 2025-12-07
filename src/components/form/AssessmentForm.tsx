'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Save,
  FileDown,
  FileText,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAssessment } from '@/hooks/useAssessment';
import { cn } from '@/lib/utils';
import { downloadFilledPDF, downloadReportPDF } from '@/lib/pdfGenerator';

// Form sections
import { HeaderSection } from './sections/HeaderSection';
import { TargetSection } from './sections/TargetSection';
import { SiteFactorsSection } from './sections/SiteFactorsSection';
import { TreeHealthSection } from './sections/TreeHealthSection';
import { LoadFactorsSection } from './sections/LoadFactorsSection';
import { CrownBranchesSection } from './sections/CrownBranchesSection';
import { TrunkSection } from './sections/TrunkSection';
import { RootsSection } from './sections/RootsSection';
import { RiskCategorizationSection } from './sections/RiskCategorizationSection';
import { MitigationSection } from './sections/MitigationSection';

const SECTIONS = [
  { id: 'header', title: 'Header & Tree Info', component: HeaderSection },
  { id: 'targets', title: 'Target Assessment', component: TargetSection },
  { id: 'site', title: 'Site Factors', component: SiteFactorsSection },
  { id: 'health', title: 'Tree Health', component: TreeHealthSection },
  { id: 'load', title: 'Load Factors', component: LoadFactorsSection },
  { id: 'crown', title: 'Crown & Branches', component: CrownBranchesSection },
  { id: 'trunk', title: 'Trunk', component: TrunkSection },
  { id: 'roots', title: 'Roots & Root Collar', component: RootsSection },
  { id: 'risk', title: 'Risk Categorization', component: RiskCategorizationSection },
  { id: 'mitigation', title: 'Mitigation & Summary', component: MitigationSection },
];

interface AssessmentFormProps {
  assessmentId?: string;
}

export function AssessmentForm({ assessmentId }: AssessmentFormProps) {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(0);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const {
    assessment,
    isLoading,
    isSaving,
    error,
    updateField,
    save,
    complete,
    addTarget,
    removeTarget,
    addRiskRow,
    removeRiskRow,
    addMitigationOption,
    removeMitigationOption,
    addBranchFailureAssessment,
  } = useAssessment(assessmentId);

  // Auto-save on changes
  useEffect(() => {
    if (!assessment) return;

    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    const timer = setTimeout(() => {
      save();
    }, 30000); // Auto-save every 30 seconds of inactivity

    setAutoSaveTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [assessment]);

  const handleSave = useCallback(async () => {
    await save();
  }, [save]);

  const handleComplete = useCallback(async () => {
    await complete();
    await save();
    router.push('/');
  }, [complete, save, router]);

  const goToSection = useCallback((index: number) => {
    setCurrentSection(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const nextSection = useCallback(() => {
    if (currentSection < SECTIONS.length - 1) {
      goToSection(currentSection + 1);
    }
  }, [currentSection, goToSection]);

  const prevSection = useCallback(() => {
    if (currentSection > 0) {
      goToSection(currentSection - 1);
    }
  }, [currentSection, goToSection]);

  const handleExportPDF = useCallback(async () => {
    if (!assessment) return;
    setIsExporting(true);
    try {
      await save();
      await downloadFilledPDF(assessment);
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  }, [assessment, save]);

  const handleExportReport = useCallback(async () => {
    if (!assessment) return;
    setIsExporting(true);
    try {
      await save();
      await downloadReportPDF(assessment);
    } catch (error) {
      console.error('Failed to export report:', error);
      alert('Failed to export report. Please try again.');
    } finally {
      setIsExporting(false);
    }
  }, [assessment, save]);

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-1">Error</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => router.push('/')}
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!assessment) return null;

  const CurrentSectionComponent = SECTIONS[currentSection].component;

  return (
    <div className="container py-4 pb-24">
      {/* Section Navigation (Stepper) */}
      <div className="mb-6 overflow-x-auto pb-2">
        <div className="flex gap-1 min-w-max">
          {SECTIONS.map((section, index) => (
            <button
              key={section.id}
              onClick={() => goToSection(index)}
              className={cn(
                'px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap',
                index === currentSection
                  ? 'bg-primary text-primary-foreground'
                  : index < currentSection
                  ? 'bg-accent/20 text-accent-foreground hover:bg-accent/30'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              <span className="mr-1">{index + 1}.</span>
              {section.title}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
          <span>
            Section {currentSection + 1} of {SECTIONS.length}
          </span>
          <span>{Math.round(((currentSection + 1) / SECTIONS.length) * 100)}% Complete</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${((currentSection + 1) / SECTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Section Title */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-foreground">{SECTIONS[currentSection].title}</h2>
        {currentSection < 8 && (
          <p className="text-sm text-muted-foreground">Page 1 - Field Assessment</p>
        )}
        {currentSection >= 8 && (
          <p className="text-sm text-muted-foreground">Page 2 - Risk Analysis & Mitigation</p>
        )}
      </div>

      {/* Current Section */}
      <Card>
        <CardContent className="pt-6">
          <CurrentSectionComponent
            assessment={assessment}
            updateField={updateField}
            addTarget={addTarget}
            removeTarget={removeTarget}
            addRiskRow={addRiskRow}
            removeRiskRow={removeRiskRow}
            addMitigationOption={addMitigationOption}
            removeMitigationOption={removeMitigationOption}
            addBranchFailureAssessment={addBranchFailureAssessment}
          />
        </CardContent>
      </Card>

      {/* Navigation Buttons - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-40">
        <div className="container py-3 flex items-center justify-between gap-2">
          <Button
            variant="outline"
            onClick={prevSection}
            disabled={currentSection === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={isSaving}
              className="text-accent border-accent hover:bg-accent/10"
            >
              <Save className="h-4 w-4 mr-1" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>

            {/* Export Dropdown */}
            <div className="relative group">
              <Button
                variant="outline"
                disabled={isExporting}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                <FileDown className="h-4 w-4 mr-1" />
                {isExporting ? 'Exporting...' : 'Export'}
              </Button>
              <div className="absolute bottom-full mb-1 right-0 hidden group-hover:block bg-popover border rounded-md shadow-lg min-w-[160px] z-50">
                <button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                >
                  <FileDown className="h-4 w-4" />
                  Fill TRAQ Form
                </button>
                <button
                  onClick={handleExportReport}
                  disabled={isExporting}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Generate Report
                </button>
              </div>
            </div>

            {currentSection === SECTIONS.length - 1 && (
              <Button
                onClick={handleComplete}
                className="bg-primary hover:bg-primary/90"
              >
                <Check className="h-4 w-4 mr-1" />
                Complete
              </Button>
            )}
          </div>

          <Button
            onClick={nextSection}
            disabled={currentSection === SECTIONS.length - 1}
            className="bg-primary hover:bg-primary/90"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
