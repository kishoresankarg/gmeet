import React from 'react';
import { Target, Users, Code, Mail } from 'lucide-react';

export default function AboutPage() {
    const values = [
        {
            title: 'Precision',
            description: 'We believe in accurate, reliable AI that you can trust for your most important decisions.',
            icon: <Target className="w-6 h-6 text-indigo-600" />,
        },
        {
            title: 'Simplicity',
            description: 'Complex technology should feel simple. We focus on clean interfaces and intuitive workflows.',
            icon: <Users className="w-6 h-6 text-indigo-600" />,
        },
        {
            title: 'Privacy',
            description: 'Your data is yours. We use secure endpoints and don\'t store more than what\'s necessary for your history.',
            icon: <Code className="w-6 h-6 text-indigo-600" />,
        },
    ];

    return (
        <div className="bg-white">
            {/* Header */}
            <section className="py-24 bg-slate-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
                        Making meetings matter.
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        MeetPulse was born out of a simple frustration: Too much time is spent on summarizing meetings and not enough on doing the work discussed.
                    </p>
                </div>
            </section>

            {/* Narrative Section */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-lg lg:prose-xl text-gray-600 font-medium">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Mission</h2>
                        <p className="mb-8">
                            In today's fast-paced remote and hybrid work environments, communication is constant. But communication without clarity leads to confusion. We built MeetPulse to bridge that gap.
                        </p>
                        <p className="mb-8">
                            By leveraging the latest breakthroughs in LLMs (Large Language Models), we've created a tool that understands the nuances of human conversation. Whether it's a technical sync, a creative brainstorm, or a board meeting, our AI identifies the threads that matter most.
                        </p>
                        <p>
                            Our goal is to give every team member an hour back in their day. That's time you could spend on deep work, family, or just catching your breath.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-24 bg-blue-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900">What drives us</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {values.map((value) => (
                            <div key={value.title} className="bg-white p-10 rounded-3xl shadow-sm border border-blue-50">
                                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-gray-900">{value.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact / Footer CTA */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-slate-900 rounded-[2.5rem] p-12 lg:p-20 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-6 relative">Have questions or feedback?</h2>
                        <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto relative">
                            We're always looking to improve. Reach out to us and let us know how we can make MeetPulse better for you.
                        </p>
                        <button className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all">
                            <Mail className="w-5 h-5" />
                            Contact Our Team
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
