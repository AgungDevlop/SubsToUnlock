import { useState, useEffect, ChangeEvent, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaHeading, FaSubscript, FaTimes, FaYoutube, FaThumbsUp, FaComment, FaWhatsapp, FaUsers, FaEnvelope, FaTelegram, FaTiktok, FaGlobe, FaInstagram, FaFacebook, FaLink, FaPlus, FaMinus, FaEye, FaLock, FaStickyNote, FaCalendarAlt, FaImage, FaArrowRight, FaCopy } from "react-icons/fa";
import { IconType } from "react-icons";
import { motion } from "framer-motion";
import debounce from "lodash/debounce";

// API URL and Token
const API_URL = "https://myapi.videyhost.my.id/api.php";
const API_TOKEN = "AgungDeveloper";
const GITHUB_TOKEN_URL = "https://skinml.agungbot.my.id/";

// Fungsi untuk memvalidasi URL
const isValidUrl = (url: string): boolean => {
  // Simple regex for URL validation
  const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(\S*)$/;
  return urlPattern.test(url);
};

// Tipe untuk FormData
interface FormData {
  title?: string;
  subtitle?: string;
  buttonName?: string;
  targetLinks: { [key: string]: string };
  [key: string]: any;
}

// Tipe untuk ErrorState
interface ErrorState {
  [key: string]: { [key: string]: string };
}

// Tipe untuk Modal
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full relative"
      >
        {children}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-200"
        >
          <FaTimes size={20} />
        </button>
      </motion.div>
    </div>
  );
};

// Tipe untuk AnimatedInput
interface AnimatedInputProps {
  icon: IconType;
  placeholder: string;
  onRemove?: () => void;
  type?: string;
  accept?: string;
  onChange: (e: ChangeChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>) => void;
  disabled?: boolean;
  value?: string;
  error?: string;
  inputId?: string;
  suggestions?: string[];
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  icon: Icon,
  placeholder,
  onRemove,
  type = "text",
  accept,
  onChange,
  disabled,
  value,
  error,
  inputId,
  suggestions = [],
}) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-4 relative"
  >
    <div className="flex items-center bg-gray-700 rounded-md p-3 border border-gray-600 focus-within:border-purple-500 transition-all duration-300">
      <Icon className="text-gray-400 mr-3" size={20} />
      {type === "textarea" ? (
        <textarea
          id={inputId}
          placeholder={placeholder}
          className="w-full bg-transparent text-white focus:outline-none resize-none"
          rows={3}
          onChange={onChange}
          disabled={disabled}
          value={value}
        />
      ) : (
        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          accept={accept}
          className="w-full bg-transparent text-white focus:outline-none"
          onChange={onChange}
          disabled={disabled}
          value={value}
        />
      )}

      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-gray-700 border border-gray-600 rounded-b-md shadow-lg max-h-40 overflow-y-auto z-10">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-2 text-white hover:bg-gray-600 cursor-pointer"
              onClick={() => onChange({ target: { value: suggestion } } as ChangeEvent<HTMLInputElement>)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-3 text-gray-400 hover:text-red-500 transition-colors duration-200"
        >
          <FaTimes size={16} />
        </button>
      )}
    </div>
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-400 text-sm mt-1 ml-2"
      >
        {error}
      </motion.p>
    )}
  </motion.div>
);

// Tipe untuk AnimatedButton
interface AnimatedButtonProps {
  text: string;
  icon: IconType;
  fullWidth?: boolean;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  text,
  icon: Icon,
  fullWidth = false,
  onClick,
  isActive = false,
  disabled = false,
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center justify-center p-3 rounded-md transition-all duration-300 ${
      fullWidth ? "w-full" : "w-auto"
    } ${
      isActive
        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
        : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
  >
    {Icon && <Icon className="mr-2" />} {text}
    {text !== "Generate Link" && text !== "Preview" && (
      isActive ? (
        <FaMinus className="ml-2" />
      ) : (
        <FaPlus className="ml-2" />
      )
    )}
  </motion.button>
);

// Tipe untuk PlatformInputs
interface PlatformInputsProps {
  platform: string;
  onInputChange: (platform: string, key: string, value: string) => void;
  uploadImage: (platform: string, key: string, file: File) => Promise<void>;
  errors: { [key: string]: string };
  inputHistory: { [key: string]: string[] };
  addToInputHistory: (key: string, value: string) => void;
}

const PlatformInputs: React.FC<PlatformInputsProps> = ({
  platform,
  onInputChange,
  uploadImage,
  errors,
  inputHistory,
  addToInputHistory
}) => {
  const [inputCounts, setInputCounts] = useState<{ [key: string]: number }>({});

  const platformConfigs: {
    [key: string]: {
      options: string[];
      inputs: {
        [key: string]: {
          icon: IconType;
          placeholder: (index: number) => string;
          key: (index: number) => string;
          type?: string;
          accept?: string;
          validate?: (value: string) => string | null;
        };
      };
    };
  } = {
    YouTube: {
      options: ["+ Subscribe", "+ Like", "+ Comment"],
      inputs: {
        Subscribe: { icon: FaYoutube, placeholder: (index: number) => `Enter YouTube Channel URL ${index + 1}`, key: (index: number) => `subs${index + 1}`, validate: (value) => (value && !isValidUrl(value) ? "Invalid YouTube URL" : null) },
        Like: { icon: FaThumbsUp, placeholder: () => `Enter YouTube Video URL`, key: () => `like`, validate: (value) => (value && !isValidUrl(value) ? "Invalid YouTube URL" : null) },
        Comment: { icon: FaComment, placeholder: () => `Enter YouTube Video URL`, key: () => `comm`, validate: (value) => (value && !isValidUrl(value) ? "Invalid YouTube URL" : null) },
      },
    },
    WhatsApp: {
      options: ["+ Message", "+ Group Invite"],
      inputs: {
        Message: { icon: FaEnvelope, placeholder: (index: number) => `Enter WhatsApp Message URL ${index + 1} (e.g., https://wa.me/...)`, key: (index: number) => `msg${index + 1}`, validate: (value) => (value && !isValidUrl(value) ? "Invalid WhatsApp URL" : null) },
        "Group Invite": { icon: FaUsers, placeholder: (index: number) => `Enter WhatsApp Group Invite URL ${index + 1} (e.g., https://chat.whatsapp.com/...)`, key: (index: number) => `grp${index + 1}`, validate: (value) => (value && !isValidUrl(value) ? "Invalid WhatsApp URL" : null) },
      },
    },
    Telegram: {
      options: ["+ Join Channel", "+ Message"],
      inputs: {
        "Join Channel": { icon: FaUsers, placeholder: (index: number) => `Enter Telegram Channel Link ${index + 1}`, key: (index: number) => `chan${index + 1}`, validate: (value) => (value && !isValidUrl(value) ? "Invalid Telegram URL" : null) },
        Message: { icon: FaEnvelope, placeholder: (index: number) => `Enter Telegram Username ${index + 1}`, key: (index: number) => `msg${index + 1}`, validate: (value) => (value.startsWith("@") ? null : "Username must start with @") },
      },
    },
    TikTok: {
      options: ["+ Follow", "+ Like Video"],
      inputs: {
        Follow: { icon: FaTiktok, placeholder: (index: number) => `Enter TikTok Username ${index + 1}`, key: (index: number) => `flw${index + 1}`, validate: (value) => (value ? null : "Username cannot be empty") },
        "Like Video": { icon: FaThumbsUp, placeholder: (index: number) => `Enter TikTok Video URL ${index + 1}`, key: (index: number) => `like${index + 1}`, validate: (value) => (value && !isValidUrl(value) ? "Invalid TikTok URL" : null) },
      },
    },
    Website: {
      options: ["+ Visit"],
      inputs: {
        Visit: { icon: FaGlobe, placeholder: (index: number) => `Enter Website URL ${index + 1}`, key: (index: number) => `visit${index + 1}`, validate: (value) => (value && !isValidUrl(value) ? "Invalid website URL" : null) },
      },
    },
    Instagram: {
      options: ["+ Follow", "+ Like Post"],
      inputs: {
        Follow: { icon: FaInstagram, placeholder: (index: number) => `Enter Instagram Username ${index + 1}`, key: (index: number) => `flw${index + 1}`, validate: (value) => (value ? null : "Username cannot be empty") },
        "Like Post": { icon: FaThumbsUp, placeholder: (index: number) => `Enter Instagram Post URL ${index + 1}`, key: (index: number) => `like${index + 1}`, validate: (value) => (value && !isValidUrl(value) ? "Invalid Instagram URL" : null) },
      },
    },
    Facebook: {
      options: ["+ Like Page", "+ Join Group"],
      inputs: {
        "Like Page": { icon: FaThumbsUp, placeholder: (index: number) => `Enter Facebook Page URL ${index + 1}`, key: (index: number) => `like${index + 1}`, validate: (value) => (value && !isValidUrl(value) ? "Invalid Facebook URL" : null) },
        "Join Group": { icon: FaUsers, placeholder: (index: number) => `Enter Facebook Group URL ${index + 1}`, key: (index: number) => `grp${index + 1}`, validate: (value) => (value && !isValidUrl(value) ? "Invalid Facebook URL" : null) },
      },
    },
    "Target Link": {
      options: ["+ Link"],
      inputs: {
        Link: { icon: FaLink, placeholder: (index: number) => `Enter Target Link ${index + 2} URL`, key: (index: number) => `tlink${index + 2}`, validate: (value) => (value && !isValidUrl(value) ? "Invalid URL" : null) },
      },
    },
    "Advance Option": {
      options: ["Password", "Note", "Expired", "Thumbnails"],
      inputs: {
        Password: { icon: FaLock, placeholder: () => "Enter Password", key: () => "pass" },
        Note: { icon: FaStickyNote, placeholder: () => "Enter Note", key: () => "note", type: "textarea" },
        Expired: { icon: FaCalendarAlt, placeholder: () => "Select Expiration Date", key: () => "exp", type: "date" },
        Thumbnails: { icon: FaImage, placeholder: () => "Upload Thumbnail (Image Only)", key: () => "thumb", type: "file", accept: "image/*" },
      },
    },
  };

  const config = platformConfigs[platform] || { options: [], inputs: {} };
  const availableOptions = config.options || [];

  const addOption = (option: string) => {
    const cleanOption = option.replace("+ ", "").trim();
    if (platform !== "Advance Option") {
      const count = inputCounts[cleanOption] || 0;
      if (count >= 5) return; // Limit 5 inputs per option
      setInputCounts((prev) => ({ ...prev, [cleanOption]: (prev[cleanOption] || 0) + 1, }));
    } else {
      if (!inputCounts[cleanOption]) {
        setInputCounts((prev) => ({ ...prev, [cleanOption]: 1, }));
      }
    }
  };

  const removeOption = (option: string, index: number) => {
    const cleanOption = option.replace("+ ", "").trim();
    setInputCounts((prev) => ({ ...prev, [cleanOption]: (prev[cleanOption] || 1) - 1, }));
    const key = platformConfigs[platform].inputs[cleanOption].key(index);
    onInputChange(platform, key, "");
  };

  const renderInputs = () => {
    const inputs: JSX.Element[] = [];
    Object.keys(inputCounts).forEach((option) => {
      const count = inputCounts[option] || 0;
      for (let i = 0; i < count; i++) {
        const inputConfig = platformConfigs[platform].inputs[option];
        const key = inputConfig.key(i);
        inputs.push(
          <AnimatedInput
            key={`${platform}-${key}-${i}`}
            icon={inputConfig.icon}
            placeholder={inputConfig.placeholder(i)}
            type={inputConfig.type}
            accept={inputConfig.accept}
            value={
              platform === "Target Link"
                ? (formData.targetLinks as any)[key]
                : (formData as any)[platform]?.[key] || ""
            }
            onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              if (inputConfig.key(0) === "thumb" && e.target instanceof HTMLInputElement && e.target.files) {
                uploadImage(platform, inputConfig.key(0), e.target.files[0]);
              } else {
                onInputChange(platform, key, e.target.value);
                if (e.target.value) {
                  addToInputHistory(`${platform}-${key}`, e.target.value);
                }
              }
            }}
            onRemove={platform !== "Advance Option" || inputConfig.type !== "file" ? () => removeOption(option, i) : undefined}
            error={errors[key]}
            suggestions={inputHistory[`${platform}-${key}`]}
          />
        );
      }
    });
    return inputs;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 p-6 rounded-lg shadow-xl mb-6 border border-gray-700"
    >
      <h3 className="text-xl font-semibold text-white mb-4">{platform}</h3>
      <div className="mb-4">
        <select
          onChange={(e) => addOption(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-600 text-white border-2 border-gradient-to-r from-purple-500 to-blue-500 rounded-md"
        >
          <option value="">Add an option</option>
          {availableOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      {renderInputs()}
    </motion.div>
  );
};

// Komponen Utama
const Home: React.FC = () => {
  const [activePlatforms, setActivePlatforms] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({ targetLinks: {} });
  const [errors, setErrors] = useState<ErrorState>({});
  const [loading, setLoading] = useState(false);
  const [generatedKey, setGeneratedKey] = useState("");
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: "",
    message: "",
  });
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [inputHistory, setInputHistory] = useState<{ [key: string]: string[] }>({});

  const socialButtons: { text: string; icon: IconType }[] = [
    { text: "YouTube", icon: FaYoutube },
    { text: "WhatsApp", icon: FaWhatsapp },
    { text: "Telegram", icon: FaTelegram },
    { text: "TikTok", icon: FaTiktok },
    { text: "Website", icon: FaGlobe },
    { text: "Instagram", icon: FaInstagram },
    { text: "Facebook", icon: FaFacebook },
    { text: "Target Link", icon: FaLink },
    { text: "Advance Option", icon: FaPlus }, // Changed icon for Advance Option
  ];

  // Load input history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("inputHistory");
    if (savedHistory) {
      setInputHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save input history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("inputHistory", JSON.stringify(inputHistory));
  }, [inputHistory]);

  const addToInputHistory = (key: string, value: string) => {
    if (!value) return;
    setInputHistory((prev) => {
      const existing = prev[key] || [];
      if (!existing.includes(value)) {
        const updated = [value, ...existing].slice(0, 5); // Keep only the last 5 entries
        return { ...prev, [key]: updated };
      }
      return prev;
    });
  };

  // Debounced input change handler
  const debouncedInputChange = useCallback(
    debounce((platform: string, key: string, value: string) => {
      setFormData((prev) => {
        if (platform === "Target Link") {
          return {
            ...prev,
            targetLinks: {
              ...prev.targetLinks,
              [key]: value,
            },
          };
        }
        return {
          ...prev,
          [platform]: {
            ...(prev[platform] || {}),
            [key]: value,
          },
        };
      });

      // Validate input using the simplified isValidUrl
      const validateInput = (platform: string, key: string, value: string) => {
        // Specific validation for Telegram username
        if (platform === "Telegram" && key.startsWith("msg")) {
          return value.startsWith("@") ? null : "Username must start with @";
        }
        // Specific validation for TikTok/Instagram username (cannot be empty)
        if ((platform === "TikTok" && key.startsWith("flw")) || (platform === "Instagram" && key.startsWith("flw"))) {
          return value ? null : "Username cannot be empty";
        }

        // General URL validation for other inputs
        if (value && (key.includes("url") || key.includes("link") || key.includes("grp") || key.includes("chan") || key.includes("visit") || key.includes("like") || key.includes("comm") || key.includes("subs") || key.includes("msg"))) {
          return isValidUrl(value) ? null : `Invalid ${platform} URL`;
        }

        return null;
      };

      setErrors((prev) => {
        const error = validateInput(platform, key, value);
        return {
          ...prev,
          [platform]: {
            ...(prev[platform] || {}),
            [key]: error || "",
          },
        };
      });
    }, 300),
    []
  );

  const handleInputChange = (platform: string, key: string, value: string) => {
    debouncedInputChange(platform, key, value);
  };

  const handleTopLevelInputChange = (key: string, value: string) => {
    setFormData((prev) => {
      if (key === "tlink1") {
        const error = value && !isValidUrl(value) ? "Invalid URL" : null;
        setErrors((prev) => ({
          ...prev,
          targetLinks: { ...prev.targetLinks, [key]: error || "" },
        }));
        if (value) {
          addToInputHistory(`topLevel-${key}`, value);
        }
        return { ...prev, targetLinks: { ...prev.targetLinks, [key]: value } };
      }
      if (value) {
        addToInputHistory(`topLevel-${key}`, value);
      }
      return { ...prev, [key]: value };
    });
  };

  const fetchGitHubToken = async (): Promise<string> => {
    try {
      const response = await fetch(GITHUB_TOKEN_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch GitHub token");
      }
      const data = await response.json();
      return data.githubToken;
    } catch (error) {
      throw new Error(`Error fetching GitHub token: ${(error as Error).message}`);
    }
  };

  const checkFolderExists = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/AgungDevlop/InjectorMl/contents/img`,
        {
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
      return response.ok;
    } catch {
      return false;
    }
  };

  const createFolder = async (token: string) => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/AgungDevlop/InjectorMl/contents/img/.gitkeep`,
        {
          method: "PUT",
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "Create img folder with .gitkeep",
            content: btoa(""),
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create img folder");
      }
    } catch (error) {
      throw new Error(`Error creating img folder: ${(error as Error).message}`);
    }
  };

  const uploadImageToGitHub = async (platform: string, key: string, file: File): Promise<void> => {
    setModalState({ isOpen: true, type: "loading", message: "Uploading thumbnail..." });

    try {
      const token = await fetchGitHubToken();
      const folderExists = await checkFolderExists(token);
      if (!folderExists) {
        await createFolder(token);
      }

      const reader = new FileReader();
      const fileContent = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      const base64Content = fileContent.split(",")[1];

      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const filePath = `img/${fileName}`;

      const response = await fetch(
        `https://api.github.com/repos/AgungDevlop/InjectorMl/contents/${filePath}`,
        {
          method: "PUT",
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `Upload thumbnail ${fileName}`,
            content: base64Content,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload image to GitHub");
      }

      const rawUrl = `https://raw.githubusercontent.com/AgungDevlop/InjectorMl/main/${filePath}`;
      handleInputChange(platform, key, rawUrl);

      setModalState({
        isOpen: true,
        type: "success",
        message: "Thumbnail uploaded successfully to GitHub!",
      });
      setTimeout(() => {
        setModalState({ isOpen: false, type: "", message: "" });
      }, 2000);
    } catch (error) {
      setModalState({
        isOpen: true,
        type: "error",
        message: `Error: ${(error as Error).message}`,
      });
    }
  };

  const generateLink = async () => {
    if (!formData.targetLinks?.tlink1) {
      setModalState({ isOpen: true, type: "error", message: "Please enter the Target Link before generating!", });
      return;
    }

    if (!isValidUrl(formData.targetLinks.tlink1)) {
      setModalState({ isOpen: true, type: "error", message: "Target Link must be a valid URL (e.g., https://example.com)!", });
      return;
    }

    const hasErrors = Object.values(errors).some((platformErrors) =>
      Object.values(platformErrors).some((error) => error)
    );
    if (hasErrors) {
      setModalState({ isOpen: true, type: "error", message: "Please fix all input errors before generating!", });
      return;
    }

    setLoading(true);
    setGeneratedKey("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setGeneratedKey(result.key);
        setModalState({
          isOpen: true,
          type: "success",
          message: "Link generated successfully!",
        });
        setTimeout(() => setModalState({ isOpen: false, type: "", message: "" }), 2000);
      } else {
        throw new Error(result.error || "Failed to generate link");
      }
    } catch (error) {
      setGeneratedKey("");
      setModalState({
        isOpen: true,
        type: "error",
        message: `Error: ${(error as Error).message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const fullUrl = `${window.location.protocol}//${window.location.hostname}/${generatedKey}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setModalState({
        isOpen: true,
        type: "success",
        message: "Link copied to clipboard!",
      });
      setTimeout(() => setModalState({ isOpen: false, type: "", message: "" }), 2000);
    }).catch(() => {
      setModalState({
        isOpen: true,
        type: "error",
        message: "Failed to copy link!",
      });
    });
  };

  const togglePlatform = (platform: string) => {
    setActivePlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: "", message: "" });
  };

  const closePreviewModal = () => {
    setPreviewModalOpen(false);
  };

  const showPreview = () => {
    setPreviewModalOpen(true);
  };

  const getIconForAction = (platform: string, action: string): IconType => {
    const iconMap: { [key: string]: IconType } = {
      'YouTube-subs1': FaYoutube, 'YouTube-subs2': FaYoutube, 'YouTube-subs3': FaYoutube, 'YouTube-subs4': FaYoutube, 'YouTube-subs5': FaYoutube,
      'YouTube-like': FaThumbsUp, 'YouTube-comm': FaComment,
      'WhatsApp-msg1': FaEnvelope, 'WhatsApp-msg2': FaEnvelope, 'WhatsApp-msg3': FaEnvelope, 'WhatsApp-msg4': FaEnvelope, 'WhatsApp-msg5': FaEnvelope,
      'WhatsApp-grp1': FaUsers, 'WhatsApp-grp2': FaUsers, 'WhatsApp-grp3': FaUsers, 'WhatsApp-grp4': FaUsers, 'WhatsApp-grp5': FaUsers,
      'Telegram-chan1': FaUsers, 'Telegram-chan2': FaUsers, 'Telegram-chan3': FaUsers, 'Telegram-chan4': FaUsers, 'Telegram-chan5': FaUsers,
      'Telegram-msg1': FaEnvelope, 'Telegram-msg2': FaEnvelope, 'Telegram-msg3': FaEnvelope, 'Telegram-msg4': FaEnvelope, 'Telegram-msg5': FaEnvelope,
      'TikTok-flw1': FaTiktok, 'TikTok-flw2': FaTiktok, 'TikTok-flw3': FaTiktok, 'TikTok-flw4': FaTiktok, 'TikTok-flw5': FaTiktok,
      'TikTok-like1': FaThumbsUp, 'TikTok-like2': FaThumbsUp, 'TikTok-like3': FaThumbsUp, 'TikTok-like4': FaThumbsUp, 'TikTok-like5': FaThumbsUp,
      'Website-visit1': FaGlobe, 'Website-visit2': FaGlobe, 'Website-visit3': FaGlobe, 'Website-visit4': FaGlobe, 'Website-visit5': FaGlobe,
      'Instagram-flw1': FaInstagram, 'Instagram-flw2': FaInstagram, 'Instagram-flw3': FaInstagram, 'Instagram-flw4': FaInstagram, 'Instagram-flw5': FaInstagram,
      'Instagram-like1': FaThumbsUp, 'Instagram-like2': FaThumbsUp, 'Instagram-like3': FaThumbsUp, 'Instagram-like4': FaThumbsUp, 'Instagram-like5': FaThumbsUp,
      'Facebook-like1': FaThumbsUp, 'Facebook-like2': FaThumbsUp, 'Facebook-like3': FaThumbsUp, 'Facebook-like4': FaThumbsUp, 'Facebook-like5': FaThumbsUp,
      'Facebook-grp1': FaUsers, 'Facebook-grp2': FaUsers, 'Facebook-grp3': FaUsers, 'Facebook-grp4': FaUsers, 'Facebook-grp5': FaUsers,
      'Advance Option-pass': FaLock, 'Advance Option-note': FaStickyNote, 'Advance Option-exp': FaCalendarAlt, 'Advance Option-thumb': FaImage,
    };
    return iconMap[`${platform}-${action}`] || FaLink;
  };

  const getButtonText = (platform: string, action: string, buttonName?: string): string => {
    const textMap: { [key: string]: string } = {
      'YouTube-subs1': 'Subscribe Channel 1', 'YouTube-subs2': 'Subscribe Channel 2', 'YouTube-subs3': 'Subscribe Channel 3', 'YouTube-subs4': 'Subscribe Channel 4', 'YouTube-subs5': 'Subscribe Channel 5',
      'YouTube-like': 'Like Video', 'YouTube-comm': 'Comment Video',
      'WhatsApp-msg1': 'Send Message 1', 'WhatsApp-msg2': 'Send Message 2', 'WhatsApp-msg3': 'Send Message 3', 'WhatsApp-msg4': 'Send Message 4', 'WhatsApp-msg5': 'Send Message 5',
      'WhatsApp-grp1': 'Join Group 1', 'WhatsApp-grp2': 'Join Group 2', 'WhatsApp-grp3': 'Join Group 3', 'WhatsApp-grp4': 'Join Group 4', 'WhatsApp-grp5': 'Join Group 5',
      'Telegram-chan1': 'Join Channel 1', 'Telegram-chan2': 'Join Channel 2', 'Telegram-chan3': 'Join Channel 3', 'Telegram-chan4': 'Join Channel 4', 'Telegram-chan5': 'Join Channel 5',
      'Telegram-msg1': 'Send Message 1', 'Telegram-msg2': 'Send Message 2', 'Telegram-msg3': 'Send Message 3', 'Telegram-msg4': 'Send Message 4', 'Telegram-msg5': 'Send Message 5',
      'TikTok-flw1': 'Follow Account 1', 'TikTok-flw2': 'Follow Account 2', 'TikTok-flw3': 'Follow Account 3', 'TikTok-flw4': 'Follow Account 4', 'TikTok-flw5': 'Follow Account 5',
      'TikTok-like1': 'Like Video 1', 'TikTok-like2': 'Like Video 2', 'TikTok-like3': 'Like Video 3', 'TikTok-like4': 'Like Video 4', 'TikTok-like5': 'Like Video 5',
      'Website-visit1': 'Visit Website 1', 'Website-visit2': 'Visit Website 2', 'Website-visit3': 'Visit Website 3', 'Website-visit4': 'Visit Website 4', 'Website-visit5': 'Visit Website 5',
      'Instagram-flw1': 'Follow Account 1', 'Instagram-flw2': 'Follow Account 2', 'Instagram-flw3': 'Follow Account 3', 'Instagram-flw4': 'Follow Account 4', 'Instagram-flw5': 'Follow Account 5',
      'Instagram-like1': 'Like Post 1', 'Instagram-like2': 'Like Post 2', 'Instagram-like3': 'Like Post 3', 'Instagram-like4': 'Like Post 4', 'Instagram-like5': 'Like Post 5',
      'Facebook-like1': 'Like Page 1', 'Facebook-like2': 'Like Page 2', 'Facebook-like3': 'Like Page 3', 'Facebook-like4': 'Like Page 4', 'Facebook-like5': 'Like Page 5',
      'Facebook-grp1': 'Join Group 1', 'Facebook-grp2': 'Join Group 2', 'Facebook-grp3': 'Join Group 3', 'Facebook-grp4': 'Join Group 4', 'Facebook-grp5': 'Join Group 5',
      'Advance Option-pass': 'Set Password', // Changed to "Set Password" for clarity
      'Advance Option-note': 'Add Note',
      'Advance Option-exp': 'Set Expiration Date',
      'Advance Option-thumb': 'Upload Thumbnail', // Changed to "Upload Thumbnail"
    };
    if (platform === 'Target') {
      return buttonName || `Get Link ${action.replace('tlink', '')}`;
    }
    return textMap[`${platform}-${action}`] || `${platform} - ${action}`;
  };

  const socialPlatforms = ['YouTube', 'WhatsApp', 'Telegram', 'TikTok', 'Website', 'Instagram', 'Facebook', 'Advance Option'];
  const socialButtonsPreview = socialPlatforms.flatMap((platform) =>
    formData[platform]
      ? Object.entries(formData[platform]).map(([action]) => ({ platform, action }))
      : []
  );
  const targetButtonsPreview = formData.targetLinks
    ? Object.entries(formData.targetLinks).map(([key]) => ({ platform: 'Target', action: key }))
    : [];
  const thumbnail = formData["Advance Option"]?.thumb;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 font-sans">
      <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
          Link Generator
        </h1>

        <div className="mb-6">
          <AnimatedInput
            icon={FaHeading}
            placeholder="Enter Title"
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleTopLevelInputChange("title", e.target.value)}
            value={formData.title || ""}
            disabled={loading}
            inputId="titleInput"
            suggestions={inputHistory["topLevel-title"]}
          />
          <AnimatedInput
            icon={FaSubscript}
            placeholder="Enter Subtitle"
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleTopLevelInputChange("subtitle", e.target.value)}
            value={formData.subtitle || ""}
            disabled={loading}
            inputId="subtitleInput"
            suggestions={inputHistory["topLevel-subtitle"]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {socialButtons.map(({ text, icon }) => (
            <AnimatedButton
              key={text}
              text={text}
              icon={icon}
              onClick={() => togglePlatform(text)}
              isActive={activePlatforms.includes(text)}
              fullWidth={text === "Advance Option"}
              disabled={loading}
            />
          ))}
        </div>

        {activePlatforms.map((platform) => (
          <PlatformInputs
            key={platform}
            platform={platform}
            onInputChange={handleInputChange}
            uploadImage={uploadImageToGitHub}
            errors={errors[platform] || {}}
            inputHistory={inputHistory}
            addToInputHistory={addToInputHistory}
          />
        ))}

        <div className="mb-6">
          <AnimatedInput
            icon={FaHeading}
            placeholder="Enter Button Name (Optional)"
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleTopLevelInputChange("buttonName", e.target.value)}
            value={formData.buttonName || ""}
            disabled={loading}
            inputId="buttonNameInput"
            suggestions={inputHistory["topLevel-buttonName"]}
          />
          <AnimatedInput
            icon={FaLink}
            placeholder="Enter Target Link (Required)"
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleTopLevelInputChange("tlink1", e.target.value)}
            disabled={loading}
            value={formData.targetLinks?.tlink1 || ""}
            error={errors.targetLinks?.tlink1}
            inputId="targetLinkInput"
            suggestions={inputHistory["topLevel-tlink1"]}
          />
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <AnimatedButton
            text="Generate Link"
            icon={FaArrowRight}
            onClick={generateLink}
            disabled={loading}
            fullWidth
          />
          <AnimatedButton
            text="Preview"
            icon={FaEye}
            onClick={showPreview}
            disabled={loading}
            fullWidth
          />
        </div>

        {generatedKey && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-700 p-4 rounded-md flex items-center justify-between mt-6 shadow-md"
          >
            <p className="text-white text-lg break-all mr-4">
              <Link to={`/${generatedKey}`} className="text-blue-400 hover:underline" target="_blank">
                {window.location.protocol}//{window.location.hostname}/{generatedKey}
              </Link>
            </p>
            <AnimatedButton
              text="Copy"
              icon={FaCopy}
              onClick={copyToClipboard}
              disabled={loading}
            />
          </motion.div>
        )}

        <Modal isOpen={modalState.isOpen} onClose={closeModal}>
          {modalState.type === "loading" && (
            <div className="flex flex-col items-center justify-center p-4">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
              <p className="text-white text-lg text-center">{modalState.message}</p>
            </div>
          )}
          {modalState.type === "success" && (
            <div className="flex flex-col items-center justify-center p-4">
              <span className="text-green-500 mb-3">
                <FaThumbsUp size={40} />
              </span>
              <p className="text-white text-lg text-center">{modalState.message}</p>
            </div>
          )}
          {modalState.type === "error" && (
            <div className="flex flex-col items-center justify-center p-4">
              <span className="text-red-500 mb-3">
                <FaTimes size={40} />
              </span>
              <p className="text-white text-lg text-center">{modalState.message}</p>
            </div>
          )}
        </Modal>

        <Modal isOpen={previewModalOpen} onClose={closePreviewModal}>
          <div className="text-center p-4">
            <h2 className="text-2xl font-bold text-white mb-4">Preview</h2>
            <h3 className="text-xl font-semibold text-white mb-2">
              {formData.title || "Untitled"}
            </h3>
            <p className="text-gray-400 mb-4">{formData.subtitle || "No subtitle"}</p>

            {thumbnail && (
              <div className="mb-4">
                <p className="text-gray-300 text-sm mb-2">Thumbnail</p>
                <img src={thumbnail} alt="Thumbnail Preview" className="w-full h-auto rounded-md object-cover" />
              </div>
            )}

            <div className="space-y-3">
              {socialButtonsPreview.map(({ platform, action }) => {
                const Icon = getIconForAction(platform, action);
                const value = formData[platform]?.[action];
                return (
                  value && ( // Only render if value exists
                    <div key={`${platform}-${action}`} className="flex items-center bg-gray-700 p-3 rounded-md">
                      <Icon className="text-gray-300 mr-3" size={20} />
                      <span className="text-white text-sm">{getButtonText(platform, action)}</span>
                    </div>
                  )
                );
              })}
              {targetButtonsPreview.map(({ action }) => {
                const value = formData.targetLinks?.[action];
                return (
                  value && ( // Only render if value exists
                    <div key={`target-${action}`} className="flex items-center bg-gray-700 p-3 rounded-md">
                      <FaLink className="text-gray-300 mr-3" size={20} />
                      <span className="text-white text-sm">{getButtonText('Target', action, formData.buttonName)}</span>
                    </div>
                  )
                );
              })}
            </div>
          </div>
        </Modal>
      </div>

      <footer className="text-center text-gray-500 text-sm mt-8">
        <p>&copy; {new Date().getFullYear()} Link Generator. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <Link to="/terms" className="hover:text-white">Terms of Service</Link>
          <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link to="/about" className="hover:text-white">About</Link>
          <Link to="/contact" className="hover:text-white">Contact</Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;
