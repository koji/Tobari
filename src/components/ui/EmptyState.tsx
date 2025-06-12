import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="bg-background-paper p-6 rounded-lg max-w-md animate-fade-in">
        {icon}
        <h2 className="text-xl font-semibold mt-4 text-white">{title}</h2>
        <p className="mt-2 text-gray-400">{description}</p>
        {action && (
          <div className="mt-6">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;