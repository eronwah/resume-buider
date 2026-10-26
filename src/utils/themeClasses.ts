import { ColorTheme, FontSizeMode, TemplateStyle } from '../types/resume';

export function getThemeAccentColors(theme: ColorTheme) {
  switch (theme) {
    case 'indigo':
      return {
        primary: 'text-indigo-700',
        bgPrimary: 'bg-indigo-700',
        bgLight: 'bg-indigo-50',
        border: 'border-indigo-600',
        borderLight: 'border-indigo-200',
        badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        heading: 'text-indigo-900',
        headerBg: 'bg-gradient-to-r from-indigo-800 to-indigo-950 text-white',
        bulletDot: 'bg-indigo-600',
      };
    case 'emerald':
      return {
        primary: 'text-emerald-700',
        bgPrimary: 'bg-emerald-700',
        bgLight: 'bg-emerald-50',
        border: 'border-emerald-600',
        borderLight: 'border-emerald-200',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        heading: 'text-emerald-900',
        headerBg: 'bg-gradient-to-r from-emerald-800 to-emerald-950 text-white',
        bulletDot: 'bg-emerald-600',
      };
    case 'navy':
      return {
        primary: 'text-sky-800',
        bgPrimary: 'bg-sky-800',
        bgLight: 'bg-sky-50',
        border: 'border-sky-700',
        borderLight: 'border-sky-200',
        badge: 'bg-sky-100 text-sky-800 border-sky-200',
        heading: 'text-slate-900',
        headerBg: 'bg-gradient-to-r from-sky-900 to-slate-900 text-white',
        bulletDot: 'bg-sky-700',
      };
    case 'crimson':
      return {
        primary: 'text-rose-700',
        bgPrimary: 'bg-rose-700',
        bgLight: 'bg-rose-50',
        border: 'border-rose-600',
        borderLight: 'border-rose-200',
        badge: 'bg-rose-100 text-rose-800 border-rose-200',
        heading: 'text-rose-950',
        headerBg: 'bg-gradient-to-r from-rose-900 to-slate-950 text-white',
        bulletDot: 'bg-rose-600',
      };
    case 'amber':
      return {
        primary: 'text-amber-800',
        bgPrimary: 'bg-amber-700',
        bgLight: 'bg-amber-50',
        border: 'border-amber-600',
        borderLight: 'border-amber-200',
        badge: 'bg-amber-100 text-amber-900 border-amber-200',
        heading: 'text-amber-950',
        headerBg: 'bg-gradient-to-r from-amber-800 to-stone-900 text-white',
        bulletDot: 'bg-amber-700',
      };
    case 'slate':
    default:
      return {
        primary: 'text-slate-800',
        bgPrimary: 'bg-slate-800',
        bgLight: 'bg-slate-100',
        border: 'border-slate-800',
        borderLight: 'border-slate-200',
        badge: 'bg-slate-100 text-slate-800 border-slate-200',
        heading: 'text-slate-900',
        headerBg: 'bg-gradient-to-r from-slate-900 to-slate-950 text-white',
        bulletDot: 'bg-slate-700',
      };
  }
}

export function getFontFamilyClass(style: TemplateStyle) {
  switch (style) {
    case 'classic-serif':
      return 'font-serif';
    case 'tech-lead':
      return 'font-sans';
    case 'ats-clean':
      return 'font-sans';
    case 'modern-executive':
    default:
      return 'font-sans';
  }
}

export function getFontSizeClasses(size: FontSizeMode) {
  switch (size) {
    case 'compact':
      return {
        body: 'text-[11px] leading-[15px]',
        bullet: 'text-[11px] leading-[15px]',
        heading1: 'text-xl font-bold tracking-tight',
        heading2: 'text-xs font-bold tracking-wider uppercase',
        meta: 'text-[10px] leading-[13px]',
        spacing: 'space-y-2.5',
        sectionGap: 'mb-3',
      };
    case 'relaxed':
      return {
        body: 'text-[13px] leading-[20px]',
        bullet: 'text-[13px] leading-[19px]',
        heading1: 'text-2xl font-bold tracking-tight',
        heading2: 'text-sm font-bold tracking-wider uppercase',
        meta: 'text-[12px] leading-[16px]',
        spacing: 'space-y-4',
        sectionGap: 'mb-5',
      };
    case 'standard':
    default:
      return {
        body: 'text-[12px] leading-[17px]',
        bullet: 'text-[12px] leading-[17px]',
        heading1: 'text-[22px] font-bold tracking-tight',
        heading2: 'text-[13px] font-bold tracking-wider uppercase',
        meta: 'text-[11px] leading-[15px]',
        spacing: 'space-y-3',
        sectionGap: 'mb-4',
      };
  }
}
