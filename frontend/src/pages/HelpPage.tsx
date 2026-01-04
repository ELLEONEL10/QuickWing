import React from 'react';
import { HelpCircle, Mail, MessageCircle, Phone } from 'lucide-react';

export const HelpPage: React.FC = () => {
  return (
    <div className="flex-grow container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">How can we help you?</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">Search our help center or contact support.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow text-center">
                <div className="w-12 h-12 bg-blue-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-6 h-6 text-brand-blue dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Live Chat</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Chat with our support team 24/7.</p>
                <button className="text-brand-blue dark:text-blue-400 font-bold text-sm hover:underline">Start Chat</button>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow text-center">
                <div className="w-12 h-12 bg-blue-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-brand-blue dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Email Support</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Get a response within 24 hours.</p>
                <button className="text-brand-blue dark:text-blue-400 font-bold text-sm hover:underline">Send Email</button>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow text-center">
                <div className="w-12 h-12 bg-blue-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-6 h-6 text-brand-blue dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Phone Support</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Call us directly for urgent issues.</p>
                <button className="text-brand-blue dark:text-blue-400 font-bold text-sm hover:underline">View Numbers</button>
            </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-slate-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-slate-700">
                {[
                    "How do I change my flight?",
                    "What is the baggage allowance?",
                    "How do I get a refund?",
                    "Can I travel with a pet?"
                ].map((q, i) => (
                    <div key={i} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer flex items-center justify-between group">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{q}</span>
                        <HelpCircle className="w-5 h-5 text-gray-400 group-hover:text-brand-blue dark:group-hover:text-blue-400 transition-colors" />
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
