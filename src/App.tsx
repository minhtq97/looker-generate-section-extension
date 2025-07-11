import React, { useState, useEffect, useCallback, useContext } from 'react';
import { ExtensionContext, ExtensionProvider40 } from '@looker/extension-sdk-react';
import { ComponentsProvider } from '@looker/components';

const App: React.FC = () => {
  const { extensionSDK } = useContext(ExtensionContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasValidUUID, setHasValidUUIDState] = useState(false);

  const getUUIDFromFilters = (): string | null => {
    // Check URL parameters for UUID
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get('section_uuid') || urlParams.get('uuid');
    return uuid;
  };

  const hideUUIDFilters = () => {
    // Function to hide elements containing "UUID" text
    const hideElementsWithText = (text: string) => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
          return node.textContent?.includes(text) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        },
      });

      const textNodes: Text[] = [];
      let node;
      while ((node = walker.nextNode())) {
        textNodes.push(node as Text);
      }

      textNodes.forEach((textNode) => {
        if (textNode.textContent?.includes(text)) {
          // Find the closest parent element that looks like a filter container
          let parent = textNode.parentElement;
          while (parent && parent !== document.body) {
            // Check if this element or its children contain filter-related classes or structure
            if (
              parent.classList.toString().includes('Filter') ||
              parent.classList.toString().includes('Token') ||
              parent.classList.toString().includes('Chip') ||
              parent.querySelector('[role="button"]') ||
              parent.querySelector('[tabindex]')
            ) {
              parent.style.display = 'none';
              break;
            }
            parent = parent.parentElement;
          }
        }
      });
    };

    // Hide elements containing "UUID"
    hideElementsWithText('UUID');

    // Also hide elements containing "is any value" which appears in UUID filters
    hideElementsWithText('is any value');
  };

  useEffect(() => {
    initializeExtension();
  }, []);

  // Effect to hide UUID filters when component mounts and after a short delay
  useEffect(() => {
    // Hide immediately
    hideUUIDFilters();

    // Also hide after a short delay to catch dynamically loaded content
    const timer = setTimeout(() => {
      hideUUIDFilters();
    }, 1000);

    // Set up a mutation observer to hide UUID filters as they appear
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          hideUUIDFilters();
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  // Update UUID validity when URL changes
  useEffect(() => {
    const uuid = getUUIDFromFilters();
    const isValid = uuid !== null;
    console.log('UUID check:', { uuid, hasValid: isValid });
    setHasValidUUIDState(isValid);
  }, []);

  const initializeExtension = async () => {
    try {
      setLoading(true);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const generateDashboardURLWithFiltersAndUUID = (
    dashboardId: string,
    filters: Record<string, any>,
    uuid: string,
  ): string => {
    const baseUrl = window.location.origin;
    const filterParams = Object.entries(filters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    const url = `${baseUrl}/dashboards/${dashboardId}?section_uuid=${uuid}`;
    return filterParams ? `${url}&${filterParams}` : url;
  };

  /**
   * Generate new section with UUID
   */
  const generateNewSection = useCallback(async () => {
    const uuid = generateUUID();

    // Get current URL parameters as filters
    const urlParams = new URLSearchParams(window.location.search);
    const dashboardId = urlParams.get('dashboard_id') || '1'; // Default dashboard ID

    const filters: Record<string, any> = {};
    urlParams.forEach((value, key) => {
      if (key !== 'section_uuid' && key !== 'uuid' && value && value !== '' && value !== '-NULL') {
        filters[key] = value;
      }
    });

    const newUrl = generateDashboardURLWithFiltersAndUUID(dashboardId, filters, uuid);
    console.log('Generated new section URL:', newUrl);

    // Try to open URL using extensionSDK.openBrowserWindow
    try {
      if (extensionSDK && typeof extensionSDK.openBrowserWindow === 'function') {
        await extensionSDK.openBrowserWindow(newUrl, '_blank');
      } else {
        throw new Error('openBrowserWindow not available');
      }
    } catch (error) {
      console.error('Failed to open browser window:', error);
      // Fallback: copy URL to clipboard
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(newUrl);
          alert('URL copied to clipboard! Please paste it in a new tab.');
        } else {
          alert(`Please navigate to:\n\n${newUrl}\n\nCopy this URL and open it in a new tab.`);
        }
      } catch {
        alert(`Please navigate to:\n\n${newUrl}\n\nCopy this URL and open it in a new tab.`);
      }
    }
  }, [extensionSDK]);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ color: 'red' }}>{error}</div>
      </div>
    );
  }

  // Hide the entire extension container if UUID has a value
  if (hasValidUUID) {
    return null;
  }

  return (
    <ExtensionProvider40>
      <ComponentsProvider>
        <div
          style={{
            padding: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <button
            style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'background-color 0.2s ease',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
            onClick={generateNewSection}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#5a6fd8';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#667eea';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            }}
          >
            Generate Section
          </button>
        </div>
      </ComponentsProvider>
    </ExtensionProvider40>
  );
};

export default App;
