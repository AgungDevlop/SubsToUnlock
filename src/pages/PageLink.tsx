import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  FaYoutube, FaTelegram, FaTiktok, FaGlobe,
  FaInstagram, FaFacebook, FaLink, FaLock, FaComment,
  FaThumbsUp, FaUsers, FaEnvelope, FaAngleDoubleRight, FaCheck, FaExclamationTriangle
} from 'react-icons/fa';

const API_URL = "https://myapi.ytsubunlock.my.id/api.php";
const API_TOKEN = "AgungDeveloper";

const randomLinks = [
  "https://obqj2.com/4/9277726",
  "https://offensive-beat.com/b.3tV/0pP/3Mp/vabsmOVzJzZcD/0m2fMczqEE0GOoTHc-yNLXT/YrzvMhTfQI5UNpz/Mj",
];

export function PageLink() {
  const { key } = useParams<{ key: string }>();
  const [responseData, setResponseData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [modalError, setModalError] = useState<string | null>(null);
  const [activeButtonIndex, setActiveButtonIndex] = useState(0);
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [buttonStates, setButtonStates] = useState<{ [key: string]: 'idle' | 'loading' | 'completed' }>({});

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://ptichoolsougn.net/401/9372886';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
        setResponseData(result);
        if (result?.data?.data?.["Advance Option"]?.pass) {
          setShowModal(true);
        } else {
          setPasswordVerified(true);
        }
      } catch (error: any) {
        setError(error.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (key) fetchLinkData();
    else {
      setError('No key provided in the URL');
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

  const handleButtonClick = (url: string, index: number, isTarget: boolean, buttonKey: string) => {
    if (isTarget) {
      sessionStorage.setItem('targetUrl', url);
      window.open('/getlink', '_blank');
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * randomLinks.length);
        window.location.href = randomLinks[randomIndex];
      }, 2000);
    } else {
      window.open(url, '_blank');
      setButtonStates(prev => ({ ...prev, [buttonKey]: 'loading' }));
      setTimeout(() => {
        setButtonStates(prev => ({ ...prev, [buttonKey]: 'completed' }));
        if (index === activeButtonIndex) {
          setActiveButtonIndex(index + 1);
        }
      }, 4000);
    }
  };

  const platformActionText: { [platform: string]: { [baseAction: string]: string } } = {
    YouTube: {
      subs: 'Subscribe Channel',
      like: 'Like Video',
      comm: 'Comment Video',
    },
    WhatsApp: {
      msg: 'Send Message',
      grp: 'Join Group',
    },
    Telegram: {
      chan: 'Join Channel',
      msg: 'Send Message',
    },
    TikTok: {
      flw: 'Follow Account',
      like: 'Like Video',
    },
    Website: {
      visit: 'Visit Website',
    },
    Instagram: {
      flw: 'Follow Account',
      like: 'Like Post',
    },
    Facebook: {
      like: 'Like Page',
      grp: 'Join Group',
    },
  };

  const platformActionIcon: { [platform: string]: { [baseAction: string]: any } } = {
    YouTube: {
      subs: FaYoutube,
      like: FaThumbsUp,
      comm: FaComment,
    },
    WhatsApp: {
      msg: FaEnvelope,
      grp: FaUsers,
    },
    Telegram: {
      chan: FaTelegram,
      msg: FaEnvelope,
    },
    TikTok: {
      flw: FaTiktok,
      like: FaThumbsUp,
    },
    Website: {
      visit: FaGlobe,
    },
    Instagram: {
      flw: FaInstagram,
      like: FaThumbsUp,
    },
    Facebook: {
      like: FaFacebook,
      grp: FaUsers,
    },
  };

  const getButtonText = (platform: string, action: string, buttonName?: string) => {
    if (platform === 'Target') {
      return buttonName || 'Get Link';
    }
    const baseAction = action.replace(/\d+$/, '');
    return platformActionText[platform]?.[baseAction] || `${platform} - ${action}`;
  };

  const getIconForAction = (platform: string, action: string) => {
    const baseAction = action.replace(/\d+$/, '');
    return platformActionIcon[platform]?.[baseAction] || FaLink;
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-500"></div>
      <p className="text-white ml-4 text-lg">Loading data...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col justify-center items-center h-screen text-center bg-gray-900">
      <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-red-500 text-lg">{error}</p>
      <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
        Try Again
      </button>
    </div>
  );

  const data = responseData?.data?.data;
  const expired = data?.["Advance Option"]?.exp && isExpired(data["Advance Option"].exp);

  if (expired) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
        <p className="text-red-500 text-lg font-bold">Link Ini Sudah Expired</p>
      </div>
    );
  }

  const socialPlatforms = ['YouTube', 'WhatsApp', 'Telegram', 'TikTok', 'Website', 'Instagram', 'Facebook'];
  const socialButtons = socialPlatforms.flatMap(platform => 
    data?.[platform] ? Object.entries(data[platform]).map(([action, url]) => ({ platform, action, url })) : []
  );
  const targetButtons = data?.targetLinks ? Object.entries(data.targetLinks).map(([key, url]) => ({ platform: 'Target', action: key, url })) : [];
  const thumbnail = data?.["Advance Option"]?.thumb;
  const allSocialActionsCompleted = activeButtonIndex >= socialButtons.length;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
      {data?.["Advance Option"]?.note && (
        <div className="w-full max-w-md mb-4 bg-yellow-500 text-black p-4 rounded-lg shadow-md flex items-center">
          <FaExclamationTriangle className="text-xl mr-3" />
          <p className="text-sm">{data["Advance Option"].note}</p>
        </div>
      )}

      <div className="w-full max-w-md mb-4 bg-gray-800 p-6 rounded-xl shadow-lg border border-purple-700 text-center">
        <h1 className="text-2xl font-bold mb-2">{data?.title || 'Link Page'}</h1>
        <p className="text-base text-gray-300">{data?.subtitle}</p>
      </div>

      {thumbnail && (
        <div className="w-full max-w-md mb-4 bg-gray-800 p-4 rounded-xl shadow-lg border border-purple-700 text-center">
          <h2 className="text-lg font-bold mb-2">Thumbnail</h2>
          <img
            src={thumbnail === "thumbnail_placeholder" ? "https://via.placeholder.com/300x200" : thumbnail}
            alt="Thumbnail"
            className="w-full h-auto rounded-lg"
          />
        </div>
      )}

      {passwordVerified ? (
        <div className="w-full max-w-md space-y-3 bg-gray-800 p-6 rounded-xl shadow-lg border border-purple-700">
          {socialButtons.map(({ platform, action, url }, index) => {
            const Icon = getIconForAction(platform, action);
            const isActive = index <= activeButtonIndex;
            const buttonKey = `${platform}-${action}`;
            const state = buttonStates[buttonKey] || 'idle';
            const buttonColor = state === 'completed' ? 'bg-green-600' : isActive && state === 'idle' ? 'bg-purple-600' : 'bg-gray-600';

            return (
              <div
                key={buttonKey}
                className={`w-full flex items-center ${buttonColor} text-white py-3 px-5 rounded-full shadow-md transform transition-all hover:scale-105 ${isActive && state === 'idle' ? 'hover:bg-purple-700' : ''}`}
                style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)' }}
              >
                <Icon className="mr-3 text-lg" />
                <div className="flex-1 text-center font-bold" style={{ fontFamily: "'Roboto', sans-serif" }}>
                  {getButtonText(platform, action)}
                </div>
                <button
                  onClick={() => handleButtonClick(url as string, index, false, buttonKey)}
                  disabled={!isActive || state !== 'idle'}
                  className="p-2 rounded-full bg-opacity-20 bg-white hover:bg-opacity-30 focus:outline-none active:scale-90 transition-transform duration-100"
                >
                  {state === 'loading' ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                  ) : state === 'completed' ? (
                    <FaCheck className="w-5 h-5 text-white" />
                  ) : (
                    <FaAngleDoubleRight className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  )}
                </button>
              </div>
            );
          })}

          {targetButtons.map(({ action, url }, index) => {
            const isActive = allSocialActionsCompleted;
            const buttonKey = `Target-${action}`;
            const state = buttonStates[buttonKey] || 'idle';
            const buttonColor = state === 'completed' ? 'bg-green-600' : isActive && state === 'idle' ? 'bg-green-600' : 'bg-gray-600';

            return (
              <div
                key={buttonKey}
                className={`w-full flex items-center ${buttonColor} text-white py-3 px-5 rounded-full shadow-md transform transition-all ${isActive && state === 'idle' ? 'hover:bg-green-700' : ''}`}
                style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)' }}
              >
                <FaLink className="mr-3 text-lg" />
                <div className="flex-1 text-center font-bold" style={{ fontFamily: "'Roboto', sans-serif" }}>
                  {getButtonText('Target', action, data?.buttonName)}
                </div>
                <button
                  onClick={() => handleButtonClick(url as string, index, true, buttonKey)}
                  disabled={!isActive || state !== 'idle'}
                  className="p-2 rounded-full bg-opacity-20 bg-white hover:bg-opacity-30 focus:outline-none active:scale-90 transition-transform duration-100"
                >
                  {state === 'loading' ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                  ) : state === 'completed' ? (
                    <FaCheck className="w-5 h-5 text-white" />
                  ) : (
                    <FaAngleDoubleRight className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      ) : null}

      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-md flex items-center justify-center">
          <div className="bg-gray-800 p-4 rounded-lg w-full max-w-xs text-center shadow-lg">
            <FaLock className="text-3xl text-purple-500 mx-auto mb-3" />
            <h2 className="text-lg font-bold mb-3">Enter Password</h2>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full p-2 mb-3 bg-gray-700 border border-purple-600 rounded-lg text-white"
              placeholder="Password"
            />
            {modalError && <p className="text-red-500 mb-3">{modalError}</p>}
            <button
              onClick={verifyPassword}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PageLink;