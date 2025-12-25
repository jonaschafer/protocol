'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Protocol, Session } from '@/lib/types';
import { supabase, checkMilestones, updateActiveProtocol, MilestoneStatus } from '@/lib/supabase';
import Navigation from '@/app/components/Navigation';

interface ProtocolWithSessions extends Protocol {
  sessions: Session[];
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function ProtocolsPage() {
  const [protocols, setProtocols] = useState<ProtocolWithSessions[]>([]);
  const [milestones, setMilestones] = useState<MilestoneStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    fetchProtocols();
    fetchMilestones();
  }, []);

  const fetchProtocols = async () => {
    setIsLoading(true);
    try {
      // Fetch all protocols
      const { data: protocolsData, error: protocolsError } = await supabase
        .from('protocols')
        .select('*')
        .order('created_at', { ascending: true });

      if (protocolsError) throw protocolsError;

      // Fetch sessions for each protocol
      const protocolsWithSessions: ProtocolWithSessions[] = await Promise.all(
        (protocolsData || []).map(async (protocol) => {
          const { data: sessionsData, error: sessionsError } = await supabase
            .from('sessions')
            .select('*')
            .eq('protocol_id', protocol.id)
            .order('day_of_week', { ascending: true});

          if (sessionsError) throw sessionsError;

          return {
            ...protocol,
            sessions: sessionsData || [],
          };
        })
      );

      setProtocols(protocolsWithSessions);
    } catch (error) {
      console.error('Error fetching protocols:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMilestones = async () => {
    const status = await checkMilestones();
    setMilestones(status);
  };

  const handleSwitchProtocol = async (protocolId: string, protocolName: string) => {
    // Check if this is the Hyrox Foundation protocol and milestones aren't met
    if (protocolName.includes('Hyrox Foundation') && milestones) {
      const allMet = milestones.painFreeRunning && milestones.calfMilestone &&
                     milestones.weeklyMileage && milestones.ptClearance;

      if (!allMet) {
        alert('You haven\'t met all requirements yet. Complete the milestones to unlock this protocol.');
        return;
      }
    }

    if (!confirm(`Switch to ${protocolName}? This will change your daily workouts.`)) {
      return;
    }

    setIsSwitching(true);
    try {
      await updateActiveProtocol(protocolId);
      await fetchProtocols(); // Refresh to show new active state
      alert(`Switched to ${protocolName}!`);
    } catch (error) {
      console.error('Error switching protocol:', error);
      alert('Failed to switch protocol. Please try again.');
    } finally {
      setIsSwitching(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="max-w-2xl mx-auto p-4 pt-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading protocols...</p>
          </div>
        </div>
        <Navigation />
      </div>
    );
  }

  const isProtocolLocked = (protocol: Protocol): boolean => {
    // PT Foundation is always unlocked
    if (protocol.name.includes('PT Foundation')) return false;

    // Hyrox Foundation requires milestones
    if (protocol.name.includes('Hyrox Foundation')) {
      if (!milestones) return true;
      return !(milestones.painFreeRunning && milestones.calfMilestone &&
               milestones.weeklyMileage && milestones.ptClearance);
    }

    // Full Hyrox is always locked for now
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-2xl mx-auto p-4 pt-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Training Protocols</h1>

        <div className="space-y-4">
          {protocols.map((protocol) => {
            const locked = isProtocolLocked(protocol);
            const isActive = protocol.active;

            return (
              <div
                key={protocol.id}
                className={`bg-white rounded-lg border-2 p-4 ${
                  isActive
                    ? 'border-green-500'
                    : locked
                    ? 'border-gray-300 opacity-75'
                    : 'border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">
                        {isActive ? '✅' : locked ? '🔒' : '📋'}
                      </span>
                      <h2 className="text-xl font-bold text-gray-900">
                        {protocol.name}
                        {isActive && <span className="text-green-600 ml-2">(Active)</span>}
                      </h2>
                    </div>
                    <p className="text-sm text-gray-600">{protocol.description}</p>
                  </div>
                </div>

                {/* Weekly Schedule */}
                {protocol.sessions.length > 0 && (
                  <div className="mt-4 mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">📅 Weekly Schedule:</h3>
                    <div className="space-y-1">
                      {protocol.sessions.map((session) => (
                        <div key={session.id} className="text-sm text-gray-600 flex items-center">
                          <span className="w-12 font-medium">{DAY_NAMES[session.day_of_week].substring(0, 3)}</span>
                          <span className="mx-2">-</span>
                          <span>{session.name}</span>
                          <span className="ml-auto text-gray-500">({session.duration_minutes}min)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Unlock Requirements for Locked Protocols */}
                {locked && protocol.name.includes('Hyrox Foundation') && milestones && (
                  <div className="mt-4 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <h3 className="text-sm font-semibold text-amber-900 mb-2">Unlock Requirements:</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <span>{milestones.painFreeRunning ? '✅' : '⬜'}</span>
                        <span className={milestones.painFreeRunning ? 'text-green-700' : 'text-gray-600'}>
                          2 weeks pain-free running
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{milestones.calfMilestone ? '✅' : '⬜'}</span>
                        <span className={milestones.calfMilestone ? 'text-green-700' : 'text-gray-600'}>
                          30 single-leg calf raises (L&R)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{milestones.weeklyMileage ? '✅' : '⬜'}</span>
                        <span className={milestones.weeklyMileage ? 'text-green-700' : 'text-gray-600'}>
                          40 mpw consistently
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{milestones.ptClearance ? '✅' : '⬜'}</span>
                        <span className={milestones.ptClearance ? 'text-green-700' : 'text-gray-600'}>
                          PT clearance
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/protocols/${protocol.id}`}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 text-center transition-colors"
                  >
                    View Details
                  </Link>
                  {!isActive && !locked && (
                    <button
                      onClick={() => handleSwitchProtocol(protocol.id, protocol.name)}
                      disabled={isSwitching}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 transition-colors"
                    >
                      {isSwitching ? 'Switching...' : 'Activate'}
                    </button>
                  )}
                  {locked && (
                    <div className="flex-1 px-4 py-2 bg-gray-300 text-gray-600 rounded-lg font-medium text-center cursor-not-allowed">
                      Locked
                    </div>
                  )}
                  {isActive && (
                    <div className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium text-center border border-green-300">
                      Active ✓
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Navigation />
    </div>
  );
}
