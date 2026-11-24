import React, { useState } from 'react';
import { BRAND_LOGO_URL, PROFILE_AVATAR_URL } from '../data/civicData';
import { NotificationItem, RouteId } from '../types/civic';
import { ResilientImage } from './ResilientImage';

interface AppShellProps {
  currentRoute: RouteId;
  onNavigate: (route: RouteId, ticketId?: string) => void;
  onBack: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  karma: number;
  children: React.ReactNode;
}

const ROUTE_SUBTITLES: Record<RouteId, string> = {
  'home-overview': 'Home Overview',
  'citizen-tracker': 'Citizen Tracker',
  'report-issue': 'Report Issue',
  'ai-analytics': 'Ai Analytics',
  'admin-portal': 'Admin Portal',
  'issue-details': 'Issue Details',
};

const NAV_TABS: Array<{ id: RouteId; label: string; icon: string }> = [
  { id: 'home-overview', label: 'Home', icon: 'home' },
  { id: 'citizen-tracker', label: 'Tracker', icon: 'track_changes' },
  { id: 'report-issue', label: 'Report', icon: 'add' },
  { id: 'ai-analytics', label: 'Insights', icon: 'insights' },
  { id: 'admin-portal', label: 'Admin', icon: 'shield_person' },
];

export const AppShell: React.FC<AppShellProps> = ({
  currentRoute,
  onNavigate,
  onBack,
  notifications,
  onMarkAllRead,
  karma,
  children,
}) => {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const isStackView = currentRoute === 'issue-details';
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-surface">
      {/* Top App Bar */}
      <header className="fixed top-0 inset-x-0 z-50 pt-safe bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="max-w-6xl mx-auto h-16 px-4 md:px-6 flex items-center justify-between gap-3">
          {/* Left Zone: Back + Brand */}
          <div className="flex items-center gap-2.5 min-w-0">
            {isStackView && (
              <button
                type="button"
                aria-label="Go back"
                onClick={onBack}
                className="w-11 h-11 -ml-2 flex items-center justify-center rounded-lg text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[22px]">arrow_back_ios_new</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onNavigate('home-overview')}
              className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer"
            >
              <ResilientImage
                src={BRAND_LOGO_URL}
                alt="CivicSense AI Logo"
                className={`h-8 w-8 rounded-lg object-contain flex-shrink-0 ${isStackView ? 'hidden sm:block' : ''}`}
                fallbackIcon="account_balance"
              />
              <div className="flex flex-col min-w-0">
                {isStackView ? (
                  <h1 className="text-[16px] font-semibold text-primary tracking-tight truncate">
                    Issue Details
                  </h1>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[14px] font-semibold text-primary tracking-tight truncate">
                        CivicSense
                      </span>
                      <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed-variant leading-none font-semibold">
                        AI
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-on-surface-variant truncate">
                      {ROUTE_SUBTITLES[currentRoute]}
                    </span>
                  </>
                )}
              </div>
            </button>
          </div>

          {/* Center Zone (Desktop Nav) */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Primary Navigation">
            {NAV_TABS.map((tab) => {
              const active = currentRoute === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onNavigate(tab.id)}
                  className={`px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Zone: Helpline, Notifications, Profile */}
          <div className="flex items-center gap-1.5 flex-shrink-0 relative">
            <a
              href="tel:1533"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-surface-container text-primary text-[11px] font-semibold hover:bg-surface-container-high transition-colors min-h-[36px] whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">support_agent</span>
              <span>1533 Sahaya</span>
            </a>

            {!isStackView && (
              <button
                type="button"
                aria-label="Notifications"
                onClick={() => {
                  setShowNotifs((v) => !v);
                  setShowProfile(false);
                }}
                className="relative w-11 h-11 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface" />
                )}
              </button>
            )}

            <button
              type="button"
              aria-label="Citizen Profile"
              onClick={() => {
                setShowProfile((v) => !v);
                setShowNotifs(false);
              }}
              className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
            >
              <ResilientImage
                src={PROFILE_AVATAR_URL}
                alt="Rahul Sharma Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-secondary/30"
                fallbackIcon="person"
              />
            </button>

            {/* Notifications Popover */}
            {showNotifs && (
              <div className="absolute right-0 top-14 w-80 max-w-[calc(100vw-2rem)] bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/40 p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                  <span className="text-[13px] font-semibold text-primary">
                    Civic Alerts ({unreadCount} unread)
                  </span>
                  <button
                    type="button"
                    onClick={onMarkAllRead}
                    className="text-[11px] font-semibold text-secondary hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="divide-y divide-surface-container max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => {
                        setShowNotifs(false);
                        if (n.ticketId) {
                          onNavigate('issue-details', n.ticketId);
                        }
                      }}
                      className="w-full text-left py-2.5 px-1.5 hover:bg-surface-container-low rounded-lg transition-colors flex flex-col gap-0.5 cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[12px] font-semibold text-on-surface flex items-center gap-1.5">
                          {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />}
                          {n.title}
                        </span>
                        <span className="text-[10px] text-on-surface-variant shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[12px] text-on-surface-variant leading-snug">{n.body}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Popover */}
            {showProfile && (
              <div className="absolute right-0 top-14 w-72 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/40 p-3.5 z-50 space-y-2.5">
                <div className="flex items-center gap-3">
                  <ResilientImage
                    src={PROFILE_AVATAR_URL}
                    alt="Rahul Sharma"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-secondary/30"
                    fallbackIcon="person"
                  />
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-primary truncate">Rahul Sharma</p>
                    <p className="text-[11px] text-on-surface-variant truncate">Ward 150, Bellandur South</p>
                  </div>
                </div>
                <div className="bg-surface-container-low rounded-lg p-2.5 flex items-center justify-between">
                  <span className="text-[12px] font-medium text-on-surface-variant">Civic Karma Score</span>
                  <span className="text-[13px] font-bold text-secondary tabular-nums">{karma} pts</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfile(false);
                      onNavigate('citizen-tracker');
                    }}
                    className="py-2 px-2.5 rounded-lg bg-surface-container text-primary text-[12px] font-semibold hover:bg-surface-container-high cursor-pointer"
                  >
                    My Tickets
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfile(false);
                      onNavigate('admin-portal');
                    }}
                    className="py-2 px-2.5 rounded-lg bg-primary text-on-primary text-[12px] font-semibold hover:bg-primary-container cursor-pointer"
                  >
                    Admin View
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`flex-1 w-full bg-surface pt-16 ${isStackView ? 'pb-10' : 'pb-24 md:pb-12'} relative flex flex-col`}>
        <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Tab Bar (hidden on desktop and on stack view) */}
      {!isStackView && (
        <nav
          aria-label="Mobile Bottom Navigation"
          className="md:hidden fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.05)]"
        >
          <div className="flex items-center justify-around h-20 px-1">
            {NAV_TABS.map((tab) => {
              const active = currentRoute === tab.id;
              if (tab.id === 'report-issue') {
                return (
                  <button
                    key={tab.id}
                    type="button"
                    aria-current={active ? 'page' : undefined}
                    onClick={() => onNavigate(tab.id)}
                    className={`relative flex flex-col items-center justify-center -top-3 group min-w-[44px] min-h-[44px] cursor-pointer ${
                      active ? 'text-secondary' : ''
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform group-active:scale-95 ${
                        active
                          ? 'bg-secondary text-on-secondary shadow-secondary/25'
                          : 'bg-primary text-on-primary shadow-primary/25'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[26px]">add</span>
                    </div>
                    <span
                      className={`text-[11px] font-semibold mt-1 transition-colors ${
                        active ? 'text-secondary' : 'text-on-surface-variant group-hover:text-primary'
                      }`}
                    >
                      {tab.label}
                    </span>
                  </button>
                );
              }
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-current={active ? 'page' : undefined}
                  onClick={() => onNavigate(tab.id)}
                  className={`flex flex-col items-center justify-center gap-1 w-14 h-14 transition-colors min-w-[44px] min-h-[44px] cursor-pointer ${
                    active ? 'text-secondary' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[22px] ${
                      active ? 'material-symbols-filled' : ''
                    }`}
                  >
                    {tab.icon}
                  </span>
                  <span className="text-[11px] font-semibold">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};
