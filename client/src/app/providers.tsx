import React from 'react';
import { AuthProvider, OfflineProvider, LanguageProvider, ThemeProvider, WeatherProvider, DataSaverProvider, PWAProvider } from '../context/index.js';
import { SharedFieldProvider } from '../modules/build-ai/context/SharedFieldContext.js';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <DataSaverProvider>
        <AuthProvider>
          <OfflineProvider>
            <LanguageProvider>
              <WeatherProvider>
                <PWAProvider>
                  <SharedFieldProvider>
                    {children}
                  </SharedFieldProvider>
                </PWAProvider>
              </WeatherProvider>
            </LanguageProvider>
          </OfflineProvider>
        </AuthProvider>
      </DataSaverProvider>
    </ThemeProvider>
  );
};
