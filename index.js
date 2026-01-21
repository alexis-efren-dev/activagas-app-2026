/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {PaperProvider} from 'react-native-paper';
import {HCESessionProvider} from 'react-native-hce';
import {Provider} from 'react-redux';
import {QueryClientProvider, QueryClient} from '@tanstack/react-query';
import {name as appName} from './app.json';
import Store from './src/redux/store';
import {BannerUpdate} from './src/Components/BannerUpdate/BannerUpdate';

import {decode, encode} from 'base-64';
//import {vexo} from 'vexo-analytics';
//vexo('3be1949c-6301-4416-b55f-141305677087');
if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}
export default function Main() {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        staleTime: 10000,
        cacheTime: 12000,
        enabled: false,
        retry: false,
      },
    },
  });
  return (
    <QueryClientProvider client={client}>
      <PaperProvider>
        <Provider store={Store}>
          <BannerUpdate />

          <HCESessionProvider>
            <App />
          </HCESessionProvider>
        </Provider>
      </PaperProvider>
    </QueryClientProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
