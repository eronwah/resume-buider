import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

export interface GeneratePdfOptions {
  elementId: string;
  filename: string;
  onProgress?: (stage: string) => void;
}

/**
 * Inserts smart white spacers before elements that would otherwise be sliced
 * horizontally across an A4 page boundary (1123px at 96 DPI).
 */
/**
 * Inserts smart white spacers before atomic elements that would otherwise be sliced
 * horizontally across an A4 page boundary (1123px at 96 DPI).
 *
 * CRITICAL RULES:
 * 1. NEVER target large container elements (<section>, article, main, etc.).
 * 2. ONLY target atomic leaf items (.job-entry, .project-entry, .edu-entry, .references-block, li).
 * 3. NEVER target elements taller than 380px as a single block; target child elements (li) instead.
 * 4. If the entire document naturally fits on 1 page (<= 1123px), do NOT add any spacers.
 * 5. Check for orphan section headers (h2/h3) near the page boundary and push them with the content.
 */
function applySmartPageBreaks(container: HTMLElement, pageHeightPx: number): number {
  const containerTop = container.getBoundingClientRect().top;
  const initialTotalHeight = container.getBoundingClientRect().height;

  // If the document fits on 1 page, don't insert any spacers!
  if (initialTotalHeight <= pageHeightPx + 15) {
    return 0;
  }

  const MAX_PAGES = 6;
  let totalSpacersAdded = 0;

  for (let page = 1; page <= MAX_PAGES; page++) {
    const boundaryY = page * pageHeightPx;

    // Check if the document ends before this page boundary
    const currentHeight = container.getBoundingClientRect().height;
    if (currentHeight <= boundaryY + 15) {
      break;
    }

    // Atomic candidates only. EXCLUDE containers (<section>, .document-sheet, etc.)
    const rawCandidates = Array.from(
      container.querySelectorAll(
        '.job-entry, .project-entry, .edu-entry, .references-block, li, .page-break-avoid'
      )
    ) as HTMLElement[];

    // Filter out containers, existing spacers, and overly tall wrapper blocks
    const validCandidates = rawCandidates.filter((el) => {
      if (el.classList.contains('pdf-smart-spacer')) return false;
      const tag = el.tagName.toLowerCase();
      if (tag === 'section' || tag === 'article' || tag === 'main' || tag === 'body') return false;
      if (el.classList.contains('document-sheet')) return false;

      const height = el.getBoundingClientRect().height;
      // If an element is taller than 360px, do not push it as a whole unless it is a single list item
      if (height > 360 && tag !== 'li') {
        return false;
      }
      return true;
    });

    let candidateToBreak: HTMLElement | null = null;

    for (const el of validCandidates) {
      const rect = el.getBoundingClientRect();
      const top = rect.top - containerTop;
      const bottom = top + rect.height;

      // Does this element cross the A4 boundary line?
      if (top < boundaryY && bottom > boundaryY) {
        candidateToBreak = el;
        break;
      }
    }

    if (candidateToBreak) {
      let targetElementToPush = candidateToBreak;

      // Check if candidate is preceded by a section heading (h2 or h3) that would be left orphaned
      const prevSibling = targetElementToPush.previousElementSibling as HTMLElement | null;
      if (
        prevSibling &&
        (prevSibling.tagName.toLowerCase() === 'h2' || prevSibling.tagName.toLowerCase() === 'h3')
      ) {
        const prevRect = prevSibling.getBoundingClientRect();
        const prevTop = prevRect.top - containerTop;
        if (prevTop > boundaryY - 75) {
          targetElementToPush = prevSibling;
        }
      } else {
        // Also check if candidate is the first element in a wrapper whose previous sibling is h2/h3
        const parent = targetElementToPush.parentElement;
        if (parent && targetElementToPush === parent.firstElementChild && parent.previousElementSibling) {
          const parentPrev = parent.previousElementSibling as HTMLElement;
          if (
            parentPrev.tagName.toLowerCase() === 'h2' ||
            parentPrev.tagName.toLowerCase() === 'h3'
          ) {
            const headingRect = parentPrev.getBoundingClientRect();
            const headingTop = headingRect.top - containerTop;
            if (headingTop > boundaryY - 75) {
              targetElementToPush = parentPrev;
            }
          }
        }
      }

      const rect = targetElementToPush.getBoundingClientRect();
      const top = rect.top - containerTop;
      const spacerHeight = boundaryY - top + 18;

      if (spacerHeight > 0 && spacerHeight < pageHeightPx) {
        const spacer = document.createElement('div');
        spacer.className = 'pdf-smart-spacer';
        spacer.style.height = `${spacerHeight}px`;
        spacer.style.width = '100%';
        spacer.style.display = 'block';
        spacer.style.backgroundColor = '#ffffff';
        spacer.style.pointerEvents = 'none';

        targetElementToPush.parentNode?.insertBefore(spacer, targetElementToPush);
        totalSpacersAdded++;
      }
    }
  }

  return totalSpacersAdded;
}

export async function exportElementToPdf({
  elementId,
  filename,
  onProgress,
}: GeneratePdfOptions): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found for PDF export.`);
  }

  onProgress?.('Preparing document for high-res export...');

  // Standard A4 dimensions at 96 DPI: 210mm x 297mm
  const A4_WIDTH_PX = 794;
  const A4_HEIGHT_PX = 1123;

  // Create an off-screen staging wrapper to isolate the element from parent flex/grid/centering
  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.top = '0';
  wrapper.style.left = '-9999px';
  wrapper.style.width = `${A4_WIDTH_PX}px`;
  wrapper.style.margin = '0';
  wrapper.style.padding = '0';
  wrapper.style.backgroundColor = '#ffffff';
  wrapper.style.overflow = 'visible';
  wrapper.style.zIndex = '-9999';

  // Clone node for isolated manipulation
  const clone = element.cloneNode(true) as HTMLElement;
  clone.id = `${elementId}-export-staging`;
  clone.style.margin = '0';
  clone.style.marginLeft = '0';
  clone.style.marginRight = '0';
  clone.style.marginTop = '0';
  clone.style.marginBottom = '0';
  clone.style.width = `${A4_WIDTH_PX}px`;
  clone.style.maxWidth = `${A4_WIDTH_PX}px`;
  clone.style.minWidth = `${A4_WIDTH_PX}px`;
  clone.style.boxShadow = 'none';
  clone.style.transform = 'none';
  clone.style.borderRadius = '0';

  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  try {
    onProgress?.('Calculating clean page breaks...');

    // Small delay to ensure all cloned layout and fonts settle
    await new Promise((resolve) => setTimeout(resolve, 80));

    // Intelligently insert spacers so lines/bullets are never sliced in half
    applySmartPageBreaks(clone, A4_HEIGHT_PX);

    // Re-measure final rendered height after smart page breaks are applied
    await new Promise((resolve) => setTimeout(resolve, 60));
    const measuredHeight = clone.scrollHeight || clone.offsetHeight;

    // Calculate total pages required
    const totalPages = Math.max(1, Math.ceil((measuredHeight - 5) / A4_HEIGHT_PX));
    const canvasHeight = totalPages * A4_HEIGHT_PX;

    onProgress?.('Rendering document at print resolution...');

    const imgData = await toPng(clone, {
      width: A4_WIDTH_PX,
      height: canvasHeight,
      quality: 0.98,
      pixelRatio: 2, // 2x DPI for ultra-crisp vector-like text
      backgroundColor: '#ffffff',
      cacheBust: true,
      style: {
        margin: '0',
        padding: '0',
        transform: 'none',
        left: '0',
        top: '0',
        width: `${A4_WIDTH_PX}px`,
        height: `${canvasHeight}px`,
      },
    });

    onProgress?.('Building multi-page PDF...');

    // A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210 mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297 mm
    const totalPdfHeight = totalPages * pdfHeight;

    for (let page = 0; page < totalPages; page++) {
      if (page > 0) {
        pdf.addPage();
      }
      const positionY = -page * pdfHeight;
      // Because we inserted smart spacers at each page boundary, positionY cuts directly into pure white space!
      pdf.addImage(imgData, 'PNG', 0, positionY, pdfWidth, totalPdfHeight, undefined, 'FAST');
    }

    onProgress?.('Saving PDF file...');
    pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
  } finally {
    if (document.body.contains(wrapper)) {
      document.body.removeChild(wrapper);
    }
  }
}

export function triggerBrowserPrint(): void {
  window.print();
}
