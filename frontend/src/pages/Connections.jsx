import React, { useState } from 'react';
import { X, Plus, RefreshCw, HelpCircle, Check, Info } from 'lucide-react';
import {
  YoutubeIcon,
  LinkedinIcon,
  InstagramIcon,
} from '../component/dashboard/SocialIcons';

// Default initial data supporting multiple accounts per platform for the 3 core supported platforms
const INITIAL_CONNECTIONS = {
  Instagram: [
    { id: 'ig1', name: 'jackfriks', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120' },
    { id: 'ig2', name: 'Curiosity.quench', avatar: 'bg-black-logo' },
    { id: 'ig3', name: 'scroll_less_live_more', avatar: 'bg-blue-500-phone' },
    { id: 'ig4', name: 'Postbridge', avatar: 'bg-slate-200-logo' },
    { id: 'ig5', name: 'doof.app', avatar: 'bg-emerald-500-app' },
  ],
  Linkedin: [
    { id: 'li1', name: 'post bridge', avatar: 'bg-slate-200-logo' },
    { id: 'li2', name: 'jack friks', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120' },
    { id: 'li3', name: 'Post Bridge Page', avatar: 'bg-[#0f172a]-P' },
  ],
  Youtube: [
    { id: 'yt1', name: 'jack friks', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120' },
    { id: 'yt2', name: 'jack friks shorts', avatar: 'bg-black-skull' },
    { id: 'yt3', name: 'Post Bridge TV', avatar: 'bg-blue-500-phone' },
  ],
};

const PLATFORMS_CONFIG = [
  { key: 'Youtube', label: 'Connect Youtube', icon: YoutubeIcon },
  { key: 'Linkedin', label: 'Connect Linkedin', icon: LinkedinIcon },
  { key: 'Instagram', label: 'Connect Instagram', icon: InstagramIcon },
];

export default function Connections() {
  const [connections, setConnections] = useState(INITIAL_CONNECTIONS);
  const [modalPlatform, setModalPlatform] = useState(null);
  const [newAccountName, setNewAccountName] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [refreshingPlatform, setRefreshingPlatform] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleDisconnect = (platformKey, accountId, accountName) => {
    setConnections((prev) => ({
      ...prev,
      [platformKey]: prev[platformKey].filter((acc) => acc.id !== accountId),
    }));
    showToast(`Disconnected ${accountName} from ${platformKey}`);
  };

  const handleConnectNew = (e) => {
    e.preventDefault();
    if (!newAccountName.trim() || !modalPlatform) return;

    const newAcc = {
      id: Date.now().toString(),
      name: newAccountName.trim(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
    };

    setConnections((prev) => ({
      ...prev,
      [modalPlatform]: [...(prev[modalPlatform] || []), newAcc],
    }));

    showToast(`Connected ${newAccountName.trim()} to ${modalPlatform}`);
    setNewAccountName('');
    setModalPlatform(null);
  };

  const handleRefresh = (platformName) => {
    setRefreshingPlatform(platformName);
    setTimeout(() => {
      setRefreshingPlatform(null);
      showToast(`Successfully refreshed ${platformName} accounts`);
    }, 800);
  };

  // Helper to render avatar or stylized icon fallback
  const renderAvatar = (account) => {
    if (account.avatar.startsWith('http')) {
      return (
        <img
          src={account.avatar}
          alt={account.name}
          className="w-5 h-5 rounded-full object-cover flex-shrink-0"
        />
      );
    }

    if (account.avatar === 'bg-black-logo') {
      return (
        <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold flex-shrink-0">
          C
        </span>
      );
    }

    if (account.avatar === 'bg-[#0f172a]-P') {
      return (
        <span className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center text-[9px] font-bold flex-shrink-0">
          P
        </span>
      );
    }

    if (account.avatar === 'bg-amber-100-S') {
      return (
        <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-[9px] font-bold flex-shrink-0">
          S
        </span>
      );
    }

    if (account.avatar === 'bg-emerald-500-app') {
      return (
        <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold flex-shrink-0">
          D
        </span>
      );
    }

    if (account.avatar === 'bg-blue-500-phone') {
      return (
        <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-bold flex-shrink-0">
          📱
        </span>
      );
    }

    if (account.avatar === 'bg-black-skull') {
      return (
        <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[9px] font-bold flex-shrink-0">
          ☠️
        </span>
      );
    }

    // Default logo placeholder
    return (
      <span className="w-5 h-5 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-[9px] font-bold flex-shrink-0">
        pb
      </span>
    );
  };

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto min-h-screen flex flex-col justify-between font-sans">
      <div>
        {/* Header Title */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#1e293b] tracking-tight">
            Connected Accounts
          </h1>
        </div>

        {/* Connections Rows */}
        <div className="flex flex-col gap-5">
          {PLATFORMS_CONFIG.map((platform) => {
            const IconComponent = platform.icon;
            const accounts = connections[platform.key] || [];

            return (
              <div
                key={platform.key}
                className="flex flex-wrap items-center gap-3 py-1"
              >
                {/* Platform Icon */}
                <div className="w-8 h-8 flex items-center justify-center text-slate-800 flex-shrink-0">
                  <IconComponent className="w-6 h-6" />
                </div>

                {/* Dark Connect Button */}
                <button
                  type="button"
                  onClick={() => setModalPlatform(platform.key)}
                  className="bg-[#242b38] hover:bg-[#181f2a] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer min-w-[150px]"
                >
                  <span>{platform.label}</span>
                </button>

                {/* Connected Account Chips */}
                <div className="flex flex-wrap items-center gap-2">
                  {accounts.map((acc) => (
                    <div
                      key={acc.id}
                      className="bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 px-3 py-1.5 rounded-full flex items-center gap-2 text-sm text-slate-700 transition-colors shadow-2xs"
                    >
                      {renderAvatar(acc)}
                      <span className="font-medium text-slate-800 text-xs sm:text-sm">
                        {acc.name}
                      </span>
                      {acc.verified && (
                        <span className="w-3.5 h-3.5 rounded-full bg-[#1d9bf0] text-white flex items-center justify-center text-[8px] font-bold">
                          ✓
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          handleDisconnect(platform.key, acc.id, acc.name)
                        }
                        title="Disconnect account"
                        className="text-slate-400 hover:text-rose-500 hover:bg-slate-200 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold transition-colors ml-0.5 cursor-pointer"
                      >
                        <X className="w-3 h-3 stroke-[3]" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Refresh Buttons Row */}
        <div className="mt-12 pt-6 border-t border-slate-200/60 flex flex-wrap items-center gap-3">
          {['YouTube', 'LinkedIn', 'Instagram'].map((pName) => (
            <button
              key={pName}
              type="button"
              onClick={() => handleRefresh(pName)}
              disabled={refreshingPlatform === pName}
              className="bg-white border border-slate-300 hover:border-slate-400 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold shadow-2xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {refreshingPlatform === pName && (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#5bc983]" />
              )}
              <span>Refresh {pName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer Link */}
      <div className="mt-12 pt-4">
        <a
          href="#help"
          onClick={(e) => {
            e.preventDefault();
            showToast('Opening help & connection guide...');
          }}
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors cursor-pointer"
        >
          <Info className="w-4 h-4 text-slate-400" />
          <span className="underline">Get help connecting your accounts</span>
        </a>
      </div>

      {/* Modal for connecting a new account */}
      {modalPlatform && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-100 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">
                Connect {modalPlatform} Account
              </h3>
              <button
                onClick={() => setModalPlatform(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConnectNew} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Account Name / Username
                </label>
                <input
                  type="text"
                  placeholder="e.g. my_brand_official"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  autoFocus
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#5bc983] text-sm text-slate-800"
                />
              </div>

              <p className="text-xs text-slate-400">
                Authorizing Post Bridge to manage posts on your behalf for {modalPlatform}.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalPlatform(null)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#5bc983] hover:bg-[#4eb573] shadow-2xs transition-colors cursor-pointer"
                >
                  Authorize & Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-sm font-medium flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-[#5bc983]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
