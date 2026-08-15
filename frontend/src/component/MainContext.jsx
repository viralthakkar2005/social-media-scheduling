import React from 'react';
import { ArrowRight } from 'lucide-react';
import {
  SiX,
  SiInstagram,
  SiFacebook,
  SiTiktok,
  SiYoutube,
  SiBluesky,
  SiThreads,
  SiPinterest,
  SiGoogle,
} from 'react-icons/si';
import { FaLinkedin as SiLinkedin } from 'react-icons/fa6';
import CrossPostAnimation from './Crosspostanimation';

/**
 * VideoCard
 * ---------
 * Same footprint as CrossPostAnimation: rounded-3xl gradient shell,
 * max-w-lg, aspect-square, border + inner highlight. Keeps the
 * Content management / Scheduling sections visually consistent with
 * the Cross-posting section instead of a plain full-bleed <img>.
 *
 * `src` should point at your local asset, e.g. "/assets/content-management.mp4"
 */
function VideoCard({ src, poster, label }) {
  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 max-w-lg w-full mx-auto border border-gray-200/70 aspect-square shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.04)]">
      <video
        className="w-full h-full object-cover rounded-2xl"
        src={src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        aria-label={label}
      />
    </div>
  );
}

const SUPPORTED_PLATFORMS = [
  { key: 'youtube', bg: 'bg-red-600', rounded: 'rounded-xl', Icon: SiYoutube, label: 'YouTube' },
  { key: 'linkedin', bg: 'bg-blue-600', rounded: 'rounded-xl', Icon: SiLinkedin, label: 'LinkedIn' },
  { key: 'instagram', bg: 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500', rounded: 'rounded-xl', Icon: SiInstagram, label: 'Instagram' },
];

export default function MainContext() {
  return (
    <main id="main-content">
      {/* BEGIN: Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center" id="hero-section">
        {/* Floating Icons */}
        <div className="flex justify-center items-center gap-2 md:gap-3 mb-10 flex-wrap" id="floating-icons-container">
          {/* X / Twitter */}
          <div className="w-8 h-8 rounded-md bg-gray-800 text-white flex items-center justify-center float-icon">
            <SiX className="w-4 h-4" />
          </div>
          {/* Instagram */}
          <div className="w-8 h-8 rounded-md bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 text-white flex items-center justify-center float-icon">
            <SiInstagram className="w-5 h-5" />
          </div>
          {/* LinkedIn */}
          <div className="w-8 h-8 rounded-md bg-blue-600 text-white flex items-center justify-center float-icon">
            <SiLinkedin className="w-4 h-4" />
          </div>
          {/* Facebook */}
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center float-icon">
            <SiFacebook className="w-4 h-4" />
          </div>
          {/* TikTok */}
          <div className="w-8 h-8 rounded-md bg-black text-white flex items-center justify-center float-icon">
            <SiTiktok className="w-4 h-4" />
          </div>
          {/* YouTube */}
          <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center float-icon">
            <SiYoutube className="w-4 h-4" />
          </div>
          {/* Bluesky */}
          <div className="w-8 h-8 rounded-md bg-blue-400 text-white flex items-center justify-center float-icon">
            <SiBluesky className="w-5 h-5" />
          </div>
          {/* Threads */}
          <div className="w-8 h-8 rounded-md bg-white border border-gray-200 text-black flex items-center justify-center float-icon">
            <SiThreads className="w-4 h-4" />
          </div>
          {/* Pinterest */}
          <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center float-icon">
            <SiPinterest className="w-4 h-4" />
          </div>
          {/* Google Business */}
          <div className="w-8 h-8 rounded-md bg-blue-100 border border-blue-200 text-blue-600 flex items-center justify-center float-icon">
            <SiGoogle className="w-4 h-4" />
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-navy tracking-tight leading-tight mb-6">
          Post to all your social<br className="hidden md:block" /> accounts from one dashboard
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 mb-10 flex items-center justify-center gap-2">
          easy to use, fairly priced, with human support from jack 
          <img
            alt="Jack"
            className="w-8 h-8 rounded-full inline-block"
            src='src/assets/founder.webp'
            />.
        </p>
        <a
          className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-post-green rounded-full shadow-sm hover:shadow-md transition-all gap-2 group"
          href="#"
          id="btn-try-free"
        >
          Try it for free 
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </a>
        
      </section>

      {/* CROSS-POSTING SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="cross-posting-section">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Content */}
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-post-green/10 text-post-green text-xs font-bold tracking-wider mb-6">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              CROSS-POSTING
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-navy tracking-tight leading-tight mb-6">
              Post to all platforms <span className="text-post-green">instantly</span>
            </h2>
            <p className="text-lg text-gray-500 mb-10 leading-relaxed">
              Publish everywhere in 30 seconds, not 30 minutes. Manage all your personal and brand accounts without switching back and forth. Connect your social media accounts and publish your content across all platforms with a single click - no learning curve required.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white bg-post-green rounded-full shadow-sm hover:shadow-md transition-all gap-2 group"
                href="#"
                id="btn-start-posting"
              >
                Start posting
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-gray-700 border border-gray-200 rounded-full hover:bg-gray-50 transition-all"
                href="#"
              >
                View platforms
              </a>
            </div>
          </div>
          {/* Right Column: Image Reference */}
          <div className="relative">
            <CrossPostAnimation />
          </div>
        </div>
      </section>

      {/* CONTENT MANAGEMENT SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="content-management-section">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Content */}
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-post-green/10 text-post-green text-xs font-bold tracking-wider mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
              CONTENT MANAGEMENT
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-navy tracking-tight leading-tight mb-6">
              Manage content <span className="text-post-green">efficiently</span>
            </h2>
            <p className="text-lg text-gray-500 mb-10 leading-relaxed">
              View all your scheduled and published posts in one place. Track what's been posted, edit upcoming posts, and stay on top of your content strategy.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white bg-post-green rounded-full shadow-sm hover:shadow-md transition-all gap-2 group"
                href="#"
                id="btn-get-started"
              >
                Get started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-gray-700 border border-gray-200 rounded-full hover:bg-gray-50 transition-all"
                href="#"
              >
                See pricing
              </a>
            </div>
          </div>
          {/* Right Column: Video */}
          <div className="relative">
            <VideoCard
              src="src/assets/contentManage.mp4"
              label="Content management dashboard demo"
            />
          </div>
        </div>
      </section>

      {/* SCHEDULING SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="scheduling-section">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Video */}
          <div className="relative order-2 md:order-1">
            <VideoCard
              src="src/assets/schedulePost.webm"
              label="Scheduling dashboard demo"
            />
          </div>
          {/* Right Column: Content */}
          <div className="text-left order-1 md:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-post-green/10 text-post-green text-xs font-bold tracking-wider mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
              SCHEDULING
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-navy tracking-tight leading-tight mb-6">
              Schedule posts <span className="text-post-green">effortlessly</span>
            </h2>
            <p className="text-lg text-gray-500 mb-10 leading-relaxed">
              Plan your content strategy ahead of time. Schedule posts across all platforms. Customize your posts perfectly per platform. Queue up your posts and let post bridge handle the rest.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white bg-post-green rounded-full shadow-sm hover:shadow-md transition-all gap-2 group"
                href="#"
                id="btn-start-scheduling"
              >
                Start scheduling
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-gray-700 border border-gray-200 rounded-full hover:bg-gray-50 transition-all"
                href="#"
              >
                View demo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SUPPORTED PLATFORMS SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="supported-platforms-section">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-navy tracking-tight leading-tight mb-4">Supported Platforms</h2>
          <p className="text-lg text-gray-500">These are all the platforms you can post to from within post bridge.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl mx-auto" id="platforms-grid">
          {SUPPORTED_PLATFORMS.map(({ key, bg, rounded, Icon, label }) => (
            <div key={key} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-4 hover:shadow-md transition-shadow">
              <div className={`w-14 h-14 ${rounded} ${bg} text-white flex items-center justify-center`}>
                <Icon className="w-8 h-8" />
              </div>
              <span className="font-medium text-gray-700">{label}</span>
            </div>
          ))}
          {/* More to come */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
            </div>
            <span className="font-medium text-gray-400">More to come</span>
          </div>
        </div>
      </section>

      {/* Floating Chat Widget Button */}
      <div className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center cursor-pointer border border-gray-100 hover:shadow-xl transition-shadow z-50 bg-blue-500"></div>
    </main>
  );
}