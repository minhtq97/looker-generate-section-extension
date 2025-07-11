import React, { useState, useCallback, useContext } from 'react';
import { ExtensionContext, ExtensionProvider40 } from '@looker/extension-sdk-react';
import { Button, Box, ComponentsProvider } from '@looker/components';

const App: React.FC = () => {
  const { extensionSDK } = useContext(ExtensionContext);
  const [loading, setLoading] = useState(false);

  const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const generateNewSection = useCallback(async () => {
    setLoading(true);
    
    try {
      const uuid = generateUUID();
      const newUrl = `https://lookerdev.zuelligpharma.com/dashboards/1?section_uuid=${uuid}`;
      
      if (extensionSDK && typeof extensionSDK.openBrowserWindow === 'function') {
        await extensionSDK.openBrowserWindow(newUrl, '_blank');
      } else {
        alert(`Generated URL: ${newUrl}`);
      }
    } catch (error) {
      console.error('Failed to generate section:', error);
      alert('Failed to generate section. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [extensionSDK]);

  return (
    <ExtensionProvider40>
      <ComponentsProvider>
        <Box p="large" display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <Button onClick={generateNewSection} disabled={loading} size="large">
            {loading ? 'Generating...' : 'Generate Section'}
          </Button>
        </Box>
      </ComponentsProvider>
    </ExtensionProvider40>
  );
};

export default App;
