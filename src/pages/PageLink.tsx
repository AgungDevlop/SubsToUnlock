import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  FaYoutube, FaTelegram, FaTiktok, FaGlobe,
  FaInstagram, FaFacebook, FaLink, FaLock, FaComment,
  FaThumbsUp, FaUsers, FaEnvelope, FaAngleDoubleRight, FaCheck, FaExclamationTriangle
} from 'react-icons/fa';
import { SEO } from "../components/SEO";

const API_URL = "https://myapi.videyhost.my.id/api.php";
const API_TOKEN = "AgungDeveloper";

const randomLinks = [
  "https://otieu.com/4/10055984",
];

interface AdvanceOption {
  pass?: string;
  note?: string;
  exp?: string;
  thumb?: string;
}

interface PageData {
  title?: string;
  subtitle?: string;
  buttonName?: string;
  sty?: string;
  color?: string;
  targetLinks?: { [key: string]: string };
  "Advance Option"?: AdvanceOption;
  [key: string]: any;
}

interface ApiResponse {
  status: string;
  data: {
    data: PageData;
  };
}

export function PageLink() {
  const { key } = useParams<{ key: string }>();
  const [responseData, setResponseData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [modalError, setModalError] = useState<string | null>(null);
  const [passwordVerified, setPasswordVerified] = useState(false);

  const [activeButtonIndex, setActiveButtonIndex] = useState(0);
  const [buttonStates, setButtonStates] = useState<{ [key: string]: 'idle' | 'loading' | 'completed' }>({});

  useEffect(() => {
    const fetchLinkData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}?key=${key}`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });
        const result = await response.json();
        
        if (!result || !result.data) throw new Error("Invalid Data");

        setResponseData(result);
        
        if (result.data.data?.["Advance Option"]?.pass) {
          setShowModal(true);
        } else {
          setPasswordVerified(true);
        }
      } catch (err: any) {
        setError(err.message || 'Link not found');
      } finally {
        setLoading(false);
      }
    };

    if (key) fetchLinkData();
    else {
      setError('No key provided');
      setLoading(false);
    }
  }, [key]);

  const isExpired = (expDate: string) => {
    const currentDate = new Date();
    const expirationDate = new Date(expDate);
    currentDate.setHours(0, 0, 0, 0);
    expirationDate.setHours(0, 0, 0, 0);
    return currentDate >= expirationDate;
  };

  const verifyPassword = () => {
    const correctPassword = responseData?.data?.data["Advance Option"]?.pass;
    if (passwordInput === correctPassword) {
      setPasswordVerified(true);
      setShowModal(false);
      setPasswordInput('');
      setModalError(null);
    } else {
      setModalError('Incorrect password');
    }
  };

  const handleButtonClick = useCallback((url: string, index: number, isTarget: boolean, buttonKey: string) => {
    setButtonStates(prev => {
      if (prev[buttonKey] === 'completed') return prev;
      return { ...prev, [buttonKey]: 'loading' };
    });

    if (isTarget) {
      sessionStorage.setItem('targetUrl', url);
      window.open('/getlink', '_blank');
      
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * randomLinks.length);
        window.location.href = randomLinks[randomIndex];
      }, 1500);
    } else {
      window.open(url, '_blank');
      
      setTimeout(() => {
        setButtonStates(prev => ({ ...prev, [buttonKey]: 'completed' }));
        setActiveButtonIndex(prev => (index === prev ? prev + 1 : prev));
      }, 4000);
    }
  }, []);

  const platformActionText: { [platform: string]: { [baseAction: string]: string } } = {
    YouTube: { subs: 'Subscribe Channel', like: 'Like Video', comm: 'Comment Video' },
    WhatsApp: { msg: 'Send Message', grp: 'Join Group' },
    Telegram: { chan: 'Join Channel', msg: 'Send Message' },
    TikTok: { flw: 'Follow Account', like: 'Like Video' },
    Website: { visit: 'Visit Website' },
    Instagram: { flw: 'Follow Account', like: 'Like Post' },
    Facebook: { like: 'Like Page', grp: 'Join Group' },
  };

  const platformActionIcon: { [platform: string]: { [baseAction: string]: any } } = {
    YouTube: { subs: FaYoutube, like: FaThumbsUp, comm: FaComment },
    WhatsApp: { msg: FaEnvelope, grp: FaUsers },
    Telegram: { chan: FaTelegram, msg: FaEnvelope },
    TikTok: { flw: FaTiktok, like: FaThumbsUp },
    Website: { visit: FaGlobe },
    Instagram: { flw: FaInstagram, like: FaThumbsUp },
    Facebook: { like: FaFacebook, grp: FaUsers },
  };

  const getButtonText = (platform: string, action: string, buttonName?: string) => {
    if (platform === 'Target') return buttonName || 'Get Link';
    const baseAction = action.replace(/\d+$/, '');
    return platformActionText[platform]?.[baseAction] || `${platform} Action`;
  };

  const getIconForAction = (platform: string, action: string) => {
    const baseAction = action.replace(/\d+$/, '');
    return platformActionIcon[platform]?.[baseAction] || FaLink;
  };

  const getButtonStyles = (
    styleType: string, 
    isActive: boolean, 
    isCompleted: boolean, 
    themeColor: string, 
    isTarget: boolean
  ) => {
    const baseClasses = "w-full flex items-center py-4 px-5 mb-5 relative transition-all duration-200 select-none group";
    let shapeClasses = "";
    let colorStyle: React.CSSProperties = {};
    let iconBgClass = "bg-white/20";

    switch (styleType) {
      case 'style2':
        shapeClasses = "rounded-xl";
        break;
      case 'style3': 
        shapeClasses = "rounded-2xl border border-white/10 backdrop-blur-xl shadow-lg";
        break;
      case 'style4':
        shapeClasses = "rounded-xl border-2 border-slate-900 shadow-[5px_5px_0px_0px_rgba(0,0,0,0.6)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-transform";
        iconBgClass = "bg-black/20";
        break;
      case 'style5':
        shapeClasses = "rounded-xl border-b-[6px] border-black/50 hover:-translate-y-1 active:border-b-0 active:translate-y-[6px] transition-all";
        break;
      default: 
        shapeClasses = "rounded-full shadow-lg";
        break;
    }

    if (isCompleted) {
      colorStyle = { backgroundColor: '#10b981', color: 'white', borderColor: styleType === 'style4' ? '#064e3b' : 'rgba(0,0,0,0.4)' };
    } else if (isActive) {
      if (isTarget) {
        colorStyle = { backgroundColor: '#10b981', color: 'white', borderColor: styleType === 'style4' ? '#064e3b' : 'rgba(0,0,0,0.4)' };
      } else {
        colorStyle = { backgroundColor: themeColor, color: 'white', borderColor: styleType === 'style4' ? '#1e293b' : 'rgba(0,0,0,0.4)' };
      }
    } else {
      shapeClasses += " opacity-60 cursor-not-allowed grayscale";
      colorStyle = { backgroundColor: '#334155', color: '#94a3b8', borderColor: styleType === 'style4' ? '#1e293b' : 'rgba(0,0,0,0.4)' };
    }

    return { 
      className: `${baseClasses} ${shapeClasses}`, 
      style: colorStyle,
      iconBg: iconBgClass
    };
  };

  const data = responseData?.data?.data;

  return (
    <>
      <SEO 
        title={data?.title ? `${data.title} | Subs 4 Unlock` : "Loading... | Subs 4 Unlock"}
        description={data?.subtitle || "Unlock this link by completing simple steps."}
        url={window.location.pathname}
        image={data?.["Advance Option"]?.thumb || undefined}
      />
      
      {loading ? (
        <div className="flex flex-col justify-center items-center h-screen bg-slate-950">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-800 border-t-violet-500 mb-4"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col justify-center items-center h-screen text-center bg-slate-950 p-6">
          <FaExclamationTriangle className="text-4xl text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-slate-200 mb-2">Error</h2>
          <p className="text-slate-500 mb-6 max-w-xs">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-violet-600 text-white rounded-xl font-bold">
            Reload
          </button>
        </div>
      ) : data?.["Advance Option"]?.exp && isExpired(data["Advance Option"].exp) ? (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
            <FaLock className="text-5xl text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-slate-200 mb-2">Link Expired</h1>
        </div>
      ) : (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col items-center p-4 sm:p-6 relative overflow-x-hidden">
          
          <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/5 rounded-full blur-[120px]"></div>
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]"></div>
          </div>

          {data?.["Advance Option"]?.note && (
            <div className="w-full max-w-md mb-6 bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl flex items-start gap-3 relative z-10">
              <FaExclamationTriangle className="text-yellow-500 mt-1 shrink-0" />
              <p className="text-sm text-yellow-200/90">{data["Advance Option"].note}</p>
            </div>
          )}

          <div className="w-full max-w-md mb-8 text-center relative z-10">
            <div 
                className="w-20 h-20 mx-auto rounded-3xl mb-6 flex items-center justify-center text-white text-3xl font-bold shadow-2xl"
                style={{ 
                    background: `linear-gradient(135deg, ${data?.color || '#8b5cf6'}, ${(data?.color || '#8b5cf6')}99)`,
                    boxShadow: `0 20px 40px -10px ${(data?.color || '#8b5cf6')}55`
                }}
            >
                {data?.title ? data.title.charAt(0).toUpperCase() : 'L'}
            </div>
            
            <h1 className="text-2xl font-bold mb-2 text-white">{data?.title || 'Unlock Link'}</h1>
            <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">{data?.subtitle}</p>
          </div>

          {data?.["Advance Option"]?.thumb && (
            <div className="w-full max-w-md mb-8 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 relative z-10">
              <img
                src={data["Advance Option"].thumb === "thumbnail_placeholder" ? "https://via.placeholder.com/600x400/1e293b/94a3b8?text=No+Thumbnail" : data["Advance Option"].thumb}
                alt="Thumbnail"
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {passwordVerified ? (
            <div className="w-full max-w-md relative z-10">
              
              {['YouTube', 'WhatsApp', 'Telegram', 'TikTok', 'Website', 'Instagram', 'Facebook'].flatMap(platform => 
                data?.[platform] ? Object.entries(data[platform]).map(([action, url]) => ({ platform, action, url })) : []
              ).map(({ platform, action, url }, index) => {
                const Icon = getIconForAction(platform, action);
                const isActive = index <= activeButtonIndex;
                const buttonKey = `${platform}-${action}`;
                const state = buttonStates[buttonKey] || 'idle';
                const isCompleted = state === 'completed';
                const activeStyle = data?.sty || 'style1';
                const activeColor = data?.color || '#8b5cf6';

                const { className, style, iconBg } = getButtonStyles(activeStyle, isActive, isCompleted, activeColor, false);

                return (
                  <div
                    key={buttonKey}
                    onClick={() => isActive && state === 'idle' && handleButtonClick(url as string, index, false, buttonKey)}
                    className={`${className} ${isActive && state === 'idle' ? 'cursor-pointer hover:brightness-110' : ''}`}
                    style={style}
                  >
                    <div className={`${iconBg} p-2 rounded-lg mr-4 shrink-0`}>
                        <Icon className="text-lg" />
                    </div>
                    <div className="flex-1 text-sm font-bold truncate pr-2">
                      {getButtonText(platform, action)}
                    </div>
                    
                    <div className="shrink-0">
                      {state === 'loading' ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                      ) : isCompleted ? (
                        <FaCheck className="w-4 h-4 text-white" />
                      ) : (
                        <FaAngleDoubleRight className={`w-4 h-4 ${isActive ? 'text-white/80 animate-pulse' : 'text-white/30'}`} />
                      )}
                    </div>
                  </div>
                );
              })}

              {(data?.targetLinks ? Object.entries(data.targetLinks).map(([key, url]) => ({ platform: 'Target', action: key, url })) : []).map(({ action, url }, index) => {
                const socialButtonsCount = ['YouTube', 'WhatsApp', 'Telegram', 'TikTok', 'Website', 'Instagram', 'Facebook'].reduce((acc, platform) => acc + (data?.[platform] ? Object.keys(data[platform]).length : 0), 0);
                const isActive = activeButtonIndex >= socialButtonsCount;
                const buttonKey = `Target-${action}`;
                const activeStyle = data?.sty || 'style1';
                const activeColor = data?.color || '#8b5cf6';
                const { className, style, iconBg } = getButtonStyles(activeStyle, isActive, false, activeColor, true);

                return (
                  <div
                    key={buttonKey}
                    onClick={() => isActive && handleButtonClick(url as string, index, true, buttonKey)}
                    className={`${className} ${isActive ? 'cursor-pointer hover:brightness-110 mt-6' : 'mt-6'}`}
                    style={style}
                  >
                    <div className={`${iconBg} p-2 rounded-lg mr-4 shrink-0`}>
                        <FaLock className="text-lg" />
                    </div>
                    <div className="flex-1 text-sm font-bold truncate">
                      {getButtonText('Target', action, data?.buttonName)}
                    </div>
                    <div className="shrink-0">
                        <FaLock className={`w-4 h-4 ${isActive ? 'text-white/80' : 'text-white/30'}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          {showModal && (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-xs text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-fuchsia-600"></div>
                
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaLock className="text-2xl text-violet-500" />
                </div>
                
                <h2 className="text-lg font-bold text-white mb-1">Protected Link</h2>
                <p className="text-slate-500 text-xs mb-5">Please enter the password to continue.</p>
                
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 mb-4 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-violet-500 transition-colors text-center placeholder-slate-600"
                  placeholder="Enter Password"
                />
                
                {modalError && (
                    <div className="flex items-center justify-center gap-2 text-red-400 text-xs font-bold mb-4 bg-red-400/10 py-2 rounded-lg">
                        <FaExclamationTriangle /> {modalError}
                    </div>
                )}
                
                <button
                  onClick={verifyPassword}
                  className="w-full px-4 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-violet-600/20"
                >
                  Unlock Content
                </button>
              </div>
            </div>
          )}
          
          <footer className="mt-12 mb-6 text-center opacity-40">
            <p className="text-[10px] text-slate-500">Protected by Subs4Unlock &copy; {new Date().getFullYear()}</p>
          </footer>

        </div>
      )}
    </>
  );
}

export default PageLink;