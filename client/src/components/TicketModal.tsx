import React from 'react';
import { X, Calendar, MapPin, Printer, CheckCircle2, QrCode } from 'lucide-react';
import type { Registration } from '../types';
import { formatDate, formatPrice } from '../utils/formatters';

interface TicketModalProps {
  registration: Registration | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ registration, isOpen, onClose }) => {
  if (!isOpen || !registration) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 print:shadow-none print:border-none print:max-w-none">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Registration Confirmed</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 border border-slate-200"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Ticket
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Ticket Body */}
        <div className="p-6 md:p-8">
          <div className="border-2 border-dashed border-indigo-200 rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-50/40 via-white to-purple-50/40 flex flex-col md:flex-row shadow-sm">
            {/* Left side: Event details */}
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-dashed border-indigo-200">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold tracking-wider uppercase bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">
                    Official E-Ticket
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-400">
                    ID: {registration.ticketCode}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 leading-snug mb-4">
                  {registration.eventTitle}
                </h3>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="font-medium text-slate-800">{formatDate(registration.eventDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{registration.eventLocation}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200/60 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Attendee</span>
                  <strong className="text-slate-800">{registration.attendeeName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Quantity</span>
                  <strong className="text-slate-800">{registration.ticketCount} Ticket(s)</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Amount Paid</span>
                  <strong className="text-indigo-600">
                    {formatPrice(registration.totalAmount, registration.currency)}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Check-in Status</span>
                  <span
                    className={`inline-block font-semibold ${
                      registration.isCheckedIn ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {registration.isCheckedIn ? 'Checked In' : 'Valid / Ready'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right side: Mock QR Code & Ticket Code */}
            <div className="w-full md:w-56 p-6 flex flex-col items-center justify-center bg-white/70 text-center">
              <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-inner mb-3">
                <div className="w-28 h-28 bg-slate-900 rounded-lg p-2 flex flex-col items-center justify-center text-white">
                  <QrCode className="w-20 h-20 text-white" />
                </div>
              </div>
              <span className="text-[10px] font-mono tracking-widest text-slate-500 font-semibold uppercase">
                {registration.ticketCode}
              </span>
              <p className="mt-2 text-[10px] text-slate-400 leading-tight">
                Scan this QR code at the registration desk for instant entry.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Bottom note */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500 print:hidden">
          A copy of this ticket has been saved to your{' '}
          <a href="/my-tickets" className="text-indigo-600 font-medium underline">
            My Tickets
          </a>{' '}
          portal.
        </div>
      </div>
    </div>
  );
};
