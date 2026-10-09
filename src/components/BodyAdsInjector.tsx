import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

/**
 * BodyAdsInjector
 * Injects Popunder and Social Bar ad codes right above the </body> tag.
 * Popunder code is placed first (right above </body>),
 * and Social Bar code is placed right below Popunder code (and above </body>).
 *
 * Ensures all <script> tags are dynamically recreated and executed so ad networks
 * (Adsterra, Monetag, PropellerAds, HilltopAds, ExoClick, etc.) load correctly.
 */
export const BodyAdsInjector: React.FC = () => {
  const { adSettings } = useApp();

  useEffect(() => {
    // 1. Ensure popunder container exists right at end of document.body (above </body>)
    let popunderContainer = document.getElementById('mmshub-popunder-ad-container') as HTMLDivElement | null;
    if (!popunderContainer) {
      popunderContainer = document.createElement('div');
      popunderContainer.id = 'mmshub-popunder-ad-container';
      popunderContainer.setAttribute('data-purpose', 'popunder-ads-above-closing-body-tag');
      document.body.appendChild(popunderContainer);
    }

    // 2. Ensure social bar container exists right below popunder container (above </body>)
    let socialBarContainer = document.getElementById('mmshub-socialbar-ad-container') as HTMLDivElement | null;
    if (!socialBarContainer) {
      socialBarContainer = document.createElement('div');
      socialBarContainer.id = 'mmshub-socialbar-ad-container';
      socialBarContainer.setAttribute('data-purpose', 'social-bar-ads-below-popunder-above-closing-body-tag');
      document.body.appendChild(socialBarContainer);
    }

    // Helper to execute scripts safely
    const injectAndRunCode = (container: HTMLElement, code: string | undefined, isEnabled: boolean) => {
      container.innerHTML = '';
      if (!isEnabled || !code || !code.trim()) {
        return;
      }

      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(code, 'text/html');

        Array.from(doc.body.childNodes).forEach((node) => {
          if (node.nodeName.toLowerCase() === 'script') {
            const scriptNode = node as HTMLScriptElement;
            const newScript = document.createElement('script');
            Array.from(scriptNode.attributes).forEach((attr) => {
              newScript.setAttribute(attr.name, attr.value);
            });
            if (scriptNode.textContent) {
              newScript.textContent = scriptNode.textContent;
            }
            container.appendChild(newScript);
          } else {
            const importedNode = document.importNode(node, true);
            if ((importedNode as HTMLElement).querySelectorAll) {
              const nestedScripts = (importedNode as HTMLElement).querySelectorAll('script');
              nestedScripts.forEach((oldScript) => {
                const newScript = document.createElement('script');
                Array.from(oldScript.attributes).forEach((attr) => {
                  newScript.setAttribute(attr.name, attr.value);
                });
                newScript.textContent = oldScript.textContent;
                oldScript.parentNode?.replaceChild(newScript, oldScript);
              });
            }
            container.appendChild(importedNode);
          }
        });
      } catch (err) {
        console.error('Error executing ad script in container:', err);
      }
    };

    // Inject Popunder Code (first)
    const isPopunderEnabled = adSettings.popunderEnabled !== false;
    injectAndRunCode(popunderContainer, adSettings.popunderCode, isPopunderEnabled);

    // Inject Social Bar Code (below popunder)
    const isSocialBarEnabled = adSettings.socialBarEnabled !== false;
    injectAndRunCode(socialBarContainer, adSettings.socialBarCode, isSocialBarEnabled);

    return () => {
      // Keep containers clean if unmounted
      if (popunderContainer) popunderContainer.innerHTML = '';
      if (socialBarContainer) socialBarContainer.innerHTML = '';
    };
  }, [
    adSettings.popunderCode,
    adSettings.popunderEnabled,
    adSettings.socialBarCode,
    adSettings.socialBarEnabled,
  ]);

  return null;
};
