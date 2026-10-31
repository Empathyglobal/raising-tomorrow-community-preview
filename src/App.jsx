import {Toaster} from '@/components/ui/toaster';
import {QueryClientProvider} from '@tanstack/react-query';
import {queryClientInstance} from '@/lib/query-client';
import {pagesConfig} from './pages.config';
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import {AuthProvider} from '@/lib/AuthContext';
const {Pages,Layout,mainPage}=pagesConfig;
const MainPage=Pages[mainPage];
const Wrap=({children,name})=>Layout?<Layout currentPageName={name}>{children}</Layout>:children;
export default function App(){return <AuthProvider><QueryClientProvider client={queryClientInstance}><BrowserRouter>
<aside role="note" style={{background:'#173f35',color:'#fff',padding:'8px 16px',textAlign:'center',fontSize:13}}>Private local preview · No real payments or online accounts · Use fictional characters only</aside>
<Routes><Route path="/" element={<Wrap name={mainPage}><MainPage/></Wrap>}/>{Object.entries(Pages).map(([name,Page])=><Route key={name} path={'/'+name} element={<Wrap name={name}><Page/></Wrap>}/>)}<Route path="*" element={<PageNotFound/>}/></Routes><Toaster/></BrowserRouter></QueryClientProvider></AuthProvider>}
