'use client';

/**
 * Edit Assessment Page
 * =============================================================================
 * Uses query parameter for assessment ID to support static export.
 * URL format: /assessment/edit?id=xxx
 */

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AssessmentForm } from '@/components/form/AssessmentForm';
import { Loader2 } from 'lucide-react';

function EditAssessmentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [assessmentId, setAssessmentId] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get('id');
    if (!id) {
      // No ID provided, redirect to home
      router.push('/');
      return;
    }
    setAssessmentId(id);
  }, [searchParams, router]);

  if (!assessmentId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return <AssessmentForm assessmentId={assessmentId} />;
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-accent" />
    </div>
  );
}

export default function EditAssessmentPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <EditAssessmentContent />
    </Suspense>
  );
}
