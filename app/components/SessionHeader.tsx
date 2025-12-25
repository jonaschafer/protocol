import { Session, Protocol } from '@/lib/types';

interface SessionHeaderProps {
  session: Session;
  protocol: Protocol;
  completedCount: number;
  totalCount: number;
}

export default function SessionHeader({
  session,
  protocol,
  completedCount,
  totalCount,
}: SessionHeaderProps) {
  const getSessionTypeStyle = (type: string) => {
    switch (type) {
      case 'main':
        return 'bg-blue-100 text-blue-800';
      case 'micro':
        return 'bg-green-100 text-green-800';
      case 'rest':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-sm text-gray-600 mb-1">{protocol.name}</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {session.name}
        </h1>

        <div className="flex items-center gap-3 mb-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getSessionTypeStyle(
              session.session_type
            )}`}
          >
            {session.session_type.toUpperCase()}
          </span>
          <span className="text-sm text-gray-600">
            {session.duration_minutes} min
          </span>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-gray-900">
              {completedCount}/{totalCount} exercises
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
