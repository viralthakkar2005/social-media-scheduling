import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-surface-container-low py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-100" id="footer">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
        {/* Brand Column */}
        <div className="lg:col-span-1">
          <a className="flex items-center gap-2 mb-6" href="#">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1xr64x8M1GrDrdZcQJWxevjKC3t-_POxNoLjfKqweG1VqB2o6I0LRfJqcvr0sP5l6C-Qul7f42mVCPbMSD9u1OCIbnInz9gPn2h0MSi0-6nUdKDvHJILOYz7zHKlPqre8qSBTh8jRKzXm91zz3kWe0ccXOhqov3A6DSWqmc17Q3wMJXZpI_BnaAhVXto3xsRlKYMiIBl8bbtAKV0AyE9a8hfA_Lbz5hnDdNgGSjeWGH2xMHPbEx2zIHDcSTBQ5Ll2hR0"
              alt="Post Bridge Logo"
              className="h-6 w-auto"
            />
            <span className="font-bold text-xl text-navy tracking-tight">post bridge</span>
          </a>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Post content to multiple social media platforms at the same time, all-in one place. Cross posting made easy.
          </p>
          <p className="text-sm text-gray-400">
            Copyright © 2026 - All rights reserved
          </p>
        </div>
        {/* Links Column */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-6">Links</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><a className="hover:text-post-green transition-colors" href="#">Support</a></li>
            <li><a className="hover:text-post-green transition-colors" href="#">Pricing</a></li>
            <li><a className="hover:text-post-green transition-colors" href="#">Blog</a></li>
            <li><a className="hover:text-post-green transition-colors" href="#">Affiliates</a></li>
            <li><a className="hover:text-post-green transition-colors" href="#">Billing</a></li>
            <li><a className="hover:text-post-green transition-colors" href="#">AI Agents</a></li>
            <li><a className="hover:text-post-green transition-colors" href="#">MCP</a></li>
            <li><a className="hover:text-post-green transition-colors" href="#">OpenClaw</a></li>
            <li><a className="hover:text-post-green transition-colors" href="#">Agent Skill</a></li>
          </ul>
        </div>
        {/* Platforms Column */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-6">Platforms</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><a className="hover:text-post-green transition-colors" href="#">Twitter/X scheduler</a></li>
            <li><a className="hover:text-post-green transition-colors" href="#">Instagram scheduler</a></li>
            <li><a className="hover:text-post-green transition-colors" href="#">LinkedIn scheduler</a></li>
            <li><a className="hover:text-post-green transition-colors" href="#">Facebook scheduler</a></li>
            <li><a className="hover:text-post-green transition-colors" href="#">TikTok scheduler</a></li>
            <li><a className="hover:text-post-green transition-colors" href="#">YouTube scheduler</a></li>
            <li><a className="hover:text-post-green transition-colors" href="#">Bluesky scheduler</a></li>
            <li><a className="hover:text-post-green transition-colors" href="#">Threads scheduler</a></li>
            <li><a className="hover:text-post-green transition-colors" href="#">Pinterest scheduler</a></li>
            <li><a className="hover:text-post-green transition-colors" href="#">Google Business scheduler</a></li>
          </ul>
        </div>
        {/* Free Tools Column */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-6">Free Tools</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><a className="hover:text-post-green transition-colors" href="#">Growth Guide</a></li>
            <li><a className="hover:text-post-green transition-colors" href="#">Instagram Grid Maker</a></li>
            <li><a className="hover:text-post-green transition-colors" href="#">Instagram Carousel Splitter</a></li>
            <li><a className="hover:text-post-green transition-colors" href="#">Instagram Handle Checker</a></li>
            <li><a className="hover:text-post-green transition-colors" href="#">TikTok Username Checker</a></li>
            <li><a className="hover:text-post-green transition-colors" href="#">TikTok Caption Generator</a></li>
            <li><a className="hover:text-post-green transition-colors" href="#">LinkedIn Text Formatter</a></li>
            <li><a className="hover:text-post-green transition-colors" href="#">YouTube Title Checker</a></li>
            <li><a className="hover:text-post-green transition-colors" href="#">YouTube Tag Generator</a></li>
            <li><a className="hover:text-post-green transition-colors" href="#">Timeline Blocker for X/Twitter</a></li>
          </ul>
        </div>
        {/* Compare & Legal Column */}
        <div>
          <div className="mb-10">
            <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-6">Compare</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><a className="hover:text-post-green transition-colors" href="#">Buffer alternative</a></li>
              <li><a className="hover:text-post-green transition-colors" href="#">Hootsuite alternative</a></li>
              <li><a className="hover:text-post-green transition-colors" href="#">Later alternative</a></li>
              <li><a className="hover:text-post-green transition-colors" href="#">Publer alternative</a></li>
              <li><a className="hover:text-post-green transition-colors" href="#">Postiz alternative</a></li>
              <li><a className="hover:text-post-green transition-colors" href="#">Best scheduling APIs</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-6">Legal</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><a className="hover:text-post-green transition-colors" href="#">Terms of services</a></li>
              <li><a className="hover:text-post-green transition-colors" href="#">Privacy policy</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
