import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Save } from 'lucide-react';
import { fetchSettings, updateAdminSettings } from '../../features/contentSlice.js';
import { addToast } from '../../features/uiSlice.js';

export default function AdminSettingsPage() {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.content.settings);

  const [form, setForm] = useState({
    ledTickerText: '',
    primaryMobile: '',
    whatsappNumber: '',
    whatsappUrl: '',
    landline: '',
    email: '',
    whatsappChannelUrl: '',
    whatsappChannelTitle: '',
    instagram: '',
    facebook: '',
    youtube: '',
    telegram: '',
    pinterest: '',
    mapUrl: '',
    heroHeadline: '',
    heroSubline: '',
    footerText: '',
    charityIntroText: '',
    aboutStory: '',
    aboutMission: '',
    aboutWhatWeDo: '',
    aboutMilestonesNote: '',
  });

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (!settings) return;
    setForm({
      ledTickerText: (settings.ledPhoneNumbers || []).join('\n'),
      primaryMobile: settings.primaryMobile || '',
      whatsappNumber: settings.whatsappNumber || '',
      whatsappUrl: settings.whatsappUrl || '',
      landline: settings.landline || '',
      email: settings.email || '',
      whatsappChannelUrl: settings.whatsappChannelUrl || '',
      whatsappChannelTitle: settings.whatsappChannelTitle || '',
      instagram: settings.socialLinks?.instagram || '',
      facebook: settings.socialLinks?.facebook || '',
      youtube: settings.socialLinks?.youtube || '',
      telegram: settings.socialLinks?.telegram || '',
      pinterest: settings.socialLinks?.pinterest || '',
      mapUrl: settings.socialLinks?.mapUrl || '',
      heroHeadline: settings.heroHeadline || '',
      heroSubline: settings.heroSubline || '',
      footerText: settings.footerText || '',
      charityIntroText: settings.charityIntroText || '',
      aboutStory: settings.aboutBlocks?.story || '',
      aboutMission: settings.aboutBlocks?.mission || '',
      aboutWhatWeDo: settings.aboutBlocks?.whatWeDo || '',
      aboutMilestonesNote: settings.aboutBlocks?.milestonesNote || '',
    });
  }, [settings]);

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      ledPhoneNumbers: form.ledTickerText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      primaryMobile: form.primaryMobile,
      whatsappNumber: form.whatsappNumber,
      whatsappUrl: form.whatsappUrl,
      landline: form.landline,
      email: form.email,
      whatsappChannelUrl: form.whatsappChannelUrl,
      whatsappChannelTitle: form.whatsappChannelTitle,
      socialLinks: {
        instagram: form.instagram,
        facebook: form.facebook,
        youtube: form.youtube,
        telegram: form.telegram,
        pinterest: form.pinterest,
        mapUrl: form.mapUrl,
      },
      heroHeadline: form.heroHeadline,
      heroSubline: form.heroSubline,
      footerText: form.footerText,
      charityIntroText: form.charityIntroText,
      aboutBlocks: {
        story: form.aboutStory,
        mission: form.aboutMission,
        whatWeDo: form.aboutWhatWeDo,
        milestonesNote: form.aboutMilestonesNote,
      },
    };

    const res = await dispatch(updateAdminSettings(payload));
    if (!res.error) {
      dispatch(addToast({ type: 'success', message: 'Site settings saved!' }));
    } else {
      dispatch(addToast({ type: 'error', message: res.payload || 'Error saving settings' }));
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Site Settings</h2>
          <p className="text-xs text-slate-500">
            Configure phone numbers, LED ticker, WhatsApp channel, social links, hero text, and
            About page copy.
          </p>
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-htech-navy hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow"
        >
          <Save className="w-4 h-4" />
          <span>Save All Settings</span>
        </button>
      </div>

      {/* Contact & LED Ticker */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-4 text-xs sm:text-sm">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-htech-blue">
          Phones, WhatsApp & Red LED Ticker
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Primary Mobile
            </label>
            <input
              type="text"
              value={form.primaryMobile}
              onChange={(e) => setForm({ ...form, primaryMobile: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              WhatsApp Number (Digits with Country Code)
            </label>
            <input
              type="text"
              value={form.whatsappNumber}
              onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Landline
            </label>
            <input
              type="text"
              value={form.landline}
              onChange={(e) => setForm({ ...form, landline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Official Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
            Contact Page Red LED Ticker Lines (One per line)
          </label>
          <textarea
            rows={4}
            value={form.ledTickerText}
            onChange={(e) => setForm({ ...form, ledTickerText: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs"
          />
        </div>
      </div>

      {/* WhatsApp Channel & Social Links */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-4 text-xs sm:text-sm">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-htech-green">
          WhatsApp Broadcast Channel & Social Links
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              WhatsApp Channel Title
            </label>
            <input
              type="text"
              value={form.whatsappChannelTitle}
              onChange={(e) => setForm({ ...form, whatsappChannelTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              WhatsApp Channel URL
            </label>
            <input
              type="text"
              value={form.whatsappChannelUrl}
              onChange={(e) => setForm({ ...form, whatsappChannelUrl: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Instagram URL
            </label>
            <input
              type="text"
              value={form.instagram}
              onChange={(e) => setForm({ ...form, instagram: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Facebook URL
            </label>
            <input
              type="text"
              value={form.facebook}
              onChange={(e) => setForm({ ...form, facebook: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              YouTube URL
            </label>
            <input
              type="text"
              value={form.youtube}
              onChange={(e) => setForm({ ...form, youtube: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Telegram URL
            </label>
            <input
              type="text"
              value={form.telegram}
              onChange={(e) => setForm({ ...form, telegram: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
            />
          </div>
        </div>
      </div>

      {/* Hero, Charity & About Content Blocks */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-4 text-xs sm:text-sm">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-htech-purple">
          Hero, Footer & About Page Content Blocks
        </h3>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
            Homepage Hero Headline
          </label>
          <input
            type="text"
            value={form.heroHeadline}
            onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
            Homepage Hero Subline
          </label>
          <input
            type="text"
            value={form.heroSubline}
            onChange={(e) => setForm({ ...form, heroSubline: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
            About Page Brand Story
          </label>
          <textarea
            rows={4}
            value={form.aboutStory}
            onChange={(e) => setForm({ ...form, aboutStory: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
            About Page Mission
          </label>
          <textarea
            rows={2}
            value={form.aboutMission}
            onChange={(e) => setForm({ ...form, aboutMission: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
            Charity Intro Text
          </label>
          <textarea
            rows={2}
            value={form.charityIntroText}
            onChange={(e) => setForm({ ...form, charityIntroText: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
          />
        </div>
      </div>
    </form>
  );
}
