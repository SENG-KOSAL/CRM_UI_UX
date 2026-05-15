import { useState, useCallback } from 'react';

export type WorkflowStep =
  | 'login' | 'bu_selection' | 'aws_selection' | 'open_stock'
  | 'start_session' | 'dashboard' | 'route_plan' | 'outlet_select'
  | 'check_in' | 'load_programs' | 'create_sale' | 'check_out'
  | 'settlement' | 'close_session';

export function useWorkflow() {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('login');
  const [completedSteps, setCompletedSteps] = useState<WorkflowStep[]>([]);
  const [sessionActive, setSessionActive] = useState(false);

  const goTo = useCallback((step: WorkflowStep) => {
    setCurrentStep(step);
  }, []);

  const completeStep = useCallback((step: WorkflowStep) => {
    setCompletedSteps((prev) => {
      if (prev.includes(step)) return prev;
      return [...prev, step];
    });
  }, []);

  const isStepCompleted = useCallback(
    (step: WorkflowStep) => completedSteps.includes(step),
    [completedSteps]
  );

  const canProceed = useCallback(
    (step: WorkflowStep) => {
      const order: WorkflowStep[] = [
        'login', 'bu_selection', 'aws_selection', 'open_stock',
        'start_session', 'dashboard', 'route_plan', 'outlet_select',
        'check_in', 'load_programs', 'create_sale', 'check_out',
        'settlement', 'close_session',
      ];
      const stepIndex = order.indexOf(step);
      if (stepIndex === 0) return true;
      return completedSteps.includes(order[stepIndex - 1]);
    },
    [completedSteps]
  );

  const getProgress = useCallback(() => {
    const allSteps: WorkflowStep[] = [
      'login', 'bu_selection', 'aws_selection', 'open_stock',
      'start_session', 'dashboard', 'route_plan', 'outlet_select',
      'check_in', 'load_programs', 'create_sale', 'check_out',
      'settlement', 'close_session',
    ];
    const completed = completedSteps.length;
    const total = allSteps.length;
    return { completed, total, percentage: (completed / total) * 100 };
  }, [completedSteps]);

  const startSession = useCallback(() => {
    setSessionActive(true);
    setCurrentStep('dashboard');
  }, []);

  const endSession = useCallback(() => {
    setSessionActive(false);
    setCompletedSteps([]);
    setCurrentStep('login');
  }, []);

  return {
    currentStep,
    setCurrentStep,
    completedSteps,
    sessionActive,
    goTo,
    completeStep,
    isStepCompleted,
    canProceed,
    getProgress,
    startSession,
    endSession,
  };
}
