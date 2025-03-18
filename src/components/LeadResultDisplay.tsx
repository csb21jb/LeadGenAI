'use client';

import { useState, useEffect, useRef } from 'react';

interface LeadResultDisplayProps {
  html: string;
  isDarkMode: boolean;
}

/**
 * Component for displaying lead generation results with enhanced UI features
 * like collapsible sections and formatting
 */
export default function LeadResultDisplay({ html, isDarkMode }: LeadResultDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [processedSections, setProcessedSections] = useState(false);
  
  // Clean up HTML before rendering it
  const cleanHtml = (rawHtml: string): string => {
    // Remove markdown code block formatting if present
    let cleaned = rawHtml.replace(/```html|```/g, '');
    
    // Remove any html/HTML tags at the beginning
    cleaned = cleaned.replace(/^<html>|^html\s*|^HTML\s*/g, '');
    
    // Remove any leading/trailing whitespace
    cleaned = cleaned.trim();
    
    // Replace multiple consecutive line breaks with a single one
    cleaned = cleaned.replace(/(\r?\n){2,}/g, '\n');
    
    return cleaned;
  };

  // Process HTML to make sections collapsible and enhance styling
  useEffect(() => {
    if (!containerRef.current || processedSections) return;
    
    const container = containerRef.current;
    
    // Find all h2 headings to make them collapsible
    const headings = container.querySelectorAll('h2');
    
    headings.forEach((heading, index) => {
      // Only process if not already processed
      if (heading.getAttribute('data-processed') !== 'true') {
        heading.setAttribute('data-processed', 'true');
        
        // Add toggle icon if not already present
        if (!heading.querySelector('.toggle-icon')) {
          heading.innerHTML += ' <span class="toggle-icon">▼</span>';
        }
        
        // Find the section content div that follows this heading
        let sectionContent = heading.nextElementSibling;
        
        // If there's no section-content div following, create one
        if (!sectionContent || !sectionContent.classList.contains('section-content')) {
          // Find all content between this h2 and the next h2
          const contentElements: Element[] = [];
          let nextElement = heading.nextElementSibling;
          
          while (nextElement && nextElement.tagName !== 'H2') {
            contentElements.push(nextElement);
            nextElement = nextElement.nextElementSibling;
          }
          
          // Create a wrapper div for the content
          const contentWrapper = document.createElement('div');
          contentWrapper.className = 'section-content';
          
          // Move all content into this wrapper
          contentElements.forEach(el => {
            contentWrapper.appendChild(el.cloneNode(true));
          });
          
          // Remove the original elements
          contentElements.forEach(el => el.remove());
          
          // Insert the wrapper after the heading
          heading.insertAdjacentElement('afterend', contentWrapper);
          
          sectionContent = contentWrapper;
        }
        
        // Style the heading to look clickable
        heading.style.cursor = 'pointer';
        heading.classList.add('section-heading');
        
        // Add click handler to toggle visibility
        heading.addEventListener('click', () => {
          const isVisible = !sectionContent?.classList.contains('hidden');
          if (isVisible) {
            sectionContent?.classList.add('hidden');
            const toggleIcon = heading.querySelector('.toggle-icon');
            if (toggleIcon) toggleIcon.textContent = '►';
          } else {
            sectionContent?.classList.remove('hidden');
            const toggleIcon = heading.querySelector('.toggle-icon');
            if (toggleIcon) toggleIcon.textContent = '▼';
          }
        });
      }
    });
    
    // Make all links open in a new tab and add proper attributes
    const links = container.querySelectorAll('a');
    links.forEach(link => {
      if (!link.getAttribute('target')) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
    
    // Add hover effects to data points and key-value pairs
    const dataPoints = container.querySelectorAll('.data-point, .key-value');
    dataPoints.forEach(point => {
      point.addEventListener('mouseenter', () => {
        point.classList.add('hover');
      });
      point.addEventListener('mouseleave', () => {
        point.classList.remove('hover');
      });
    });
    
    setProcessedSections(true);
  }, [html, processedSections]);

  return (
    <div className={`lead-result-container ${
      isDarkMode ? 'dark' : ''
    } rounded-lg shadow-lg p-6 overflow-x-hidden`}>
      <div 
        ref={containerRef}
        className={`lead-result ${isDarkMode ? 'dark' : ''}`}
        dangerouslySetInnerHTML={{ __html: cleanHtml(html) }}
      />
    </div>
  );
} 