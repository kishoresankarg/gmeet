import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, Zap, Clock, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      title: 'AI Summarization',
      description: 'Get concise, accurate summaries of your long meetings in seconds using state-of-the-art AI.',
      icon: <Sparkles className="w-6 h-6 text-blue-600" />,
    },
    {
      title: 'Action Item Extraction',
      description: 'Never miss a task again. Our AI automatically identifies and lists clear action items and owners.',
      icon: <CheckCircle2 className="w-6 h-6 text-blue-600" />,
    },
    {
      title: 'Key Point Detection',
      description: 'Find the most important highlights and decisions without reading the entire transcript.',
      icon: <Shield className="w-6 h-6 text-blue-600" />,
    },
  ];

  const stats = [
    { label: 'Time Saved', value: '85%', description: 'per meeting analysis' },
    { label: 'Accuracy', value: '99%', description: 'with Gemini Pro 1.5' },
    { label: 'Analysis Speed', value: '< 2s', description: 'average processing time' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 lg:pt-32 lg:pb-32 bg-white">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-8 animate-in fade-in slide-in-from-bottom-4">
              <Zap className="w-4 h-4 fill-blue-600" />
              <span>New: Faster AI analysis with Gemini Pro 1.5</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              Meetings into <span className="text-blue-600">Action</span>. <br />
              Instantly.
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700">
              Stop wasting hours transcribing and summarizing. MeetPulse uses advanced AI to extract key points and action items from your meeting notes in seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <Link
                href="/generator"
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
              >
                Start Generating
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/about"
                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Feature Preview / Mockup */}
          <div className="mt-20 relative animate-in zoom-in duration-1000">
            <div className="absolute inset-0 bg-blue-600/10 rounded-3xl blur-2xl transform translate-y-4" />
            <div className="relative bg-slate-900 rounded-3xl p-4 sm:p-8 aspect-video flex flex-col items-center justify-center text-white border border-slate-800 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="grid grid-cols-6 grid-rows-6 h-full w-full">
                  {[...Array(36)].map((_, i) => (
                    <div key={i} className="border-[0.5px] border-blue-500" />
                  ))}
                </div>
              </div>
              <div className="z-10 text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 mx-auto animate-pulse">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Analyzing Transcript...</h3>
                <p className="text-slate-400">Processing the core discussion points and identifying tasks.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-50 py-20 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-2">
                <p className="text-4xl lg:text-5xl font-extrabold text-blue-600">{stat.value}</p>
                <p className="text-lg font-bold text-gray-900">{stat.label}</p>
                <p className="text-gray-500">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">Everything you need for better meetings</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Focus on the conversation, we'll handle the notes. Built with power and simplicity in mind.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature) => (
              <div key={feature.title} className="p-8 rounded-3xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all group">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-8">Ready to make your meetings productive?</h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">Join thousands of team members who are saving hours every week with MeetPulse.</p>
          <Link
            href="/generator"
            className="inline-flex items-center px-10 py-5 bg-white text-blue-600 rounded-2xl font-bold text-xl hover:bg-gray-50 transition-all hover:scale-105 shadow-2xl"
          >
            Get Started for Free
          </Link>
        </div>
      </section>
    </div>
  );
}
