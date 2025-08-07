import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ColorContextProvider } from './context/ColorContext';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { FullscreenProvider } from './context/FullscreenContext';
import { ColorEditProvider } from './context/ColorEditContext';
import { DarkModeProvider } from './context/DarkModeContext';
import { EntryProvider } from './context/EntryContext';
import { Toaster } from 'react-hot-toast';

import ProtectedRoute from './ui/ProtectedRoute';
import AuthorCreator from './pages/AuthorCreator';
import PageNotFound from './pages/PageNotFound';
import UpdateAuthor from './pages/UpdateAuthor';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Features from './pages/Features';
import Archive from './pages/Archive';
import NewPost from './pages/NewPost';
import Authors from './pages/Authors';
import Article from './pages/Article';
import Layout from './ui/Layout';
import Login from './pages/Login';
import Edit from './pages/Edit';
import Tags from './pages/Tags';

const queryClient = new QueryClient({
   defaultOptions: {
      staleTime: 60 * 1000,
   },
});

// TODO: Make archive row images wider
// TODO: Fix article loader

// TODO: Admin permissions
// TODO: Show comments in articles
// TODO: Comment and users table
// TODO: Footnotes
// TODO: I18n

function App() {
   return (
      <QueryClientProvider client={queryClient}>
         <ReactQueryDevtools initialIsOpen={false} />

         <DarkModeProvider>
            <ColorContextProvider>
               <ColorEditProvider>
                  <FullscreenProvider>
                     <EntryProvider>
                        <BrowserRouter>
                           <Routes>
                              <Route
                                 element={
                                    <ProtectedRoute>
                                       <Layout />
                                    </ProtectedRoute>
                                 }
                              >
                                 <Route
                                    index
                                    element={
                                       <Navigate replace to="dashboard" />
                                    }
                                 />
                                 <Route
                                    path="dashboard"
                                    element={<Dashboard />}
                                 />
                                 <Route path="new-post" element={<NewPost />} />
                                 <Route path="archive" element={<Archive />} />
                                 <Route
                                    path="archive/:id"
                                    element={<Article />}
                                 />
                                 <Route
                                    path="archive/edit/:id"
                                    element={<Edit />}
                                 />
                                 <Route
                                    path="features"
                                    element={<Features />}
                                 />
                                 <Route path="tags" element={<Tags />} />
                                 <Route path="authors" element={<Authors />} />
                                 <Route
                                    path="authors/:id"
                                    element={<UpdateAuthor />}
                                 />
                                 <Route
                                    path="authors/author-creator"
                                    element={<AuthorCreator />}
                                 />
                                 <Route
                                    path="settings"
                                    element={<Settings />}
                                 />
                              </Route>

                              <Route path="login" element={<Login />} />
                              <Route path="*" element={<PageNotFound />} />
                           </Routes>
                        </BrowserRouter>

                        <Toaster
                           position="top-center"
                           gutter={12}
                           containerStyle={{ margin: '-4px' }}
                           toastOptions={{
                              success: {
                                 duration: 4000,
                              },
                              error: {
                                 duration: 6000,
                              },
                              style: {
                                 fontSize: '16px',
                                 maxWidth: '500px',
                                 color: 'var(--color-text)',
                                 backgroundColor: 'var(--color-toast)',
                                 borderRadius: '14px',
                                 boxShadow: 'var(--shadow-toast-btn)',
                              },
                              iconTheme: {
                                 primary: 'var(--color-accent-400)',
                              },
                           }}
                        />
                     </EntryProvider>
                  </FullscreenProvider>
               </ColorEditProvider>
            </ColorContextProvider>
         </DarkModeProvider>
      </QueryClientProvider>
   );
}

export default App;
