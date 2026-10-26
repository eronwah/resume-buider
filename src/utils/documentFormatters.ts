import { EducationItem, ReferenceItem } from '../types/resume';

/**
 * Formats an education entry so that attendance dates and graduation years
 * are never duplicated between graduationYear and honorsOrDetails/degree.
 */
export function formatEducationItem(edu: EducationItem) {
  let degree = (edu.degree || '').trim();
  let institution = (edu.institution || '').trim();
  let location = (edu.location || '').trim();
  let displayYear = (edu.graduationYear || '').trim();
  let details = (edu.honorsOrDetails || '').trim();

  // 1. If institution contains trailing parentheses like "(Gapan City, Nueva Ecija)", extract to location
  const parenLocMatch = institution.match(/^(.*?)\s*\(([^()]+(?:,\s*[^()]+)+)\)$/);
  if (parenLocMatch) {
    institution = parenLocMatch[1].trim();
    if (!location) {
      location = parenLocMatch[2].trim();
    }
  }

  // 2. If details starts with or contains an attendance phrase like "Attended June 2012 – March 2020"
  const attendanceMatch = details.match(/(?:^|\(?)\s*Attended\s+([A-Za-z0-9\s–\-,]+?)(?:\.|\)|;|$)/i);
  if (attendanceMatch) {
    const matchedDates = attendanceMatch[1].trim();
    if (!displayYear || displayYear.length <= 4) {
      displayYear = matchedDates;
    }
    details = details
      .replace(/(?:^|\(?)\s*Attended\s+[A-Za-z0-9\s–\-,]+?(?:\.|\)|;|\s*-\s*)\s*/i, '')
      .replace(/^\)+/, '')
      .trim();
  }

  // 3. Deduplicate displayYear if it repeats in details
  if (displayYear) {
    details = details.replace(new RegExp(`^\\(?\\s*${displayYear.replace(/[–-]/g, '[–-]')}\\s*[.,;:–-]?\\s*\\)?`, 'i'), '').trim();
    const yearDigits = displayYear.match(/\b(19\d\d|20\d\d)\b/g);
    if (yearDigits) {
      for (const y of yearDigits) {
        details = details.replace(new RegExp(`^\\(?\\s*${y}\\s*[.,;:–-]?\\s*\\)?`, 'i'), '').trim();
      }
    }
  }

  // 4. Strip duplicate location from institution if location is already set
  if (location) {
    const cleanLoc = location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    institution = institution
      .replace(new RegExp(`\\s*\\(?${cleanLoc}\\)?$`, 'i'), '')
      .replace(/[\s,•–|]+$/, '')
      .trim();
  }

  // Clean leftover trailing or leading punctuation
  details = details
    .replace(/^[\s,;.:\-•–—)]+/, '')
    .replace(/[\s,;.:\-•–—(]+$/, '')
    .trim();

  if (details === '()' || details === '') {
    details = '';
  }

  // Build Line 2: university | Place
  let universityAndPlace = institution;
  if (location) {
    // Avoid repeating if institution already has the location substring
    if (!institution.toLowerCase().includes(location.toLowerCase())) {
      universityAndPlace = institution ? `${institution} | ${location}` : location;
    }
  }

  return {
    degree,
    institution,
    location,
    displayYear,
    universityAndPlace,
    cleanDetails: details,
  };
}

/**
 * Formats a reference entry to match the required standard:
 * Line 1 : Name
 * Line 2 : Company
 * Line 3 : Position
 * Line 4 : Phone | Email(optional)
 */
export function formatReferenceItem(ref: ReferenceItem) {
  let name = (ref.name || '').trim();
  let company = (ref.company || '').trim();
  let title = (ref.title || '').trim();
  let phone = (ref.phone || '').trim();
  let email = (ref.email || '').trim();
  let extraContact = (ref.contact || '').trim();

  // Fallback: If company is empty, see if title or contact has company
  if (!company && title) {
    if (title.includes(' • ')) {
      const parts = title.split(' • ');
      title = parts[0].trim();
      company = parts[1].trim();
    } else if (title.includes(' at ')) {
      const parts = title.split(' at ');
      title = parts[0].trim();
      company = parts[1].trim();
    } else if (title.includes(' - ')) {
      const parts = title.split(' - ');
      if (parts.length === 2 && parts[1].length > 3) {
        title = parts[0].trim();
        company = parts[1].trim();
      }
    } else if (title.includes(', ')) {
      const parts = title.split(', ');
      if (parts.length >= 2) {
        title = parts[0].trim();
        company = parts.slice(1).join(', ').trim();
      }
    }
  }

  // Fallback: If phone is missing, try to extract from extraContact, title, or company
  if (!phone) {
    const phoneRegex = /(?:(?:Phone|Tel|Mobile|CP|Cell|Contact)\s*[:\-]?\s*)?(\+?[0-9][0-9\s\-()]{6,}[0-9])/i;
    const sources = [extraContact, title, company, name];
    for (const src of sources) {
      if (!src) continue;
      const match = src.match(phoneRegex);
      if (match && match[1] && match[1].replace(/\D/g, '').length >= 7) {
        phone = match[1].trim();
        break;
      }
    }
  }

  // Fallback: If email is missing, try to extract from extraContact, title, or company
  if (!email) {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const sources = [extraContact, title, company];
    for (const src of sources) {
      if (!src) continue;
      const match = src.match(emailRegex);
      if (match) {
        email = match[0].trim();
        break;
      }
    }
  }

  // Clean phone string from title or company if it leaked in
  if (phone) {
    const rawDigits = phone.replace(/[+()\-]/g, '\\$&');
    title = title.replace(new RegExp(`(?:(?:Phone|Tel|Mobile|CP|Cell|Contact)\\s*[:\\-]?\\s*)?${rawDigits}`, 'gi'), '').trim();
    company = company.replace(new RegExp(`(?:(?:Phone|Tel|Mobile|CP|Cell|Contact)\\s*[:\\-]?\\s*)?${rawDigits}`, 'gi'), '').trim();
    title = title.replace(/[\s,•–|-]+$/, '').trim();
    company = company.replace(/[\s,•–|-]+$/, '').trim();
  }

  // Clean email string from title or company if it leaked in
  if (email) {
    title = title.replace(new RegExp(`(?:(?:Email|E-mail)\\s*[:\\-]?\\s*)?${email}`, 'gi'), '').trim();
    company = company.replace(new RegExp(`(?:(?:Email|E-mail)\\s*[:\\-]?\\s*)?${email}`, 'gi'), '').trim();
    title = title.replace(/[\s,•–|-]+$/, '').trim();
    company = company.replace(/[\s,•–|-]+$/, '').trim();
  }

  // Clean phone: remove any "Phone :" or "Tel :" prefix
  phone = phone.replace(/^(?:Phone|Tel|Mobile|CP|Cell|Contact)\s*[:\-]?\s*/i, '').trim();

  // Clean email: remove any "Email :" prefix
  email = email.replace(/^(?:Email|E-mail)\s*[:\-]?\s*/i, '').trim();

  // Validate email: if empty or placeholder like "none", "n/a", "no email", omit it
  const lowerEmail = email.toLowerCase();
  if (
    !email ||
    lowerEmail === 'none' ||
    lowerEmail === 'n/a' ||
    lowerEmail === 'null' ||
    lowerEmail === 'undefined' ||
    lowerEmail === 'no email' ||
    !email.includes('@')
  ) {
    email = '';
  }

  // Clean extraContact so it doesn't duplicate extracted phone or email
  if (extraContact) {
    if (phone) {
      extraContact = extraContact.replace(new RegExp(`(?:Phone\\s*[:\\-]?\\s*)?${phone.replace(/[+()\-]/g, '\\$&')}`, 'gi'), '').trim();
    }
    if (email) {
      extraContact = extraContact.replace(new RegExp(`(?:Email\\s*[:\\-]?\\s*)?${email}`, 'gi'), '').trim();
    }
    extraContact = extraContact.replace(/^[|•,\s-]+|[|•,\s-]+$/g, '').trim();
  }

  // Line 4: Phone | Email(optional)
  let contactLine = '';
  if (phone && email) {
    contactLine = `Phone : ${phone} | Email : ${email}`;
  } else if (phone) {
    contactLine = `Phone : ${phone}`;
  } else if (email) {
    contactLine = `Email : ${email}`;
  }

  return {
    name,
    company,
    title,
    phone,
    email,
    contactLine,
    extraContact: extraContact || null,
  };
}
