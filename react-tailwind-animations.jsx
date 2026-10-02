/**
 * REACT + TAILWIND ANIMATION IMPLEMENTATION GUIDE
 * 
 * This shows how to port the vanilla CSS animation system to React.
 * Use Framer Motion for advanced control or Tailwind's built-in utilities.
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============ ANIMATION VARIANTS (REUSABLE) ============
const pageVariants = {
  enter: {
    opacity: 0,
    y: 8,
  },
  center: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.15,
      ease: 'easeInOut',
    },
  },
};

const cardVariants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.08, // Staggered 80ms
      duration: 0.25,
      ease: 'easeOut',
    },
  }),
  hover: {
    y: -2,
    transition: {
      duration: 0.15,
      ease: 'easeInOut',
    },
  },
};

const buttonVariants = {
  hover: {
    y: -1,
    transition: { duration: 0.15 },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

// ============ PAGE TRANSITION WRAPPER ============
export function AnimatedLayout({ children, pageKey }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        variants={pageVariants}
        initial="enter"
        animate="center"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// ============ VIDEO CARD COMPONENT ============
export function VideoCard({ title, description, index }) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="bg-[#0d1730] border border-[#1d2c52] rounded-lg overflow-hidden hover:border-[#5ee0c0] hover:bg-[#0d1730]/80 transition-all duration-150"
    >
      <div className="aspect-video bg-black/50 flex items-center justify-center mb-4">
        <span className="text-[#6f86b3] text-sm">Video Placeholder</span>
      </div>
      <div className="p-5">
        <h3 className="text-[#7eb6ff] font-semibold text-lg mb-2">{title}</h3>
        <p className="text-[#6f86b3] text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

// ============ NAVIGATION WITH UNDERLINE EFFECT ============
export function Navigation({ activeTab, setActiveTab }) {
  const tabs = ['Home', 'About', 'Plans', 'Videos', 'Contact'];

  return (
    <nav className="w-full max-w-4xl px-6 py-6">
      <div className="flex gap-0 bg-[#0d1730]/50 border border-[#1d2c52] rounded-lg overflow-hidden">
        {tabs.map((tab) => (
          <motion.a
            key={tab}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab(tab);
            }}
            className={`flex-1 text-center py-3 px-4 font-medium text-sm relative ${
              activeTab === tab
                ? 'text-[#5ee0c0] bg-[#5ee0c0]/10 font-semibold'
                : 'text-[#6f86b3] hover:text-[#5ee0c0] hover:bg-[#5ee0c0]/08'
            }`}
            whileHover={{ backgroundColor: 'rgba(94, 224, 192, 0.08)' }}
            transition={{ duration: 0.15 }}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5ee0c0]"
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.a>
        ))}
      </div>
    </nav>
  );
}

// ============ BUTTON COMPONENTS WITH MICRO-INTERACTIONS ============
export function PrimaryButton({ children, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      className="px-6 py-3 bg-gradient-to-br from-[#e8c468]/15 to-[#5ee0c0]/10 border border-[#e8c468] text-[#e8c468] rounded-lg font-semibold text-sm transition-all duration-150 hover:shadow-lg hover:shadow-[#e8c468]/20"
    >
      {children}
    </motion.button>
  );
}

export function SecondaryButton({ children, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      className="px-6 py-3 border border-[#1d2c52] text-[#6f86b3] rounded-lg font-semibold text-sm transition-all duration-150 hover:border-[#5ee0c0] hover:text-[#5ee0c0] hover:bg-[#5ee0c0]/08"
    >
      {children}
    </motion.button>
  );
}

// ============ MAIN PAGE COMPONENT ============
export function VideoExamplesPage() {
  const [activeTab, setActiveTab] = useState('Videos');
  const videos = [
    { title: 'Featured Video', description: 'A sample of our custom AI video production.' },
    { title: 'Short Example', description: 'A dynamic video showcasing our creative style.' },
    { title: 'Short Example', description: 'A dynamic video showcasing our creative style.' },
    { title: 'Short Example', description: 'A dynamic video showcasing our creative style.' },
    { title: 'Short Example', description: 'A dynamic video showcasing our creative style.' },
  ];

  return (
    <AnimatedLayout pageKey={activeTab}>
      <div className="min-h-screen bg-gradient-to-b from-[#060c1c] via-[#0a1530] to-[#081026] flex flex-col items-center">
        {/* Header */}
        <header className="w-full max-w-4xl px-6 py-9 flex items-center justify-between">
          <motion.a
            href="#"
            className="flex items-center gap-2 px-3 py-1.5 text-[#6f86b3] text-sm font-semibold border border-[#1d2c52] rounded-lg transition-all duration-150 hover:border-[#5ee0c0] hover:text-[#5ee0c0]"
            whileHover={{ y: -1 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L1 5v5c0 4.418 7 5 7 5s7-.582 7-5V5l-7-4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
            bysolutions.ym
          </motion.a>
        </header>

        {/* Navigation */}
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content */}
        <main className="w-full max-w-4xl px-6 pb-16">
          {/* Title Block */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.25 }}
            className="mb-12"
          >
            <h1 className="text-5xl font-bold text-[#7eb6ff] mb-3">Video Examples</h1>
            <p className="text-base text-[#6f86b3] leading-relaxed">A look at real AI-generated videos we've produced.</p>
          </motion.div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
            {videos.map((video, index) => (
              <VideoCard
                key={`${video.title}-${index}`}
                title={video.title}
                description={video.description}
                index={index}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.25 }}
            className="flex gap-3 justify-center flex-wrap"
          >
            <PrimaryButton>See Plans & Pricing</PrimaryButton>
            <SecondaryButton>Ask a Question</SecondaryButton>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="w-full max-w-4xl px-6 py-6 text-center text-[#6f86b3] text-xs">
          © {new Date().getFullYear()} BY Solutions. All rights reserved.
        </footer>
      </div>
    </AnimatedLayout>
  );
}

export default VideoExamplesPage;
