import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-section bg-canvas">
      <div className="max-w-md animate-fade-in">
        <div className="flex justify-center mb-6 opacity-40">{icon}</div>
        <h2 className="text-display-md text-ink">{title}</h2>
        <p className="mt-3 text-body text-ink-muted-80">{description}</p>
        {action && (
          <div className="mt-8">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
