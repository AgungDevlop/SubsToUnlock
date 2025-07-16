import { useState, useEffect, ChangeEvent, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FaHeading, FaSubscript, FaTimes,
  FaYoutube, FaThumbsUp, FaComment,
  FaWhatsapp, FaUsers, FaEnvelope,
  FaTelegram, FaTiktok, FaGlobe,
  FaInstagram, FaFacebook, FaLink,
  FaPlus, FaMinus, FaEye, FaLock,
  FaStickyNote, FaCalendarAlt, FaImage,
  FaArrowRight, FaCopy
} from "react-icons/fa";
import { IconType } from "react-icons";
import { motion } from "framer-motion";
import debounce from "lodash/debounce";

// API URL and Token
const API_URL = "https://myapi.videyhost.my.id/api.php";
const API_TOKEN = "AgungDeveloper";
const GITHUB_TOKEN_URL = "https://skinml.agungbot.my.id/";

// Fungsi untuk memvalidasi URL umum
const isValidUrl = (url: string): string | null => {
  try {
    new URL(url);
    return null; // Valid
  } catch (e) {
    return "Invalid URL format."; // Invalid
  }
};

// Fungsi untuk memvalidasi URL spesifik per platform
const validateYouTubeUrl = (url: string): string | null => {
  const youtubePattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(channel\/|watch\?v=|@|c\/|user\/|playlist\?list=)[a-zA-Z0-9_-]+/i;
  return url && !youtubePattern.test(url) ? "Invalid YouTube URL. Must be a valid YouTube channel, video, or playlist URL." : null;
};

const validateFacebookUrl = (url: string): string | null => {
  const facebookPattern = /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.com)\/(?!.*\/photo\.php|.*\/posts\/|.*\/videos\/)([\w.-]+|groups\/[a-zA-Z0-9.-]+(\/?))(\/?$)/i;
  return url && !facebookPattern.test(url) ? "Invalid Facebook URL. Must be a valid Facebook page or group URL." : null;
};

const validateTikTokUrl = (url: string): string | null => {
  const tiktokPattern = /^(https?:\/\/)?(www\.)?(tiktok\.com)\/(@[\w.-]+|v\/[a-zA-Z0-9]+)\/?$/i;
  return url && !tiktokPattern.test(url) ? "Invalid TikTok URL. Must be a valid TikTok profile or video URL." : null;
};

const validateWhatsAppUrl = (url: string): string | null => {
  const whatsappPattern = /^(https?:\/\/)?(www\.)?(wa\.me|chat\.whatsapp\.com|whatsapp\.com\/channel)\/.+/i;
  return url && !whatsappPattern.test(url)
    ? "Invalid WhatsApp URL. Must be a valid wa.me, chat.whatsapp.com, or whatsapp.com/channel URL."
    : null;
};

const validateTelegramChannelUrl = (url: string): string | null => {
  const telegramChannelPattern = /^(https?:\/\/)?(t\.me|telegram\.me)\/([a-zA-Z0-9_]+)\/?$/i;
  return url && !telegramChannelPattern.test(url) ? "Invalid Telegram Channel URL. Must be a valid t.me/@channelname or telegram.me/@channelname URL." : null;
};

const validateTelegramMessageUsername = (username: string): string | null => {
  const telegramUsernamePattern = /^@([a-zA-Z0-9_]{5,32})$/;
  return username && !telegramUsernamePattern.test(username) ? "Invalid Telegram Username. Must start with '@' and contain 5-32 alphanumeric characters or underscores." : null;
};

const validateInstagramProfileUrl = (url: string): string | null => {
  const instagramProfilePattern = /^(https?:\/\/)?(www\.)?(instagram\.com)\/([a-zA-Z0-9._]+)\/?$/i;
  return url && !instagramProfilePattern.test(url) ? "Invalid Instagram Profile URL." : null;
};

const validateInstagramPostUrl = (url: string): string | null => {
  const instagramPostPattern = /^(https?:\/\/)?(www\.)?(instagram\.com)\/p\/([a-zA-Z0-9_-]+)\/?$/i;
  return url && !instagramPostPattern.test(url) ? "Invalid Instagram Post URL." : null;
};

const validateUsername = (username: string): string | null => {
  return username && username.trim() !== '' ? null : "Username cannot be empty.";
};

// Tipe untuk FormData
interface FormData {
  title?: string;
  subtitle?: string;
  buttonName?: string;
  targetLinks: { [key: string]: string };
  // Add an index signature to allow dynamic access with string keys
  [key: string]: any;
}

// Tipe untuk ErrorState
interface ErrorState {
  [key: string]: { [key: string]: string } | undefined;
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
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-purple-700 max-w-md w-full">
        {children}
        <button
          onClick={onClose}
          className="mt-4 bg-purple-700 hover:bg-purple-600 text-white py-2 px-4 rounded-md relative overflow-hidden group"
        >
          <span className="absolute inset-0 border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-purple-500 group-hover:to-blue-500 rounded-md" />
          Close
        </button>
      </div>
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
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
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
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="relative"
  >
    <div className="relative group">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
      <input
        type={type}
        placeholder={placeholder}
        accept={accept}
        onChange={onChange}
        disabled={disabled}
        value={value}
        list={inputId}
        className={`w-full pl-10 pr-10 py-2 bg-gray-700 text-white border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 disabled:opacity-50 transition-all duration-300 ${
          error
            ? "border-red-500"
            : "border-gradient-to-r from-purple-500 to-blue-500 group-hover:shadow-[0_0_10px_rgba(139,92,246,0.5)]"
        }`}
      />
      {suggestions.length > 0 && (
        <datalist id={inputId}>
          {suggestions.map((suggestion, index) => (
            <option key={index} value={suggestion} />
          ))}
        </datalist>
      )}
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-400"
        >
          <FaTimes className="w-4 h-4" />
        </button>
      )}
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
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
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    whileHover={{ scale: disabled ? 1 : 1.05 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className={`relative group ${
      isActive ? "bg-gray-600 hover:bg-gray-500" : "bg-purple-700 hover:bg-purple-600"
    } text-white font-medium py-2 px-3 rounded-md shadow-sm flex items-center justify-between transition-colors duration-200 text-sm ${
      fullWidth ? "col-span-2 md:col-span-3" : ""
    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    onClick={onClick}
    disabled={disabled}
  >
    <span className="absolute inset-0 border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-purple-500 group-hover:to-blue-500 rounded-md transition-all duration-300" />
    <div className="flex items-center">
      {Icon && <Icon className="mr-1.5 w-3 h-3" />} {text}
    </div>
    {text !== "Generate Link" && text !== "Preview" && (
      isActive ? (
        <FaMinus className="w-3 h-3" />
      ) : (
        <FaPlus className="w-3 h-3" />
      )
    )}
  </motion.button>
);

// Tipe untuk PlatformInputs
interface PlatformInputsProps {
  platform: string;
  onInputChange: (platform: string, key: string, value: string, validator?: (value: string) => string | null) => void;
  uploadImage: (platform: string, key: string, file: File) => Promise<void>;
  errors: { [key: string]: string };
  inputHistory: { [key: string]: string[] };
  addToInputHistory: (key: string, value: string) => void;
  formData: FormData; // Add formData prop to manage initial values
}

const PlatformInputs: React.FC<PlatformInputsProps> = ({ platform, onInputChange, uploadImage, errors, inputHistory, addToInputHistory, formData }) => {
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
        Subscribe: {
          icon: FaYoutube,
          placeholder: (index: number) => `Enter YouTube Channel/Video/Playlist URL ${index + 1}`,
          key: (index: number) => `subs${index + 1}`,
          validate: validateYouTubeUrl
        },
        Like: {
          icon: FaThumbsUp,
          placeholder: (index: number) => `Enter YouTube Video URL ${index + 1}`,
          key: (index: number) => `like${index + 1}`,
          validate: validateYouTubeUrl
        },
        Comment: {
          icon: FaComment,
          placeholder: (index: number) => `Enter YouTube Video URL ${index + 1}`,
          key: (index: number) => `comm${index + 1}`,
          validate: validateYouTubeUrl
        },
      },
    },
    WhatsApp: {
      options: ["+ Message", "+ Group Invite"],
      inputs: {
        Message: {
          icon: FaEnvelope,
          placeholder: (index: number) => `Enter WhatsApp Message URL ${index + 1} (e.g., https://wa.me/...)`,
          key: (index: number) => `msg${index + 1}`,
          validate: validateWhatsAppUrl
        },
        "Group Invite": {
          icon: FaUsers,
          placeholder: (index: number) => `Enter WhatsApp Group Invite URL ${index + 1} (e.g., https://chat.whatsapp.com/...)`,
          key: (index: number) => `grp${index + 1}`,
          validate: validateWhatsAppUrl
        },
      },
    },
    Telegram: {
      options: ["+ Join Channel", "+ Message"],
      inputs: {
        "Join Channel": {
          icon: FaUsers,
          placeholder: (index: number) => `Enter Telegram Channel Link ${index + 1} (e.g., t.me/channelname)`,
          key: (index: number) => `chan${index + 1}`,
          validate: validateTelegramChannelUrl
        },
        Message: {
          icon: FaEnvelope,
          placeholder: (index: number) => `Enter Telegram Username ${index + 1} (e.g., @username)`,
          key: (index: number) => `msg${index + 1}`,
          validate: validateTelegramMessageUsername
        },
      },
    },
    TikTok: {
      options: ["+ Follow", "+ Like Video"],
      inputs: {
        Follow: {
          icon: FaTiktok,
          placeholder: (index: number) => `Enter TikTok Username ${index + 1} (e.g., @username)`,
          key: (index: number) => `flw${index + 1}`,
          validate: validateUsername
        },
        "Like Video": {
          icon: FaThumbsUp,
          placeholder: (index: number) => `Enter TikTok Video URL ${index + 1}`,
          key: (index: number) => `like${index + 1}`,
          validate: validateTikTokUrl
        },
      },
    },
    Website: {
      options: ["+ Visit"],
      inputs: {
        Visit: {
          icon: FaGlobe,
          placeholder: (index: number) => `Enter Website URL ${index + 1}`,
          key: (index: number) => `visit${index + 1}`,
          validate: isValidUrl
        },
      },
    },
    Instagram: {
      options: ["+ Follow", "+ Like Post"],
      inputs: {
        Follow: {
          icon: FaInstagram,
          placeholder: (index: number) => `Enter Instagram Profile URL ${index + 1} (e.g., instagram.com/username)`,
          key: (index: number) => `flw${index + 1}`,
          validate: validateInstagramProfileUrl
        },
        "Like Post": {
          icon: FaThumbsUp,
          placeholder: (index: number) => `Enter Instagram Post URL ${index + 1} (e.g., instagram.com/p/...)`,
          key: (index: number) => `like${index + 1}`,
          validate: validateInstagramPostUrl
        },
      },
    },
    Facebook: {
      options: ["+ Like Page", "+ Join Group"],
      inputs: {
        "Like Page": {
          icon: FaThumbsUp,
          placeholder: (index: number) => `Enter Facebook Page URL ${index + 1}`,
          key: (index: number) => `like${index + 1}`,
          validate: validateFacebookUrl
        },
        "Join Group": {
          icon: FaUsers,
          placeholder: (index: number) => `Enter Facebook Group URL ${index + 1}`,
          key: (index: number) => `grp${index + 1}`,
          validate: validateFacebookUrl
        },
      },
    },
    "Target Link": {
      options: ["+ Link"],
      inputs: {
        Link: {
          icon: FaLink,
          placeholder: (index: number) => `Enter Target Link ${index + 2} URL`, // Starts from tlink2 for dynamic links
          key: (index: number) => `tlink${index + 2}`,
          validate: isValidUrl
        },
      },
    },
    "Advance Option": {
      options: ["Password", "Note", "Expired", "Thumbnails"],
      inputs: {
        Password: {
          icon: FaLock,
          placeholder: () => "Enter Password",
          key: () => "pass"
        },
        Note: {
          icon: FaStickyNote,
          placeholder: () => "Enter Note",
          key: () => "note"
        },
        Expired: {
          icon: FaCalendarAlt,
          placeholder: () => "Select Expiration Date",
          key: () => "exp",
          type: "date"
        },
        Thumbnails: {
          icon: FaImage,
          placeholder: () => "Upload Thumbnail (Image Only)",
          key: () => "thumb",
          type: "file",
          accept: "image/*"
        },
      },
    },
  };

  useEffect(() => {
    // Initialize inputCounts based on existing formData
    const initialCounts: { [key: string]: number } = {};
    if (formData[platform]) {
      Object.keys(formData[platform]!).forEach(key => {
        // Find the corresponding option name in platformConfigs
        for (const optionName in platformConfigs[platform]?.inputs) {
          const inputConfig = platformConfigs[platform].inputs[optionName];
          // Check if the key starts with the base key name (e.g., 'subs' for 'subs1', 'subs2')
          if (key.startsWith(inputConfig.key(0).replace(/\d+$/, '')) && formData[platform]![key]) {
            initialCounts[optionName] = (initialCounts[optionName] || 0) + 1;
            break; // Found the matching option, move to next key
          }
        }
      });
    }
    setInputCounts(initialCounts);
  }, [formData, platform, platformConfigs]);


  const config = platformConfigs[platform] || { options: [], inputs: {} };
  const availableOptions = config.options || [];

  const addOption = (option: string) => {
    const cleanOption = option.replace("+ ", "").trim();
    const currentCount = inputCounts[cleanOption] || 0;

    if (platform === "Advance Option") {
      if (currentCount > 0) return; // Only allow one of each advanced option
    } else {
      if (currentCount >= 5) return; // Limit 5 inputs per option for social platforms
    }

    setInputCounts((prev) => ({
      ...prev,
      [cleanOption]: (prev[cleanOption] || 0) + 1,
    }));
  };

  const removeOption = (option: string, index: number) => {
    const cleanOption = option.replace("+ ", "").trim();
    setInputCounts((prev) => {
      const newCount = (prev[cleanOption] || 1) - 1;
      const newCounts = { ...prev };
      if (newCount <= 0) {
        delete newCounts[cleanOption];
      } else {
        newCounts[cleanOption] = newCount;
      }

      // Clear the input value from form data and remove error
      const keyToRemove = platformConfigs[platform].inputs[cleanOption].key(index);
      onInputChange(platform, keyToRemove, ""); // Pass empty string to clear value
      return newCounts;
    });
  };


  const renderInputs = () => {
    const inputs: JSX.Element[] = [];
    Object.keys(inputCounts).forEach((option) => {
      const count = inputCounts[option] || 0;
      for (let i = 0; i < count; i++) {
        const inputConfig = platformConfigs[platform].inputs[option];
        const key = inputConfig.key(i);
        const currentValue = platform === "Target Link" ? formData.targetLinks?.[key] : formData[platform]?.[key];

        inputs.push(
          <div key={`${platform}-${option}-${i}`} className="mb-4">
            <AnimatedInput
              icon={inputConfig.icon}
              placeholder={inputConfig.placeholder(i)}
              type={inputConfig.type || "text"}
              accept={inputConfig.accept}
              inputId={`${platform}-${key}`}
              suggestions={inputHistory[`${platform}-${key}`] || []}
              value={currentValue || ""} // Ensure value is controlled
              onChange={(e) => {
                if (inputConfig.type === "file" && e.target.files) {
                  uploadImage(platform, key, e.target.files[0]);
                } else {
                  onInputChange(platform, key, e.target.value, inputConfig.validate);
                  addToInputHistory(`${platform}-${key}`, e.target.value);
                }
              }}
              onRemove={
                (inputConfig.type !== "file" || (platform === "Advance Option" && inputConfig.key(0) !== "thumb")) &&
                // Only allow removal if there are multiple inputs for this option, or it's an advanced option (but not thumbnail)
                ((platform !== "Advance Option" && count > 0) || (platform === "Advance Option" && inputConfig.key(0) !== "thumb"))
                ? () => removeOption(option, i) : undefined
              }
              error={errors[key]}
            />
          </div>
        );
      }
    });
    return inputs;
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-6 bg-gray-700 p-4 rounded-lg border border-purple-600"
    >
      <h2 className="text-xl font-bold text-white mb-4 text-center">{platform}</h2>
      <select
        value=""
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
      {renderInputs()}
    </motion.div>
  );
};

// Komponen Utama
const Home: React.FC = () => {
  const [activePlatforms, setActivePlatforms] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({ targetLinks: {} });
  const [errors, setErrors] = useState<ErrorState>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedKey, setGeneratedKey] = useState<string>("");
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "" | "loading" | "success" | "error";
    message: string;
  }>({
    isOpen: false,
    type: "",
    message: "",
  });
  const [previewModalOpen, setPreviewModalOpen] = useState<boolean>(false);
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
    { text: "Advance Option", icon: FaLink },
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
    debounce((platform: string, key: string, value: string, validator?: (value: string) => string | null) => {
      setFormData((prev) => {
        if (platform === "Target Link") {
          const newTargetLinks = { ...prev.targetLinks };
          if (value === "") {
            delete newTargetLinks[key]; // Remove if empty
          } else {
            newTargetLinks[key] = value;
          }
          return {
            ...prev,
            targetLinks: newTargetLinks,
          };
        } else {
          const newPlatformData = { ...(prev[platform] || {}) };
          if (value === "") {
            delete newPlatformData[key]; // Remove if empty
          } else {
            newPlatformData[key] = value;
          }
          return {
            ...prev,
            [platform]: newPlatformData,
          };
        }
      });

      // Validate input
      setErrors((prev) => {
        const error = validator ? validator(value) : null;
        if (platform === "Target Link") {
          return {
            ...prev,
            targetLinks: {
              ...(prev.targetLinks || {}),
              [key]: error || "",
            },
          };
        }
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

  const handleInputChange = (platform: string, key: string, value: string, validator?: (value: string) => string | null) => {
    debouncedInputChange(platform, key, value, validator);
  };

  const handleTopLevelInputChange = (key: string, value: string, validator?: (value: string) => string | null) => {
    setFormData((prev) => {
      if (key === "tlink1") {
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
        [key]: value,
      };
    });

    setErrors((prev) => {
      const error = validator ? validator(value) : null;
      if (key === "tlink1") {
        return {
          ...prev,
          targetLinks: {
            ...(prev.targetLinks || {}),
            [key]: error || "",
          },
        };
      }
      return {
        ...prev,
        [key]: error || "", // Top-level errors can be directly on the key if not nested
      };
    });
    if (value) {
      addToInputHistory(`topLevel-${key}`, value);
    }
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
      handleInputChange(platform, key, rawUrl); // Update form data with the URL

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
    // Validate top-level target link
    const targetLinkError = formData.targetLinks?.tlink1 ? isValidUrl(formData.targetLinks.tlink1) : "Please enter the Target Link before generating!";
    if (targetLinkError) {
      setErrors(prev => ({
        ...prev,
        targetLinks: {
          ...(prev.targetLinks || {}),
          tlink1: targetLinkError
        }
      }));
      setModalState({
        isOpen: true,
        type: "error",
        message: targetLinkError,
      });
      return;
    }

    // Check all nested errors
    const hasErrors = Object.values(errors).some(platformErrors =>
      platformErrors && Object.values(platformErrors).some(error => error)
    );

    if (hasErrors) {
      setModalState({
        isOpen: true,
        type: "error",
        message: "Please fix all input errors before generating!",
      });
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
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
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

  const getIconForAction = (platform: string, actionKey: string): IconType => {
    const iconMap: { [key: string]: IconType } = {
      'subs': FaYoutube,
      'like': FaThumbsUp,
      'comm': FaComment,
      'msg': FaEnvelope,
      'grp': FaUsers,
      'chan': FaUsers,
      'flw': platform === 'TikTok' ? FaTiktok : FaInstagram,
      'visit': FaGlobe,
      'pass': FaLock,
      'note': FaStickyNote,
      'exp': FaCalendarAlt,
      'thumb': FaImage,
      'tlink': FaLink,
    };
    // Extract base action key (e.g., 'subs' from 'subs1', 'like' from 'like')
    const baseAction = actionKey.match(/([a-zA-Z]+)/)?.[1] || actionKey;
    return iconMap[baseAction] || FaLink;
  };

  const getButtonText = (platform: string, actionKey: string, buttonName?: string): string => {
    if (platform === 'Target') {
      const index = parseInt(actionKey.replace('tlink', ''), 10);
      return buttonName || `Get Link ${index}`;
    }

    const textMap: { [key: string]: string } = {
      'subs': 'Subscribe Channel',
      'like': 'Like Video',
      'comm': 'Comment Video',
      'msg': 'Send Message',
      'grp': 'Join Group',
      'chan': 'Join Channel',
      'flw': 'Follow Account',
      'visit': 'Visit Website',
      'pass': 'Enter Password',
      'note': 'Add Note',
      'exp': 'Set Expiration',
      'thumb': 'View Thumbnail',
    };

    const baseAction = actionKey.match(/([a-zA-Z]+)/)?.[1] || actionKey;
    const numberMatch = actionKey.match(/\d+/);
    const numberSuffix = numberMatch ? ` ${numberMatch[0]}` : '';

    return `${textMap[baseAction] || baseAction}${numberSuffix}`;
  };

  const socialPlatforms = ['YouTube', 'WhatsApp', 'Telegram', 'TikTok', 'Website', 'Instagram', 'Facebook', 'Advance Option'];
  const socialButtonsPreview = socialPlatforms.flatMap((platform) =>
    formData[platform]
      ? Object.entries(formData[platform]!).map(([actionKey]) => ({ platform, actionKey }))
      : []
  );

  const targetButtonsPreview = formData.targetLinks
    ? Object.entries(formData.targetLinks).map(([key]) => ({ platform: 'Target', actionKey: key }))
    : [];

  // Filter out tlink1 from the dynamic target buttons as it's handled separately
  const filteredTargetButtonsPreview = targetButtonsPreview.filter(btn => btn.actionKey !== 'tlink1');

  const thumbnail = formData["Advance Option"]?.thumb;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6 text-white min-h-screen flex flex-col"
    >
      <div className="max-w-3xl mx-auto flex-grow">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-purple-700">
          <div className="mb-6 space-y-4">
            <AnimatedInput
              icon={FaHeading}
              placeholder="Enter Title"
              inputId="title"
              suggestions={inputHistory["topLevel-title"] || []}
              onChange={(e) => handleTopLevelInputChange("title", e.target.value)}
              disabled={loading}
              value={formData.title || ""}
            />
            <AnimatedInput
              icon={FaSubscript}
              placeholder="Enter Subtitle (optional)"
              inputId="subtitle"
              suggestions={inputHistory["topLevel-subtitle"] || []}
              onChange={(e) => handleTopLevelInputChange("subtitle", e.target.value)}
              disabled={loading}
              value={formData.subtitle || ""}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {socialButtons.map(({ text, icon }) => (
              <AnimatedButton
                key={text}
                text={text}
                icon={icon}
                isActive={activePlatforms.includes(text)}
                onClick={() => togglePlatform(text)}
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
              formData={formData} // Pass formData
            />
          ))}

          <div className="space-y-4 mb-6 mt-6">
            <AnimatedInput
              icon={FaLink}
              placeholder="Enter Button Name (optional)"
              inputId="buttonName"
              suggestions={inputHistory["topLevel-buttonName"] || []}
              onChange={(e) => handleTopLevelInputChange("buttonName", e.target.value)}
              disabled={loading}
              value={formData.buttonName || ""}
            />
            <AnimatedInput
              icon={FaLink}
              placeholder="Enter Target Link (e.g., https://example.com)"
              inputId="tlink1"
              suggestions={inputHistory["topLevel-tlink1"] || []}
              onChange={(e) => handleTopLevelInputChange("tlink1", e.target.value, isValidUrl)}
              disabled={loading}
              value={formData.targetLinks?.tlink1 || ""}
              error={errors.targetLinks?.tlink1}
            />
          </div>

          <div className="flex justify-between gap-3">
            <AnimatedButton
              text={loading ? "Generating..." : "Generate Link"}
              icon={FaLink}
              onClick={generateLink}
              disabled={loading}
            />
            <AnimatedButton
              text="Preview"
              icon={FaEye}
              onClick={showPreview}
              disabled={loading}
            />
          </div>

          {generatedKey && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-4 flex items-center"
            >
              <div className="relative flex-grow group">
                <FaLink className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="text"
                  value={`${window.location.protocol}//${window.location.hostname}/${generatedKey}`}
                  readOnly
                  className="w-full pl-10 pr-10 py-2 bg-gray-700 text-white border-2 border-gradient-to-r from-purple-500 to-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 group-hover:shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                />
                <button
                  onClick={copyToClipboard}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300"
                >
                  <FaCopy className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Modal isOpen={modalState.isOpen} onClose={closeModal}>
        {modalState.type === "loading" && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p>{modalState.message}</p>
          </div>
        )}
        {modalState.type === "success" && (
          <div className="text-center">
            <div className="text-green-500 text-4xl mb-4">✔</div>
            <p>{modalState.message}</p>
          </div>
        )}
        {modalState.type === "error" && (
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">✖</div>
            <p>{modalState.message}</p>
          </div>
        )}
      </Modal>

      <Modal isOpen={previewModalOpen} onClose={closePreviewModal}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Preview</h2>
          <div className="w-full mb-4 bg-gray-700 p-4 rounded-xl shadow-lg border border-purple-600 text-center">
            <h1 className="text-xl font-bold mb-2">{formData.title || "Untitled"}</h1>
            <p className="text-base text-gray-300">{formData.subtitle || "No subtitle"}</p>
          </div>

          {thumbnail && (
            <div className="w-full mb-4 bg-gray-700 p-4 rounded-xl shadow-lg border border-purple-600 text-center">
              <h2 className="text-lg font-bold mb-2">Thumbnail</h2>
              <img
                src={thumbnail}
                alt="Thumbnail"
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}

          <div className="w-full space-y-3">
            {socialButtonsPreview.map(({ platform, actionKey }) => {
              const Icon = getIconForAction(platform, actionKey);
              // Do not render if the value is empty (meaning the input was removed)
              const value = platform === "Advance Option" ? formData["Advance Option"]?.[actionKey] : formData[platform]?.[actionKey];
              if (!value) return null;

              return (
                <div
                  key={`${platform}-${actionKey}`}
                  className="w-full flex items-center bg-purple-600 text-white py-3 px-5 rounded-full shadow-md relative group"
                  style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)' }}
                >
                  <Icon className="mr-3 text-lg" />
                  <div className="flex-1 text-center">
                    {getButtonText(platform, actionKey)}
                  </div>
                  <div className="p-2 rounded-full bg-opacity-20 bg-white">
                    <FaArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              );
            })}

            {/* Render tlink1 if it exists */}
            {formData.targetLinks?.tlink1 && (
              <div
                key={`Target-tlink1`}
                className="w-full flex items-center bg-gray-600 text-white py-3 px-5 rounded-full shadow-md relative group"
                style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)' }}
              >
                <FaLink className="mr-3 text-lg" />
                <div className="flex-1 text-center">
                  {formData.buttonName || `Get Link 1`}
                </div>
                <div className="p-2 rounded-full bg-opacity-20 bg-white">
                  <FaArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            )}

            {filteredTargetButtonsPreview.map(({ actionKey }) => {
              const value = formData.targetLinks?.[actionKey];
              if (!value) return null; // Do not render if the value is empty

              return (
                <div
                  key={`Target-${actionKey}`}
                  className="w-full flex items-center bg-gray-600 text-white py-3 px-5 rounded-full shadow-md relative group"
                  style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)' }}
                >
                  <FaLink className="mr-3 text-lg" />
                  <div className="flex-1 text-center">
                    {getButtonText('Target', actionKey, formData.buttonName)}
                  </div>
                  <div className="p-2 rounded-full bg-opacity-20 bg-white">
                    <FaArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>

      <footer className="mt-8 bg-gray-900 py-6 border-t border-purple-700">
        <div className="max-w-3xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-4 md:mb-0">
            <Link
              to="/terms-and-conditions"
              className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy-policy"
              className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              to="/about-us"
              className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
            >
              Contact
            </Link>
          </div>
          <div className="flex gap-4">
            <a
              href="https://t.me/subs4unlock"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
            >
              <FaTelegram className="w-6 h-6" />
            </a>
            <a
              href="https://wa.me/62881037428871"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
            >
              <FaWhatsapp className="w-6 h-6" />
            </a>
            <a
              href="https://youtube.com/@subs4unlock"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
            >
              <FaYoutube className="w-6 h-6" />
            </a>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

export default Home;
