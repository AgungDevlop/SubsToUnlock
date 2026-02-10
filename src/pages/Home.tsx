import { useState, useEffect, useCallback, useMemo, memo } from "react";
import {
  FaHeading, FaSubscript, FaTimes, FaYoutube, FaThumbsUp, FaComment,
  FaWhatsapp, FaUsers, FaEnvelope, FaTelegram, FaTiktok, FaGlobe,
  FaInstagram, FaFacebook, FaLink, FaLock,
  FaStickyNote, FaCalendarAlt, FaImage, FaArrowRight, FaCopy, 
  FaCheckCircle, FaExclamationTriangle, FaTrash, FaEye, FaSave,
  FaPalette, FaShapes
} from "react-icons/fa";
import { IconType } from "react-icons";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = "https://myapi.videyhost.my.id/api.php";
const API_TOKEN = "AgungDeveloper";
const GITHUB_TOKEN_URL = "https://myapi.videyhost.my.id/ghtoken.json";
const STORAGE_KEY = "subs4unlock_form_state_final";

const isValidUrl = (url: string): boolean => {
  if (!url) return false;
  const urlPattern = /^(https?:\/\/)((?:[\w-]+\.)*[\w-]+\.[a-zA-Z]{2,})(\/[\w@\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;
  return urlPattern.test(url);
};

const getFriendlyActionName = (platform: string, key: string): string => {
  if (platform === "Target Link") return "Unlock Destination";
  
  const map: Record<string, string> = {
    subs: "Subscribe Channel",
    like: "Like Video",
    comm: "Comment Video",
    msg: "Send Message",
    grp: "Join Group",
    chan: "Join Channel",
    flw: "Follow Account",
    visit: "Visit Website",
    pass: "Password Protected",
    note: "Read Note"
  };

  const prefix = key.replace(/[0-9]/g, '');
  
  if (map[prefix]) {
    if (prefix === 'pass' || prefix === 'note') return map[prefix];
    return `${map[prefix]} ${platform}`;
  }
  
  return `${platform} Action`;
};

const getActionIcon = (platform: string, key: string): IconType => {
  const prefix = key.replace(/[0-9]/g, '');
  if (prefix === 'subs') return FaYoutube;
  if (prefix === 'like') return FaThumbsUp;
  if (prefix === 'comm') return FaComment;
  if (prefix === 'msg') return FaEnvelope;
  if (prefix === 'grp' || prefix === 'chan') return FaUsers;
  if (prefix === 'flw' && platform === 'TikTok') return FaTiktok;
  if (prefix === 'flw' && platform === 'Instagram') return FaInstagram;
  if (prefix === 'visit') return FaGlobe;
  if (prefix === 'pass') return FaLock;
  if (prefix === 'note') return FaStickyNote;
  return FaLink;
};

interface FormData {
  title?: string;
  subtitle?: string;
  buttonName?: string;
  sty?: string;
  color?: string;
  targetLinks: { [key: string]: string };
  [key: string]: any;
}

interface SavedState {
  formData: FormData;
  activePlatforms: string[];
}

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode }> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-slate-900 border border-slate-700/50 p-6 rounded-3xl shadow-2xl max-w-sm w-full relative overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600"></div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-3 px-4 rounded-xl transition-all duration-200 font-bold border border-slate-700/50"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
};

interface AnimatedInputProps {
  icon: IconType;
  label?: string;
  placeholder: string;
  onRemove?: () => void;
  type?: string;
  accept?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  value?: string;
  error?: string;
  inputId?: string;
}

const AnimatedInput = memo(({
  icon: Icon,
  label,
  placeholder,
  onRemove,
  type = "text",
  accept,
  onChange,
  disabled,
  value,
  error,
  inputId,
}: AnimatedInputProps) => (
  <div className="relative mb-5 group/input">
    {label && <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest ml-1">{label}</label>}
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-violet-400 transition-colors duration-300">
        <Icon />
      </div>
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        accept={accept}
        onChange={onChange}
        disabled={disabled}
        value={value}
        className={`w-full pl-12 pr-10 py-3.5 bg-slate-950/50 text-slate-200 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 placeholder-slate-600 disabled:opacity-50 transition-all duration-300 text-sm font-medium ${
          error ? "border-red-500/50 focus:border-red-500" : "border-slate-800 focus:border-violet-500/50"
        }`}
      />
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-red-400 p-1.5 rounded-full hover:bg-red-400/10 transition-colors"
        >
          <FaTimes size={12} />
        </button>
      )}
    </div>
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="text-red-400 text-[10px] font-semibold mt-1.5 ml-1 flex items-center gap-1.5"
        >
          <FaExclamationTriangle size={10} /> {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
));

const stylesConfig = [
    { id: 'style1', name: 'Rounded' },
    { id: 'style2', name: 'Box' },
    { id: 'style3', name: 'Glass' },
    { id: 'style4', name: 'Neo' },
    { id: 'style5', name: '3D' },
];

const colorsConfig = [
    '#8b5cf6', '#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#ec4899', '#6366f1'
];

interface PlatformInputsProps {
  platform: string;
  data: any;
  onInputChange: (platform: string, key: string, value: string) => void;
  onTopLevelInputChange: (key: string, value: string) => void;
  uploadImage: (platform: string, key: string, file: File) => Promise<void>;
  errors: { [key: string]: string };
  onRemovePlatform: () => void;
  formData: FormData;
}

const PlatformInputs = memo(({ 
  platform, data, onInputChange, onTopLevelInputChange, uploadImage, errors, onRemovePlatform, formData
}: PlatformInputsProps) => {
  
  const platformConfigs: any = useMemo(() => ({
    YouTube: {
      options: ["+ Subscribe", "+ Like", "+ Comment"],
      inputs: {
        Subscribe: { icon: FaYoutube, placeholder: (i: number) => `YouTube Channel URL ${i + 1}`, key: (i: number) => `subs${i + 1}` },
        Like: { icon: FaThumbsUp, placeholder: (i: number) => `YouTube Video URL ${i + 1}`, key: (i: number) => `like${i + 1}` },
        Comment: { icon: FaComment, placeholder: (i: number) => `YouTube Video URL ${i + 1}`, key: (i: number) => `comm${i + 1}` },
      },
    },
    WhatsApp: {
      options: ["+ Message", "+ Group Invite"],
      inputs: {
        Message: { icon: FaEnvelope, placeholder: (i: number) => `WhatsApp Link (wa.me/...) ${i + 1}`, key: (i: number) => `msg${i + 1}` },
        "Group Invite": { icon: FaUsers, placeholder: (i: number) => `Group Link ${i + 1}`, key: (i: number) => `grp${i + 1}` },
      },
    },
    Telegram: {
      options: ["+ Join Channel", "+ Message"],
      inputs: {
        "Join Channel": { icon: FaUsers, placeholder: (i: number) => `Telegram Channel URL ${i + 1}`, key: (i: number) => `chan${i + 1}` },
        Message: { icon: FaEnvelope, placeholder: (i: number) => `Username (@user) ${i + 1}`, key: (i: number) => `msg${i + 1}` },
      },
    },
    TikTok: {
      options: ["+ Follow", "+ Like Video"],
      inputs: {
        Follow: { icon: FaTiktok, placeholder: (i: number) => `TikTok Username ${i + 1}`, key: (i: number) => `flw${i + 1}` },
        "Like Video": { icon: FaThumbsUp, placeholder: (i: number) => `Video URL ${i + 1}`, key: (i: number) => `like${i + 1}` },
      },
    },
    Website: {
      options: ["+ Visit"],
      inputs: {
        Visit: { icon: FaGlobe, placeholder: (i: number) => `Website URL ${i + 1}`, key: (i: number) => `visit${i + 1}` },
      },
    },
    Instagram: {
      options: ["+ Follow", "+ Like Post"],
      inputs: {
        Follow: { icon: FaInstagram, placeholder: (i: number) => `Instagram Username ${i + 1}`, key: (i: number) => `flw${i + 1}` },
        "Like Post": { icon: FaThumbsUp, placeholder: (i: number) => `Post URL ${i + 1}`, key: (i: number) => `like${i + 1}` },
      },
    },
    Facebook: {
      options: ["+ Like Page", "+ Join Group"],
      inputs: {
        "Like Page": { icon: FaThumbsUp, placeholder: (i: number) => `Page URL ${i + 1}`, key: (i: number) => `like${i + 1}` },
        "Join Group": { icon: FaUsers, placeholder: (i: number) => `Group URL ${i + 1}`, key: (i: number) => `grp${i + 1}` },
      },
    },
    "Target Link": {
      options: ["+ Link"],
      inputs: {
        Link: { icon: FaLink, placeholder: (i: number) => `Extra Target Link ${i + 2}`, key: (i: number) => `tlink${i + 2}` },
      },
    },
    "Advance Option": {
      options: ["Password", "Note", "Expired", "Thumbnails", "Button Style", "Theme Color"],
      inputs: {
        Password: { icon: FaLock, placeholder: () => "Set Password", key: () => "pass", type: 'text' },
        Note: { icon: FaStickyNote, placeholder: () => "Add User Note", key: () => "note", type: 'text' },
        Expired: { icon: FaCalendarAlt, placeholder: () => "Expiration Date", key: () => "exp", type: "date" },
        Thumbnails: { icon: FaImage, placeholder: () => "Upload Thumbnail", key: () => "thumb", type: "file", accept: "image/*" },
        "Button Style": { icon: FaShapes, type: 'style', key: () => 'sty' },
        "Theme Color": { icon: FaPalette, type: 'color', key: () => 'color' }
      },
    },
  }), []);

  const config = platformConfigs[platform] || { options: [], inputs: {} };
  const [inputCounts, setInputCounts] = useState<{ [key: string]: number }>({});

  const getInitialCount = useCallback((keyFunc: (i: number) => string) => {
    let count = 0;
    for (let i = 0; i < 5; i++) {
      if (data?.[keyFunc(i)]) count = i + 1;
    }
    return count;
  }, [data]);

  useEffect(() => {
    const newCounts: { [key: string]: number } = {};
    if (platform === "Advance Option") {
      Object.keys(config.inputs).forEach(opt => {
         const optionKey = opt.replace("+ ", "").trim();
         const key = config.inputs[optionKey].key();
         if (key === 'sty' || key === 'color') {
             if (formData[key]) newCounts[optionKey] = 1;
         } else if (data?.[key]) {
             newCounts[optionKey] = 1;
         }
      });
    } else {
      Object.keys(config.inputs).forEach(opt => {
        const optionKey = opt.replace("+ ", "").trim();
        const count = getInitialCount(config.inputs[optionKey].key);
        if (count > 0) newCounts[optionKey] = count;
      });
    }

    setInputCounts(prev => {
        const isDifferent = Object.keys(newCounts).some(k => newCounts[k] !== prev[k]) || 
                            Object.keys(prev).length !== Object.keys(newCounts).length;
        return isDifferent ? newCounts : prev;
    });

  }, [platform, data, config.inputs, getInitialCount, formData]); 

  const addOption = useCallback((option: string) => {
    const optionKey = option.replace("+ ", "").trim();
    if (platform !== "Advance Option") {
      setInputCounts((prev) => {
          const currentCount = prev[optionKey] || 0;
          if (currentCount >= 5) return prev;
          return { ...prev, [optionKey]: currentCount + 1 };
      });
    } else {
      setInputCounts((prev) => {
          if (prev[optionKey]) return prev;
          return { ...prev, [optionKey]: 1 };
      });
    }
  }, [platform]);

  const removeOption = useCallback((option: string, index: number) => {
    const optionKey = option.replace("+ ", "").trim();
    setInputCounts((prev) => ({ ...prev, [optionKey]: (prev[optionKey] || 1) - 1 }));
    const key = config.inputs[optionKey].key(index);
    if(config.inputs[optionKey].type === 'style' || config.inputs[optionKey].type === 'color') {
        onTopLevelInputChange(key, key === 'sty' ? 'style1' : '#8b5cf6');
    } else {
        onInputChange(platform, key, "");
    }
  }, [config.inputs, onInputChange, platform, onTopLevelInputChange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="bg-slate-800/30 backdrop-blur-md rounded-2xl p-5 border border-slate-700/50 mb-4 shadow-lg overflow-hidden relative"
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex justify-between items-center mb-5 border-b border-slate-700/30 pb-3">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2.5">
          {platform === 'YouTube' && <FaYoutube className="text-red-500"/>}
          {platform === 'WhatsApp' && <FaWhatsapp className="text-green-500"/>}
          {platform === 'Telegram' && <FaTelegram className="text-sky-500"/>}
          {platform === 'TikTok' && <FaTiktok className="text-white"/>}
          {platform === 'Website' && <FaGlobe className="text-blue-500"/>}
          {platform === 'Instagram' && <FaInstagram className="text-pink-500"/>}
          {platform === 'Facebook' && <FaFacebook className="text-blue-600"/>}
          {platform === 'Target Link' && <FaLink className="text-slate-400"/>}
          {platform === 'Advance Option' && <FaLock className="text-yellow-500"/>}
          {platform}
        </h3>
        <button onClick={onRemovePlatform} className="text-slate-500 hover:text-red-400 text-xs font-semibold px-2 py-1 rounded hover:bg-red-400/10 transition-colors">
          Remove
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {config.options.map((opt: string) => (
          <button
            key={opt}
            onClick={() => addOption(opt)}
            className="text-[10px] sm:text-xs font-semibold bg-slate-700/50 hover:bg-violet-600 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-all duration-200 border border-slate-600/50 hover:border-violet-500/50 shadow-sm"
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {Object.keys(inputCounts).map((option) => {
          const count = inputCounts[option] || 0;
          return Array.from({ length: count }).map((_, i) => {
            const inputConfig = config.inputs[option];
            const key = inputConfig.key(i);
            
            if (inputConfig.type === 'style') {
              return (
                <div key="style-selector" className="mb-2">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <FaShapes /> Button Style
                    </label>
                    <button onClick={() => removeOption(option, i)} className="text-slate-600 hover:text-red-400 p-1 rounded-full hover:bg-red-400/10 transition-colors"><FaTimes size={10} /></button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {stylesConfig.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => onTopLevelInputChange('sty', s.id)}
                        className={`py-3 px-2 text-xs font-bold border transition-all ${
                          formData.sty === s.id
                            ? 'bg-slate-700 border-violet-500 text-white shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                            : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-700'
                        } rounded-xl`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              );
            }

            if (inputConfig.type === 'color') {
              return (
                <div key="color-selector" className="mb-2">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <FaPalette /> Theme Color
                    </label>
                    <button onClick={() => removeOption(option, i)} className="text-slate-600 hover:text-red-400 p-1 rounded-full hover:bg-red-400/10 transition-colors"><FaTimes size={10} /></button>
                  </div>
                  <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-700/50 flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.color || "#8b5cf6"}
                      onChange={(e) => onTopLevelInputChange('color', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                    />
                    <div className="flex-1 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                      {colorsConfig.map((c) => (
                        <button
                          key={c}
                          onClick={() => onTopLevelInputChange('color', c)}
                          className={`w-8 h-8 rounded-full border-2 flex-shrink-0 transition-transform hover:scale-110 ${formData.color === c ? 'border-white scale-110' : 'border-transparent'}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            
            return (
              <AnimatedInput
                key={`${option}-${i}`}
                icon={inputConfig.icon}
                placeholder={inputConfig.placeholder(i)}
                type={inputConfig.type || "text"}
                accept={inputConfig.accept}
                value={inputConfig.type !== 'file' ? (data?.[key] || "") : undefined} 
                onChange={(e) => {
                  if (inputConfig.key(0) === "thumb" && e.target.files) {
                    uploadImage(platform, inputConfig.key(0), e.target.files[0]);
                  } else {
                    onInputChange(platform, key, e.target.value);
                  }
                }}
                onRemove={platform !== "Advance Option" || !['style', 'color', 'file'].includes(inputConfig.type) ? () => removeOption(option, i) : undefined}
                error={errors[key]}
              />
            );
          });
        })}
        {Object.keys(inputCounts).length === 0 && (
          <div className="text-center py-6 border-2 border-dashed border-slate-700/50 rounded-xl">
             <p className="text-slate-500 text-xs">Select an option above to add inputs</p>
          </div>
        )}
      </div>
    </motion.div>
  );
});

const Home: React.FC = () => {
  const [activePlatforms, setActivePlatforms] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({ 
    targetLinks: {},
    sty: "style1",
    color: "#8b5cf6" 
  });
  const [errors, setErrors] = useState<{ [key: string]: { [key: string]: string } }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedKey, setGeneratedKey] = useState<string>("");
  const [modalState, setModalState] = useState<{ isOpen: boolean; type: "loading" | "success" | "error" | ""; message: string }>({ isOpen: false, type: "", message: "" });
  const [previewModalOpen, setPreviewModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: SavedState = JSON.parse(saved);
        setFormData({
            ...parsed.formData,
            sty: parsed.formData.sty || "style1",
            color: parsed.formData.color || "#8b5cf6"
        });
        setActivePlatforms(parsed.activePlatforms || []);
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }
  }, []);

  useEffect(() => {
    const stateToSave: SavedState = { formData, activePlatforms };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [formData, activePlatforms]);

  const clearForm = () => {
    if (window.confirm("Are you sure you want to reset the form? All data will be lost.")) {
      setFormData({ targetLinks: {}, sty: "style1", color: "#8b5cf6" });
      setActivePlatforms([]);
      setErrors({});
      setGeneratedKey("");
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const socialButtons = [
    { text: "YouTube", icon: FaYoutube },
    { text: "WhatsApp", icon: FaWhatsapp },
    { text: "Telegram", icon: FaTelegram },
    { text: "TikTok", icon: FaTiktok },
    { text: "Website", icon: FaGlobe },
    { text: "Instagram", icon: FaInstagram },
    { text: "Facebook", icon: FaFacebook },
    { text: "Target Link", icon: FaLink },
    { text: "Advance Option", icon: FaLock },
  ];

  const handleInputChange = useCallback((platform: string, key: string, value: string) => {
    setFormData((prev) => {
      if (platform === "Target Link") {
        return { ...prev, targetLinks: { ...prev.targetLinks, [key]: value } };
      }
      return { ...prev, [platform]: { ...(prev[platform] || {}), [key]: value } };
    });
    
    let errorMsg: string | null = null;
    if (value && ['subs','like','comm','msg','grp','chan','visit','tlink'].some(k => key.includes(k))) {
       if(!isValidUrl(value)) errorMsg = "Invalid URL";
    }
    
    setErrors((prev) => ({
      ...prev,
      [platform]: { ...(prev[platform] || {}), [key]: errorMsg || "" },
    }));
  }, []);

  const handleTopLevelInputChange = useCallback((key: string, value: string) => {
    setFormData((prev) => {
      if (key === "tlink1") {
        const error = value && !isValidUrl(value) ? "Invalid URL" : "";
        setErrors((prevErr) => ({ ...prevErr, targetLinks: { ...prevErr.targetLinks, [key]: error } }));
        return { ...prev, targetLinks: { ...prev.targetLinks, [key]: value } };
      }
      return { ...prev, [key]: value };
    });
  }, []);

  const uploadImageToGitHub = async (platform: string, key: string, file: File) => {
    setModalState({ isOpen: true, type: "loading", message: "Uploading thumbnail..." });
    try {
      const tokenResp = await fetch(GITHUB_TOKEN_URL);
      const { githubToken } = await tokenResp.json();
      
      const reader = new FileReader();
      const base64Content = await new Promise<string>((resolve) => {
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.readAsDataURL(file);
      });

      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
      const filePath = `img/${fileName}`;
      
      const response = await fetch(`https://api.github.com/repos/AgungDevlop/InjectorMl/contents/${filePath}`, {
        method: "PUT",
        headers: { Authorization: `token ${githubToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ message: `Upload ${fileName}`, content: base64Content }),
      });

      if (!response.ok) throw new Error("GitHub Upload Failed");

      const rawUrl = `https://raw.githubusercontent.com/AgungDevlop/InjectorMl/main/${filePath}`;
      handleInputChange(platform, key, rawUrl);
      setModalState({ isOpen: true, type: "success", message: "Uploaded!" });
      setTimeout(() => setModalState({ isOpen: false, type: "", message: "" }), 1000);
    } catch (error) {
      setModalState({ isOpen: true, type: "error", message: "Upload failed." });
    }
  };

  const generateLink = async () => {
    if (!formData.targetLinks?.tlink1 || !isValidUrl(formData.targetLinks.tlink1)) {
      setModalState({ isOpen: true, type: "error", message: "Main Destination Link is missing or invalid!" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${API_TOKEN}` },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Generation Failed");

      setGeneratedKey(result.key);
      setModalState({ isOpen: true, type: "success", message: "Link Generated!" });
      setTimeout(() => setModalState({ isOpen: false, type: "", message: "" }), 1000);
    } catch (error) {
      setModalState({ isOpen: true, type: "error", message: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const url = `${window.location.protocol}//${window.location.hostname}/${generatedKey}`;
    navigator.clipboard.writeText(url).then(() => {
        setModalState({ isOpen: true, type: "success", message: "Copied!" });
        setTimeout(() => setModalState({ isOpen: false, type: "", message: "" }), 1000);
    });
  };

  const togglePlatform = (platform: string) => {
    setActivePlatforms(prev => prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]);
  };

  const getPreviewItems = () => {
    const items: any[] = [];
    const platforms = ['YouTube', 'WhatsApp', 'Telegram', 'TikTok', 'Website', 'Instagram', 'Facebook'];
    
    platforms.forEach(p => {
        if(formData[p]) {
            Object.keys(formData[p]).forEach(k => {
                if(formData[p][k]) items.push({ platform: p, key: k });
            });
        }
    });
    if(formData.targetLinks) {
        Object.keys(formData.targetLinks).forEach(k => {
             if(k !== 'tlink1' && formData.targetLinks[k]) items.push({ platform: 'Target Link', key: k });
        });
    }
    return items;
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-violet-500/30 selection:text-violet-200 pb-20 relative overflow-x-hidden">
      
      <div className="fixed top-0 left-0 w-full h-screen pointer-events-none z-0">
          <div className="absolute top-[10%] left-[10%] w-[30rem] h-[30rem] bg-violet-600/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[20%] right-[5%] w-[20rem] h-[20rem] bg-blue-600/10 rounded-full blur-[80px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/60 shadow-2xl rounded-[2rem] p-6 sm:p-8 mt-6 relative"
        >
          <div className="flex justify-end absolute top-6 right-6 z-20">
             <button 
                onClick={clearForm}
                className="text-slate-500 hover:text-red-400 p-2 rounded-full hover:bg-slate-800 transition-colors"
                title="Reset Form"
             >
                <FaTrash size={16} />
             </button>
             <div className="text-slate-600 flex items-center gap-1 text-xs font-mono ml-2 py-2">
                <FaSave size={12}/> Auto-saved
             </div>
          </div>

          <div className="mb-10 mt-2 space-y-6">
             <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-6">
                Create Project
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <AnimatedInput 
                   icon={FaHeading} 
                   label="Title" 
                   placeholder="Project Title (e.g. Script v2)" 
                   inputId="title"
                   value={formData.title || ""}
                   onChange={(e) => handleTopLevelInputChange("title", e.target.value)} 
                />
                <AnimatedInput 
                   icon={FaSubscript} 
                   label="Subtitle" 
                   placeholder="Description (Optional)" 
                   inputId="subtitle"
                   value={formData.subtitle || ""}
                   onChange={(e) => handleTopLevelInputChange("subtitle", e.target.value)} 
                />
             </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span> Select Platforms
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {socialButtons.map(({ text, icon: Icon }, index) => (
                <button
                  key={text}
                  onClick={() => togglePlatform(text)}
                  className={`group relative flex flex-col items-center justify-center gap-2 py-3 px-2 rounded-2xl border transition-all duration-300 ${
                    activePlatforms.includes(text)
                      ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/25 scale-[1.02]"
                      : "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white hover:border-slate-500"
                  } ${
                    index === socialButtons.length - 1 ? 'col-span-2 sm:col-span-1' : ''
                  }`}
                >
                  <Icon className={`text-xl mb-0.5 transition-transform group-hover:scale-110 ${activePlatforms.includes(text) ? "text-white" : ""}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wide">{text}</span>
                  {activePlatforms.includes(text) && (
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_5px_white]"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {activePlatforms.map((platform) => (
              <PlatformInputs
                key={platform}
                platform={platform}
                data={formData[platform] || {}}
                onInputChange={handleInputChange}
                onTopLevelInputChange={handleTopLevelInputChange}
                uploadImage={uploadImageToGitHub}
                errors={errors[platform] || {}}
                onRemovePlatform={() => togglePlatform(platform)}
                formData={formData}
              />
            ))}
          </AnimatePresence>

          <div className="mt-10 pt-8 border-t border-slate-700/50">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Final Destination
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <AnimatedInput
                    icon={FaLink}
                    label="Unlock Button Text"
                    placeholder="e.g. Get Link / Unlock"
                    inputId="buttonName"
                    value={formData.buttonName || ""}
                    onChange={(e) => handleTopLevelInputChange("buttonName", e.target.value)}
                 />
                 <AnimatedInput
                    icon={FaLock}
                    label="Locked URL (Goal)"
                    placeholder="https://drive.google.com/..."
                    inputId="tlink1"
                    value={formData.targetLinks?.tlink1 || ""}
                    error={errors.targetLinks?.tlink1}
                    onChange={(e) => handleTopLevelInputChange("tlink1", e.target.value)}
                 />
             </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
             <button
               onClick={generateLink}
               disabled={loading}
               className="flex-1 bg-gradient-to-br from-violet-600 to-indigo-700 hover:from-violet-500 hover:to-indigo-600 text-white font-bold py-4 rounded-xl shadow-xl shadow-violet-900/20 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2 border border-violet-500/30"
             >
               {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"/> : <FaLock />}
               {loading ? "Generating..." : "GENERATE LINK"}
             </button>
             <button
               onClick={() => setPreviewModalOpen(true)}
               disabled={loading}
               className="flex-1 sm:flex-none sm:w-40 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl border border-slate-600 transition-all active:scale-[0.98] flex justify-center items-center gap-2"
             >
               <FaEye /> Preview
             </button>
          </div>

          <AnimatePresence>
            {generatedKey && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 overflow-hidden"
              >
                 <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5">
                    <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                      <FaCheckCircle /> Success! Your Link is Ready
                    </p>
                    <div className="flex items-center gap-2 bg-slate-950/80 rounded-xl p-2 pr-3 border border-emerald-500/20 shadow-inner">
                      <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
                          <FaLink size={14}/>
                      </div>
                      <input
                         readOnly
                         value={`${window.location.protocol}//${window.location.hostname}/${generatedKey}`}
                         className="bg-transparent flex-1 text-slate-200 text-sm font-mono outline-none px-2 truncate"
                         onClick={(e) => (e.target as HTMLInputElement).select()}
                      />
                      <button onClick={copyToClipboard} className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg transition-colors shadow-lg shadow-emerald-600/20">
                         <FaCopy size={14} />
                      </button>
                    </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>

      <Modal isOpen={modalState.isOpen} onClose={() => setModalState({ isOpen: false, type: "", message: "" })}>
         <div className="flex flex-col items-center text-center py-6">
            {modalState.type === "loading" && <div className="animate-spin rounded-full h-14 w-14 border-4 border-violet-500 border-t-transparent mb-6"></div>}
            {modalState.type === "success" && <div className="text-emerald-500 text-6xl mb-4 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]"><FaCheckCircle /></div>}
            {modalState.type === "error" && <div className="text-rose-500 text-6xl mb-4 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]"><FaTimes /></div>}
            <p className="text-lg font-bold text-slate-200 mb-2">{modalState.type === 'error' ? 'Oops!' : modalState.type === 'success' ? 'Awesome!' : 'Processing...'}</p>
            <p className="text-sm text-slate-400 max-w-[80%]">{modalState.message}</p>
         </div>
      </Modal>

      <Modal isOpen={previewModalOpen} onClose={() => setPreviewModalOpen(false)}>
        <div className="flex flex-col items-center w-full">
           <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Live Preview</h2>
           
           <div className="w-full max-w-[280px] bg-slate-950 rounded-[2.5rem] border-[6px] border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-800 rounded-b-xl z-20"></div>
              
              <div className="p-5 pt-10 min-h-[450px] flex flex-col items-center text-center bg-gradient-to-b from-slate-900 to-slate-950">
                 
                 <div 
                    className="w-16 h-16 rounded-2xl mb-4 shadow-lg flex items-center justify-center text-white text-2xl font-bold"
                    style={{ backgroundColor: formData.color || '#8b5cf6', boxShadow: `0 10px 15px -3px ${formData.color}40` }}
                 >
                    S4U
                 </div>
                 
                 {formData["Advance Option"]?.thumb && (
                    <div className="w-full mb-4 rounded-xl overflow-hidden shadow-lg border border-slate-700/50">
                       <img src={formData["Advance Option"].thumb} alt="Preview" className="w-full h-32 object-cover" />
                    </div>
                 )}

                 <h3 className="text-base font-bold text-white mb-1 line-clamp-1 w-full">
                    {formData.title || "Project Title"}
                 </h3>
                 <p className="text-[10px] text-slate-400 mb-6 line-clamp-2 w-full px-2">
                    {formData.subtitle || "Complete the steps below to unlock the link."}
                 </p>

                 <div className="w-full space-y-2.5 flex-1">
                    {getPreviewItems().map((item, idx) => {
                       const Icon = getActionIcon(item.platform, item.key);
                       
                       let btnClasses = "rounded-full";
                       let iconBg = "bg-white/20";
                       let activeStyle = formData.sty || 'style1';
                       
                       if (activeStyle === 'style2') { 
                         btnClasses = "rounded-lg";
                       } else if (activeStyle === 'style3') { 
                         btnClasses = "backdrop-blur-md border border-white/20 rounded-xl";
                       } else if (activeStyle === 'style4') { 
                         btnClasses = "rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";
                         iconBg = "bg-black/20";
                       } else if (activeStyle === 'style5') { 
                         btnClasses = "rounded-xl border-b-[4px] border-black/20";
                       }

                       return (
                          <div 
                             key={idx} 
                             className={`flex items-center gap-3 p-2.5 text-left transition-transform active:scale-[0.98] ${btnClasses}`}
                             style={{ 
                                 backgroundColor: formData.color || '#8b5cf6'
                             }}
                          >
                             <div className={`${iconBg} p-2 rounded-lg text-white`}>
                                <Icon size={12}/>
                             </div>
                             <span className="flex-1 text-[10px] font-bold text-white truncate drop-shadow-sm">
                                {getFriendlyActionName(item.platform, item.key)}
                             </span>
                             <FaArrowRight size={10} className="text-white/80 mr-1"/>
                          </div>
                       );
                    })}
                 </div>

                 <div className="w-full mt-6 pt-4 border-t border-slate-800/50">
                    <button 
                        className="w-full text-white py-3 text-xs font-bold opacity-50 cursor-not-allowed flex justify-center items-center gap-2 transition-all"
                        style={{ 
                            backgroundColor: '#10b981', 
                            borderRadius: formData.sty === 'style1' ? '9999px' : 
                                          formData.sty === 'style2' ? '0.5rem' : '0.75rem',
                            boxShadow: formData.sty === 'style4' ? '4px 4px 0px 0px rgba(0,0,0,0.4)' : 'none',
                            border: formData.sty === 'style4' ? '2px solid #064e3b' : 'none', 
                            borderBottom: formData.sty === 'style5' ? '4px solid rgba(0,0,0,0.2)' : 'none'
                        }}
                    >
                       <FaLock size={10} /> {formData.buttonName || "Get Link"}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </Modal>

    </div>
  );
};

export default Home;