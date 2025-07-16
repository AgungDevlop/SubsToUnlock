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

// Simple URL validation regex
const isValidUrl = (url: string): boolean => {
  const urlPattern = /^(https?:\/\/)([\w-]+(\.[\w-]+)+)(\/[\w- ./?%&=]*)?$/i;
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
  onInputChange: (platform: string, key: string, value: string) => void;
  uploadImage: (platform: string, key: string, file: File) => Promise<void>;
  errors: { [key: string]: string };
  inputHistory: { [key: string]: string[] };
  addToInputHistory: (key: string, value: string) => void;
}

const PlatformInputs: React.FC<PlatformInputsProps> = ({ platform, onInputChange, uploadImage, errors, inputHistory, addToInputHistory }) => {
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
          placeholder: (index: number) => `Enter YouTube Channel URL ${index + 1}`,
          key: (index: number) => `subs${index + 1}`,
          validate: (value) => (value && !isValidUrl(value) ? "Invalid URL" : null)
        },
        Like: {
          icon: FaThumbsUp,
          placeholder: () => `Enter YouTube Video URL`,
          key: () => `like`,
          validate: (value) => (value && !isValidUrl(value) ? "Invalid URL" : null)
        },
        Comment: {
          icon: FaComment,
          placeholder: () => `Enter YouTube Video URL`,
          key: () => `comm`,
          validate: (value) => (value && !isValidUrl(value) ? "Invalid URL" : null)
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
          validate: (value) => (value && !isValidUrl(value) ? "Invalid URL" : null)
        },
        "Group Invite": {
          icon: FaUsers,
          placeholder: (index: number) => `Enter WhatsApp Group Invite URL ${index + 1} (e.g., https://chat.whatsapp.com/...)`,
          key: (index: number) => `grp${index + 1}`,
          validate: (value) => (value && !isValidUrl(value) ? "Invalid URL" : null)
        },
      },
    },
    Telegram: {
      options: ["+ Join Channel", "+ Message"],
      inputs: {
        "Join Channel": {
          icon: FaUsers,
          placeholder: (index: number) => `Enter Telegram Channel Link ${index + 1}`,
          key: (index: number) => `chan${index + 1}`,
          validate: (value) => (value && !isValidUrl(value) ? "Invalid URL" : null)
        },
        Message: {
          icon: FaEnvelope,
          placeholder: (index: number) => `Enter Telegram Username ${index + 1}`,
          key: (index: number) => `msg${index + 1}`,
          validate: (value) => (value && !value.startsWith("@") ? "Username must start with @" : null)
        },
      },
    },
    TikTok: {
      options: ["+ Follow", "+ Like Video"],
      inputs: {
        Follow: {
          icon: FaTiktok,
          placeholder: (index: number) => `Enter TikTok Username ${index + 1}`,
          key: (index: number) => `flw${index + 1}`,
          validate: (value) => (value ? null : "Username cannot be empty")
        },
        "Like Video": {
          icon: FaThumbsUp,
          placeholder: (index: number) => `Enter TikTok Video URL ${index + 1}`,
          key: (index: number) => `like${index + 1}`,
          validate: (value) => (value && !isValidUrl(value) ? "Invalid URL" : null)
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
          validate: (value) => (value && !isValidUrl(value) ? "Invalid URL" : null)
        },
      },
    },
    Instagram: {
      options: ["+ Follow", "+ Like Post"],
      inputs: {
        Follow: {
          icon: FaInstagram,
          placeholder: (index: number) => `Enter Instagram Username ${index + 1}`,
          key: (index: number) => `flw${index + 1}`,
          validate: (value) => (value ? null : "Username cannot be empty")
        },
        "Like Post": {
          icon: FaThumbsUp,
          placeholder: (index: number) => `Enter Instagram Post URL ${index + 1}`,
          key: (index: number) => `like${index + 1}`,
          validate: (value) => (value && !isValidUrl(value) ? "Invalid URL" : null)
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
          validate: (value) => (value && !isValidUrl(value) ? "Invalid URL" : null)
        },
        "Join Group": {
          icon: FaUsers,
          placeholder: (index: number) => `Enter Facebook Group URL ${index + 1}`,
          key: (index: number) => `grp${index + 1}`,
          validate: (value) => (value && !isValidUrl(value) ? "Invalid URL" : null)
        },
      },
    },
    "Target Link": {
      options: ["+ Link"],
      inputs: {
        Link: {
          icon: FaLink,
          placeholder: (index: number) => `Enter Target Link ${index + 2} URL`,
          key: (index: number) => `tlink${index + 2}`,
          validate: (value) => (value && !isValidUrl(value) ? "Invalid URL" : null)
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

  const config = platformConfigs[platform] || { options: [], inputs: {} };
  const availableOptions = config.options || [];

  const addOption = (option: string) => {
    const optionKey = option.replace("+ ", "").trim();
    if (platform !== "Advance Option") {
      const count = inputCounts[optionKey] || 0;
      if (count >= 5) return; // Limit 5 inputs per option
      setInputCounts((prev) => ({
        ...prev,
        [optionKey]: (prev[optionKey] || 0) + 1,
      }));
    } else {
      if (!inputCounts[optionKey]) {
        setInputCounts((prev) => ({
          ...prev,
          [optionKey]: 1,
        }));
      }
    }
  };

  const removeOption = (option: string, index: number) => {
    const optionKey = option.replace("+ ", "").trim();
    setInputCounts((prev) => ({
      ...prev,
      [optionKey]: (prev[optionKey] || 1) - 1,
    }));
    const key = platformConfigs[platform].inputs[optionKey].key(index);
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
          <div key={`${option}-${i}`} className="mb-4">
            <AnimatedInput
              icon={inputConfig.icon}
              placeholder={inputConfig.placeholder(i)}
              type={inputConfig.type || "text"}
              accept={inputConfig.accept}
              inputId={`${platform}-${key}`}
              suggestions={inputHistory[`${platform}-${key}`] || []}
              onChange={(e) => {
                if (inputConfig.key(0) === "thumb" && e.target.files) {
                  uploadImage(platform, inputConfig.key(0), e.target.files[0]);
                } else {
                  onInputChange(platform, key, e.target.value);
                  if (e.target.value) {
                    addToInputHistory(`${platform}-${key}`, e.target.value);
                  }
                }
              }}
 |              onRemove={platform !== "Advance Option" || inputConfig.type !== "file" ? () => removeOption(option, i) : undefined}
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
      initial={{ opacity: 0, height:  remodeling0 }}
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
 soaps: string;
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

      // Validate input
      const validateInput = () => {
        const platformConfig: {
          [key: string]: { [key: string]: (value: string) => string | null };
        } = {
          YouTube: {
            subs1: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            subs2: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            subs3: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            subs4: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            subs5: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            like: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            comm: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null)
          },
          WhatsApp: {
            msg1: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            msg2: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            msg3: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            msg4: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            msg5: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            grp1: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            grp2: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            grp3: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            grp4: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            grp5: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null)
          },
          Telegram: {
            chan1: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            chan2: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            chan3: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            chan4: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            chan5: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            msg1: (v) => (v && !v.startsWith("@") ? "Username must start with @" : null),
            msg2: (v) => (v && !v.startsWith("@") ? "Username must start with @" : null),
            msg3: (v) => (v && !v.startsWith("@") ? "Username must start with @" : null),
            msg4: (v) => (v && !v.startsWith("@") ? "Username must start with @" : null),
            msg5: (v) => (v && !v.startsWith("@") ? "Username must start with @" : null)
          },
          TikTok: {
            flw1: (v) => (v ? null : "Username cannot be empty"),
            flw2: (v) => (v ? null : "Username cannot be empty"),
            flw3: (v) => (v ? null : "Username cannot be empty"),
            flw4: (v) => (v ? null : "Username cannot be empty"),
            flw5: (v) => (v ? null : "Username cannot be empty"),
            like1: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            like2: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            like3: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            like4: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            like5: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null)
          },
          Website: {
            visit1: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            visit2: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            visit3: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            visit4: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            visit5: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null)
          },
          Instagram: {
            flw1: (v) => (v ? null : "Username cannot be empty"),
            flw2: (v) => (v ? null : "Username cannot be empty"),
            flw3: (v) => (v ? null : "Username cannot be empty"),
            flw4: (v) => (v ? null : "Username cannot be empty"),
            flw5: (v) => (v ? null : "Username cannot be empty"),
            like1: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            like2: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            like3: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            like4: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            like5: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null)
          },
          Facebook: {
            like1: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            like2: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            like3: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            like4: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            like5: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            grp1: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            grp2: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            grp3: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            grp4: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            grp5: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null)
          },
          "Target Link": {
            tlink2: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            tlink3: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            tlink4: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            tlink5: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null),
            tlink6: (v) => (v && !isValidUrl(v) ? "Invalid URL" : null)
          },
        };

        const validator = platformConfig[platform]?.[key];
        return validator ? validator(value) : null;
      };

      setErrors((prev) => {
        const error = validateInput();
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
          targetLinks: {
            ...prev.targetLinks,
            [key]: error || "",
          },
        }));
        if (value) {
          addToInputHistory(`topLevel-${key}`, value);
        }
        return {
          ...prev,
          targetLinks: {
            ...prev.targetLinks,
            [key]: value,
          },
        };
      }
      if (value) {
        addToInputHistory(`topLevel-${key}`, value);
      }
      return {
        ...prev,
        [key]: value,
      };
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
      setModalState({
        isOpen: true,
        type: "error",
        message: "Please enter the Target Link before generating!",
      });
      return;
    }

    if (!isValidUrl(formData.targetLinks.tlink1)) {
      setModalState({
        isOpen: true,
        type: "error",
        message: "Target Link must be a valid URL (e.g., https://example.com)!",
      });
      return;
    }

    const hasErrors = Object.values(errors).some((platformErrors) =>
      Object.values(platformErrors).some((error) => error)
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

  const getIconForAction = (platform: string, action: string): IconType => {
    const iconMap: { [key: string]: IconType } = {
      'YouTube-subs1': FaYoutube,
      'YouTube-subs2': FaYoutube,
      'YouTube-subs3': FaYoutube,
      'YouTube-subs4': FaYoutube,
      'YouTube-subs5': FaYoutube,
      'YouTube-like': FaThumbsUp,
      'YouTube-comm': FaComment,
      'WhatsApp-msg1': FaEnvelope,
      'WhatsApp-msg2': FaEnvelope,
      'WhatsApp-msg3': FaEnvelope,
      'WhatsApp-msg4': FaEnvelope,
      'WhatsApp-msg5': FaEnvelope,
      'WhatsApp-grp1': FaUsers,
      'WhatsApp-grp2': FaUsers,
      'WhatsApp-grp3': FaUsers,
      'WhatsApp-grp4': FaUsers,
      'WhatsApp-grp5': FaUsers,
      'Telegram-chan1': FaUsers,
      'Telegram-chan2': FaUsers,
      'Telegram-chan3': FaUsers,
      'Telegram-chan4': FaUsers,
      'Telegram-chan5': FaUsers,
      'Telegram-msg1': FaEnvelope,
      'Telegram-msg2': FaEnvelope,
      'Telegram-msg3': FaEnvelope,
      'Telegram-msg4': FaEnvelope,
      'Telegram-msg5': FaEnvelope,
      'TikTok-flw1': FaTiktok,
      'TikTok-flw2': FaTiktok,
      'TikTok-flw3': FaTiktok,
      'TikTok-flw4': FaTiktok,
      'TikTok-flw5': FaTiktok,
      'TikTok-like1': FaThumbsUp,
      'TikTok-like2': FaThumbsUp,
      'TikTok-like3': FaThumbsUp,
      'TikTok-like4': FaThumbsUp,
      'TikTok-like5': FaThumbsUp,
      'Website-visit1': FaGlobe,
      'Website-visit2': FaGlobe,
      'Website-visit3': FaGlobe,
      'Website-visit4': FaGlobe,
      'Website-visit5': FaGlobe,
      'Instagram-flw1': FaInstagram,
      'Instagram-flw2': FaInstagram,
      'Instagram-flw3': FaInstagram,
      'Instagram-flw4': FaInstagram,
      'Instagram-flw5': FaInstagram,
      'Instagram-like1': FaThumbsUp,
      'Instagram-like2': FaThumbsUp,
      'Instagram-like3': FaThumbsUp,
      'Instagram-like4': FaThumbsUp,
      'Instagram-like5': FaThumbsUp,
      'Facebook-like1': FaThumbsUp,
      'Facebook-like2': FaThumbsUp,
      'Facebook-like3': FaThumbsUp,
      'Facebook-like4': FaThumbsUp,
      'Facebook-like5': FaThumbsUp,
      'Facebook-grp1': FaUsers,
      'Facebook-grp2': FaUsers,
      'Facebook-grp3': FaUsers,
      'Facebook-grp4': FaUsers,
      'Facebook-grp5': FaUsers,
      'Advance Option-pass': FaLock,
      'Advance Option-note': FaStickyNote,
      'Advance Option-exp': FaCalendarAlt,
      'Advance Option-thumb': FaImage,
    };
    return iconMap[`${platform}-${action}`] || FaLink;
  };

  const getButtonText = (platform: string, action: string, buttonName?: string): string => {
    const textMap: { [key: string]: string } = {
      'YouTube-subs1': 'Subscribe Channel 1',
      'YouTube-subs2': 'Subscribe Channel 2',
      'YouTube-subs3': 'Subscribe Channel 3',
      'YouTube-subs4': 'Subscribe Channel 4',
      'YouTube-subs5': 'Subscribe Channel 5',
      'YouTube-like': 'Like Video',
      'YouTube-comm': 'Comment Video',
      'WhatsApp-msg1': 'Send Message 1',
      'WhatsApp-msg2': 'Send Message 2',
      'WhatsApp-msg3': 'Send Message 3',
      'WhatsApp-msg4': 'Send Message 4',
      'WhatsApp-msg5': 'Send Message 5',
      'WhatsApp-grp1': 'Join Group 1',
      'WhatsApp-grp2': 'Join Group 2',
      'WhatsApp-grp3': 'Join Group 3',
      'WhatsApp-grp4': 'Join Group 4',
      'WhatsApp-grp5': 'Join Group 5',
      'Telegram-chan1': 'Join Channel 1',
      'Telegram-chan2': 'Join Channel 2',
      'Telegram-chan3': 'Join Channel 3',
      'Telegram-chan4': 'Join Channel 4',
      'Telegram-chan5': 'Join Channel 5',
      'Telegram-msg1': 'Send Message 1',
      'Telegram-msg2': 'Send Message 2',
      'Telegram-msg3': 'Send Message 3',
      'Telegram-msg4': 'Send Message 4',
      'Telegram-msg5': 'Send Message 5',
      'TikTok-flw1': 'Follow Account 1',
      'TikTok-flw2': 'Follow Account 2',
      'TikTok-flw3': 'Follow Account 3',
      'TikTok-flw4': 'Follow Account 4',
      'TikTok-flw5': 'Follow Account 5',
      'TikTok-like1': 'Like Video 1',
      'TikTok-like2': 'Like Video 2',
      'TikTok-like3': 'Like Video 3',
      'TikTok-like4': 'Like Video 4',
      'TikTok-like5': 'Like Video 5',
      'Website-visit1': 'Visit Website 1',
      'Website-visit2': 'Visit Website 2',
      'Website-visit3': 'Visit Website 3',
      'Website-visit4': 'Visit Website 4',
      'Website-visit5': 'Visit Website 5',
      'Instagram-flw1': 'Follow Account 1',
      'Instagram-flw2': 'Follow Account 2',
      'Instagram-flw3': 'Follow Account 3',
      'Instagram-flw4': 'Follow Account 4',
      'Instagram-flw5': 'Follow Account 5',
      'Instagram-like1': 'Like Post 1',
      'Instagram-like2': 'Like Post 2',
      'Instagram-like3': 'Like Post 3',
      'Instagram-like4': 'Like Post 4',
      'Instagram-like5': 'Like Post 5',
      'Facebook-like1': 'Like Page 1',
      'Facebook-like2': 'Like Page 2',
      'Facebook-like3': 'Like Page 3',
      'Facebook-like4': 'Like Page 4',
      'Facebook-like5': 'Like Page 5',
      'Facebook-grp1': 'Join Group 1',
      'Facebook-grp2': 'Join Group 2',
      'Facebook-grp3': 'Join Group 3',
      'Facebook-grp4': 'Join Group 4',
      'Facebook-grp5': 'Join Group 5',
      'Advance Option-pass': 'Enter Password',
      'Advance Option-note': 'Add Note',
      'Advance Option-exp': 'Set Expiration',
      'Advance Option-thumb': 'View Thumbnail',
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
            />
            <AnimatedInput
              icon={FaSubscript}
              placeholder="Enter Subtitle (optional)"
              inputId="subtitle"
              suggestions={inputHistory["topLevel-subtitle"] || []}
              onChange={(e) => handleTopLevelInputChange("subtitle", e.target.value)}
              disabled={loading}
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
            />
            <AnimatedInput
              icon={FaLink}
              placeholder="Enter Target Link"
              inputId="tlink1"
              suggestions={inputHistory["topLevel-tlink1"] || []}
              onChange={(e) => handleTopLevelInputChange("tlink1", e.target.value)}
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
            {socialButtonsPreview.map(({ platform, action }) => {
              const Icon = getIconForAction(platform, action);
              return (
                <div
                  key={`${platform}-${action}`}
                  className="w-full flex items-center bg-purple-600 text-white py-3 px-5 rounded-full shadow-md relative group"
                  style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)' }}
                >
                  <Icon className="mr-3 text-lg" />
                  <div className="flex-1 text-center">
                    {getButtonText(platform, action)}
                  </div>
                  <div className="p-2 rounded-full bg-opacity-20 bg-white">
                    <FaArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              );
            })}

            {targetButtonsPreview.map(({ action }) => (
              <div
                key={`Target-${action}`}
                className="w-full flex items-center bg-gray-600 text-white py-3 px-5 rounded-full shadow-md relative group"
                style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)' }}
              >
                <FaLink className="mr-3 text-lg" />
                <div className="flex-1 text-center">
                  {getButtonText('Target', action, formData.buttonName)}
                </div>
                <div className="p-2 rounded-full bg-opacity-20 bg-white">
                  <FaArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
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
