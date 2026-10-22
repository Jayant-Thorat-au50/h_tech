import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import FloatingActions from './FloatingActions.jsx';
import Lightbox from '../shared/Lightbox.jsx';
import ToastContainer from '../shared/ToastContainer.jsx';
import { fetchSettings, fetchBranches } from '../../features/contentSlice.js';

export default function PublicLayout() {
  const dispatch = useDispatch();
  const location = useLocation();
  const settings = useSelector((state) => state.content.settings);
  const branches = useSelector((state) => state.content.branches);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  useEffect(() => {
    if (!settings) dispatch(fetchSettings());
    if (!branches || branches.length === 0) dispatch(fetchBranches());
  }, [dispatch, settings, branches]);

  // Global Scroll-Reveal Observer for all cards across every page
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('scroll-card-hidden');
            entry.target.classList.add('scroll-card-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    const registerCards = () => {
      const cards = document.querySelectorAll('.apple-bento-card, [data-scroll-card]');
      cards.forEach((card) => {
        if (
          !card.classList.contains('scroll-card-visible') &&
          !card.classList.contains('scroll-card-hidden')
        ) {
          card.classList.add('scroll-card-hidden');
          io.observe(card);
        }
      });
    };

    registerCards();

    const mo = new MutationObserver(() => {
      registerCards();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1D1D1F]">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingActions />
      <Lightbox />
      <ToastContainer />
    </div>
  );
}
