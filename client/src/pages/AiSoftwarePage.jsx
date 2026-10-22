import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Sparkles,
  Bot,
  Workflow,
  Database,
  Code2,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import SEO from '../components/shared/SEO.jsx';
import { buildWhatsAppUrl } from '../utils/whatsapp.js';

const AI_SOLUTIONS = [
  {
    title: 'AI Business Assistants & WhatsApp Automation',
    badge: 'Editable Draft Copy',
    desc: 'Automated dealer inventory lookup, instant quotation bots, and intelligent customer support agents tailored for wholesale and retail operations.',
    icon: Bot,
  },
  {
    title: 'Custom Enterprise Software & Billing ERPs',
    badge: 'Editable Draft Copy',
    desc: 'Bespoke inventory, serial-number warranty tracking, and multi-branch billing systems designed for Indian distribution businesses.',
    icon: Database,
  },
  {
    title: 'Workflow & Process Automation',
    badge: 'Editable Draft Copy',
    desc: 'Eliminate repetitive manual entry by connecting accounting, dispatch alerts, and CRM pipelines into a unified automated workflow.',
    icon: Workflow,
  },
  {
    title: 'Predictive Analytics & Smart Dashboards',
    badge: 'Editable Draft Copy',
    desc: 'Real-time demand forecasting, stock-velocity insights, and executive reporting dashboards built by the Einstein Team.',
    icon: Code2,
  },
];

export default function AiSoftwarePage() {
  const settings = useSelector((state) => state.content.settings);
  const whatsappNumber = settings?.whatsappNumber || '919372049568';

  const whatsappHref = buildWhatsAppUrl(
    'Hello H-Tech Einstein Team (Karad), I would like to discuss an AI & custom software project.',
    whatsappNumber
  );

  return (
    <div className="bg-white text-[#1D1D1F] min-h-screen">
      <SEO
        title="AI & Software Division — Enter the Einstein Team"
        description="Enter the Einstein Team technology and software division at H-Tech Karad: AI solutions, custom software, and business automation."
        path="/ai-software"
      />

      {/* Apple-Clean White Hero */}
      <section className="bg-white py-20 sm:py-28 border-b border-black/[0.06]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-htech-purple text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              <span>H-Tech Digital Wing 02 • The Einstein Team</span>
            </div>

            <h1 className="heading-hero text-[#1D1D1F]">
              Enter the <span className="text-htech-purple">Einstein Team</span> technology &
              software division.
            </h1>

            <p className="text-base sm:text-xl text-[#86868B] leading-relaxed">
              Hardware brands for today. Intelligent software for tomorrow. We build practical AI
              workflows, custom enterprise applications, and smart automation for modern
              businesses.
            </p>

            <div className="flex flex-wrap gap-3.5 pt-2">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="apple-pill-blue gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Consult the Einstein Team</span>
              </a>
              <Link to="/contact" className="apple-pill-outline gap-2">
                <span>Schedule a Discovery Call</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Offerings Grid (Marked as Editable Draft Copy) */}
      <section className="bg-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-htech-purple">
              Capabilities & Solutions
            </span>
            <h2 className="heading-section text-[#1D1D1F] mt-1">
              AI Solutions, Custom Software & Automation
            </h2>
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-xs font-mono text-htech-purple">
            [Draft Copy — Editable for Client Finalization]
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {AI_SOLUTIONS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="apple-bento-card p-7 sm:p-9 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-htech-purple">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white border border-black/[0.08] text-[11px] font-mono text-[#86868B]">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1D1D1F] tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#86868B] leading-relaxed">{item.desc}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-black/[0.06] flex items-center justify-between text-xs font-semibold text-htech-purple">
                  <span>Einstein Team Division</span>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0066CC] hover:underline"
                  >
                    Enquire Solution →
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 apple-bento-card p-8 sm:p-12 text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] tracking-tight">
            Ready to automate your business with the Einstein Team?
          </h2>
          <p className="text-sm sm:text-base text-[#86868B] max-w-2xl mx-auto">
            Partner with H-Tech’s software division in Karad to build custom AI tools, internal
            dashboards, and automated workflows.
          </p>
          <div className="pt-2">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-htech-green hover:bg-emerald-600 text-white font-semibold text-sm shadow-sm transition"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Start a Conversation on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
