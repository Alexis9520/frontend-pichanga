'use client'

import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepperContextValue {
  currentStep: number
  totalSteps: number
  goToStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const StepperContext = React.createContext<StepperContextValue | undefined>(undefined)

function useStepper() {
  const context = React.useContext(StepperContext)
  if (!context) {
    throw new Error('useStepper must be used within a Stepper')
  }
  return context
}

interface StepperProps {
  children: React.ReactNode
  defaultStep?: number
  step?: number
  onStepChange?: (step: number) => void
  totalSteps: number
}

export function Stepper({
  children,
  defaultStep = 0,
  step: controlledStep,
  onStepChange,
  totalSteps,
}: StepperProps) {
  const [uncontrolledStep, setUncontrolledStep] = React.useState(defaultStep)

  const currentStep = controlledStep ?? uncontrolledStep

  const goToStep = React.useCallback(
    (newStep: number) => {
      if (newStep >= 0 && newStep < totalSteps) {
        onStepChange?.(newStep)
        setUncontrolledStep(newStep)
      }
    },
    [onStepChange, totalSteps]
  )

  const nextStep = React.useCallback(() => {
    goToStep(currentStep + 1)
  }, [currentStep, goToStep])

  const prevStep = React.useCallback(() => {
    goToStep(currentStep - 1)
  }, [currentStep, goToStep])

  const value = React.useMemo(
    () => ({
      currentStep,
      totalSteps,
      goToStep,
      nextStep,
      prevStep,
      isFirstStep: currentStep === 0,
      isLastStep: currentStep === totalSteps - 1,
    }),
    [currentStep, totalSteps, goToStep, nextStep, prevStep]
  )

  return <StepperContext.Provider value={value}>{children}</StepperContext.Provider>
}

interface StepperHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: { title: string; description?: string }[]
}

export function StepperHeader({ steps, className, ...props }: StepperHeaderProps) {
  const { currentStep, goToStep } = useStepper()

  return (
    <div className={cn('mb-6', className)} {...props}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step circle and label */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => goToStep(index)}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200',
                  index < currentStep
                    ? 'border-primary bg-primary text-primary-foreground'
                    : index === currentStep
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-muted text-muted-foreground'
                )}
              >
                {index < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </button>
              <div className="mt-2 text-center">
                <p
                  className={cn(
                    'text-sm font-medium',
                    index === currentStep ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-muted-foreground hidden text-xs sm:block">
                    {step.description}
                  </p>
                )}
              </div>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'mx-2 h-0.5 flex-1 transition-colors duration-200 sm:mx-4',
                  index < currentStep ? 'bg-primary' : 'bg-border'
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export function StepperContent({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('min-h-[300px]', className)} {...props}>
      {children}
    </div>
  )
}

export function StepperFooter({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'border-border mt-6 flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-between',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface StepperPreviousProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export function StepperPrevious({ children, onClick, className, ...props }: StepperPreviousProps) {
  const { prevStep, isFirstStep } = useStepper()

  return (
    <button
      onClick={(e) => {
        onClick?.(e)
        prevStep()
      }}
      disabled={isFirstStep}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200',
        'border-border bg-background hover:bg-muted border',
        'h-11 px-5 py-2.5',
        'disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children || 'Anterior'}
    </button>
  )
}

interface StepperNextProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export function StepperNext({ children, onClick, className, ...props }: StepperNextProps) {
  const { nextStep, isLastStep } = useStepper()

  return (
    <button
      onClick={(e) => {
        onClick?.(e)
        if (!isLastStep) {
          nextStep()
        }
      }}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200',
        'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md',
        'h-11 px-5 py-2.5',
        'disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children || (isLastStep ? 'Finalizar' : 'Siguiente')}
    </button>
  )
}

export { useStepper }
