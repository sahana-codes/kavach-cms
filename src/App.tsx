import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store';
import { ThemeProvider } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router/router';
import theme from './styles/theme';
import SnackbarComponent from './component/common/snackbar';
import Wrapper from './component/common/wrapper';

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
              <Wrapper>
                <AppRouter />
                <SnackbarComponent />
              </Wrapper>
            </BrowserRouter>
          </PersistGate>
        </Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
