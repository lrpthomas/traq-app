'use client';

import { use } from 'react';
import { AssessmentForm } from '@/components/form/AssessmentForm';

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditAssessmentPage({ params }: Props) {
  const { id } = use(params);
  return <AssessmentForm assessmentId={id} />;
}
