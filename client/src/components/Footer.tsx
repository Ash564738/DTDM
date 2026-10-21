import React from 'react';
import { Calendar, Server, Container, Database, Globe, Code } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-white">EventFlow</span>
              <span className="text-xs px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
                Cloud EMS
              </span>
            </div>
            <p className="text-slate-400 max-w-md text-xs leading-relaxed">
              A modern, production-ready Event Management System frontend engineered with React 19, TypeScript, and
              Tailwind CSS. Built for seamless containerization with Docker and high-availability deployment on Render.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-cyan-400 border border-slate-700">
                <Container className="w-3.5 h-3.5" /> Docker Ready
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-indigo-400 border border-slate-700">
                <Globe className="w-3.5 h-3.5" /> Render Cloud
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-emerald-400 border border-slate-700">
                <Server className="w-3.5 h-3.5" /> Node.js & Express
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-blue-400 border border-slate-700">
                <Database className="w-3.5 h-3.5" /> PostgreSQL
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="/events" className="hover:text-indigo-400 transition-colors">
                  Explore All Events
                </a>
              </li>
              <li>
                <a href="/my-tickets" className="hover:text-indigo-400 transition-colors">
                  My Booked Tickets
                </a>
              </li>
              <li>
                <a href="/organizer" className="hover:text-indigo-400 transition-colors">
                  Organizer Dashboard
                </a>
              </li>
              <li>
                <a href="/organizer/events/new" className="hover:text-indigo-400 transition-colors">
                  Host an Event
                </a>
              </li>
            </ul>
          </div>

          {/* Project Details */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Course Project</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="font-medium text-slate-300">Cloud Application Development</p>
              <p>Node.js, PostgreSQL, Docker & Render Deployment Project</p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <Code className="w-4 h-4" /> Client Service v1.0.0
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 EventFlow - Cloud Event Management System. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Built with React 19, TypeScript & Vite</p>
        </div>
      </div>
    </footer>
  );
};
