'use client';

import Link from 'next/link';
import { Plus, FileText, Trash2, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAssessments } from '@/hooks/useAssessment';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const { assessments, isLoading, deleteAssessment } = useAssessments();

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assessments</h1>
          <p className="text-sm text-gray-500 mt-1">
            {assessments.length} assessment{assessments.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/assessment/new">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            New Assessment
          </Button>
        </Link>
      </div>

      {/* Assessment List */}
      {assessments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No assessments yet</h3>
            <p className="text-sm text-gray-500 mb-4">
              Create your first tree risk assessment to get started.
            </p>
            <Link href="/assessment/new">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                New Assessment
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {assessments.map((assessment) => (
            <Link key={assessment.id} href={`/assessment/${assessment.id}`}>
              <Card className="hover:border-green-300 hover:shadow-md transition-all cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-medium flex items-center gap-2">
                        {assessment.header.treeSpecies || 'Unnamed Tree'}
                        {assessment.header.treeNo && (
                          <span className="text-sm text-gray-500">
                            #{assessment.header.treeNo}
                          </span>
                        )}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        {assessment.header.addressTreeLocation || 'No location specified'}
                      </p>
                    </div>
                    <Badge
                      className={cn(
                        assessment.status === 'complete'
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      )}
                    >
                      {assessment.status === 'complete' ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Complete
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 mr-1" />
                          Draft
                        </>
                      )}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-gray-500">
                      <span>Client: {assessment.header.client || '-'}</span>
                      <span>DBH: {assessment.header.dbh || '-'}</span>
                      <span>Height: {assessment.header.height || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {assessment.overallTreeRiskRating && (
                        <Badge
                          className={cn(
                            'text-xs',
                            assessment.overallTreeRiskRating === 'low' &&
                              'bg-green-100 text-green-800',
                            assessment.overallTreeRiskRating === 'moderate' &&
                              'bg-yellow-100 text-yellow-800',
                            assessment.overallTreeRiskRating === 'high' &&
                              'bg-orange-100 text-orange-800',
                            assessment.overallTreeRiskRating === 'extreme' &&
                              'bg-red-100 text-red-800'
                          )}
                        >
                          {assessment.overallTreeRiskRating.toUpperCase()} Risk
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (confirm('Delete this assessment?')) {
                            deleteAssessment(assessment.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Last updated: {new Date(assessment.updatedAt).toLocaleDateString()}{' '}
                    {new Date(assessment.updatedAt).toLocaleTimeString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
